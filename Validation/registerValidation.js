const joi=require("joi");
const { GraphQLError } = require("graphql");
console.log( GraphQLError);
const registerValidation=(data) => {
    const schema=joi.object({
     username:joi.string().alphanum().min(3).required(),
     email:joi.string().email().lowercase().required(),
     password:joi.required(),
     confirmPassword:joi.required(),
});

   const {error}=schema.validate(data);
   if(error) {
     throw new GraphQLError(error.details[0].message);
   }else{
    return true
   }
}
module.exports=registerValidation;