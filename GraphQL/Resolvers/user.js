require("dotenv").config();
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const auth = require("../../middleware/auth");
const userModel = require("../../models/users/user-model");
const Sendotp = require("../../HelperFunction/Sendotp");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { registerValidation } = require("../../Validation");
function generateToken(user) {
  console.log(user.role);
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      role:user.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7h" }
  );
}

const user = {
    Query:{
      getAllUser:async(_,arg, context)=>{
        try{ 
          let authuser=auth(context.token)
            if(authuser){
              const userData=await userModel.find().exec();
              if(!userData){ return new  GraphQLError("NO user found"); } 
               return userData
            }
           
               
        }catch(error){
          throw new GraphQLError(error);
        }

      }
    },

  Mutation:{
  register: async (_,{ registerInput: { username, email, password, confirmPassword, role } }) => {
    try {
      const valid = registerValidation({
        username,
        email,
        password,
        confirmPassword,
      });
      if (valid) {
      console.log(valid);
        if (password !== confirmPassword) {
          return new GraphQLError("Password not match");
        }
        const UserExist = await userModel.findOne({
          email: email.toLowerCase().trim(),
        });
        if (UserExist) {
          return new GraphQLError("This Email  alredy register");
        }

        // hash password and create an auth token
        let Newpassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
          email: email.toLowerCase().trim(),
          username,
          role,
          password: Newpassword,
          createdAt: new Date().toISOString(),
        });
        const result = await newUser.save();
        const token = generateToken(result);
        return {
          ...result._doc,
          id: result._id,
          token,
          status: true,
          message: "Register successfully",
        };
        // Return the result directly without wrapping it in an object
      }
    } catch (error) {
      // console.error("Registration failed:", error);
      // Handle any errors that occur during user registration
     return  new GraphQLError(error.message);
    }
  },

  login: async (_, { loginInput: { email, password } }) => {
    try {

      const user = await userModel.findOne({
        email: email.toLowerCase().trim(),
      });

      // check user
      if (!user) {
        return new GraphQLError("Email not Found")
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match)  throw new GraphQLError("Password not match");
      
      // Generate token
      const token = generateToken(user);

      return {
        id: user._id,
        email: user.email,
        token,
        status: true,
        message: "login successfull",
      };
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  },

  forgot: async (_, { email }) => {
    try {
      if (email == "") throw new GraphQLError("Please Enter the email");
      const user = await userModel.findOne({ email: email });
      if (!user) throw new GraphQLError("This email is not registered");
      if (user) {
        let otp = otpGenerator.generate(4, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        const { status, statusCode } = await Sendotp(otp, user.email);
        if (status) {
           await userModel.updateOne({ email }, { otp: otp});
          const accessToken = generateToken(user);
          return {
            otp,
            email,
            token: accessToken,
            status: status,
            statusCode: statusCode,
            message: "opt send  successfully",
          };
        } else {
          throw new GraphQLError("OTP not send please try again");
        }
      }
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  },
  checkOTP: async (_, { otp }, context) => {
    try {
      const { token } = context;

      // Otp is empty
      if (otp == ""){ 
        return  new GraphQLError("Otp Can not be Empty") ;
      }
      let userAuth = auth(token); 
      const findOtpUser = await userModel.findOneAndUpdate({ _id: userAuth.id },{$set:{otpstate:true}});
      
      //check opt is expire or not
      if(findOtpUser.otp==null){ 
        return new GraphQLError("You opt is expire");
      }
     
      
      if (findOtpUser.otp === otp) {

        return {
          email: userAuth.email,
          username: userAuth.username,
          status: true,
        };
      } else {
        return  new GraphQLError("Otp not matched")
        
      }
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  },
  resetPassword: async (_, { newPassword, confirmPassword }, context) => {
    try {
      // Validate input fields
      if (newPassword === "" || confirmPassword === "") {
        throw new Error("Please fill all the input fields.");
      }
      // Authenticate the user
      const userAuth = auth(context.token);
    
      // Find the user by ID
      const user = await userModel.findOne({ _id: userAuth.id });
      if (!user.otpstate) {
        throw new Error("Please verify the OTP");
      }
    
      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        throw new Error("Password not match");
      }
    
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);
    
      // Update the user's password and clear OTP
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: userAuth.id },
        { $set: { password: newPasswordHash, otp: "", otpstate: false } }
      );
    
      if (!updatedUser) {
        throw new Error("Password not changed. Please try again.");
      }
    
      return "Password changed";
    } catch (error) {
      throw new Error(error.message);
    }
  },
  deleteUser:async(_,{id},context)=>{
       try{ 
        if(id=="" || id==null){
          return new GraphQLError("Porovide the user ID");
        }
        console.log(id);
        // let authUser=auth(context.token);
        // console.log(authUser);
        const deleteData=await userModel.findByIdAndDelete({_id:id})
        if(deleteData){
          return {
            id:deleteData.id,
            username:deleteData.username,
            email:deleteData.email,
            status:true,
            message:"Delete successfully",
          }
        }

    
       }catch(error){
        console.log("error",error);
        return new GraphQLError("Error",error);
       }
  },
  
}



};

module.exports = user
