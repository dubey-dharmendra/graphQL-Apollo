const mongoose = require("mongoose");
const bcrypt=require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, required: true, lowercase: true, index: true },
    password: { type: String, require: true },
    role: { type: String, enum:['admin','subadmin',"user"],default:"user"},
    otp:{type:Number,default:null},
    otpstate:{type:Boolean,default:false},
    createdAt: { type: Date, required: true },
}); 

UserSchema.pre("save",async function(next){
    if (!this.isModified("password")) {
        next();
      }
      this.Newpassword = await bcrypt.hash(this.password, 10);
      next();
});

module.exports=new mongoose.model("users",UserSchema);



