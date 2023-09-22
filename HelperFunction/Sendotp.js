const nodemailer=require('nodemailer');
const { GraphQLError } = require("graphql");
require("dotenv").config();
console.log();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host:process.env.EMAIL_HOST, 
    port: 587,
    secure: false,
    requireTLS: false,
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });
const Sendotp= async (otp,email)=>{
      const mailOtpion={
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "OTP for password change",
        text:"OTP",
        html: `Your OTP for passsword change is ${otp}`,
      };
      const sendmailinfo=await transporter.sendMail(mailOtpion);
       if(sendmailinfo.messageId){
        return {status:true , statusCode: 200,message:sendmailinfo};
       }else{
        return {status:false,message:new GraphQLError(sendmailinfo)}
       }
      
}
module.exports=Sendotp;