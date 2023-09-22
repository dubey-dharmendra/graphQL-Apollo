
const { GraphQLError } = require("graphql");
require("dotenv").config();
const jwt=require("jsonwebtoken");
const auth=(token)=>{
      token=token.split(" ")[1];
    let userinfo=null
     if(!token) throw new GraphQLError("Token  Not Found") ;
     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,user)=>{
        if(error){
           throw new GraphQLError("Authorization is Failed")
        }else{
           userinfo=user;
        }
        
     });
     return  userinfo;
}

module.exports=auth;