const { gql } = require("graphql-tag");

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    role: String
    otp: String
    createdAt: String!
    status:String!
    message:String!
  }
  
  input RegisterInput {
    username: String!
    email: String!
    role:String
    password: String!
    confirmPassword: String!
  }

  input LoginInput{
    email:String!
    password:String!
  }

  type forgetPasswordUser {
    email: String
    otp: Int
    token: String
    status: String
    message:String
  }
 type getUser{
   id:ID
    username:String
    email:String
    role:String
 }



  type Query {
    getAllUser: [User]
  }


  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(loginInput:LoginInput!):User!
    forgot(email:String!):forgetPasswordUser!
    checkOTP(otp:Int):forgetPasswordUser!
    resetPassword(newPassword:String,confirmPassword:String):forgetPasswordUser!
    deleteUser(id:String!):User!
  }
`;

module.exports = typeDefs;
