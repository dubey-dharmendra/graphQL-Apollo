/* 19-09-2023

Learning  GraphQl and implement the GraphQl in node js

make a register  api in GraphQl  




//   1.Register is the mutaion opertaion name
//   2 registerInput is the variable
//   3 RegisterInput is the typeof the variable
//   4.register the the function  which take the registerInput arguments Values 

mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    id
    username
    email
    token
  }
}

{
  "registerInput": {
    "email": "vishal@gmail.com",
    "username": "vishal12334",
    "role":"Admin",
    "password": "vishal123123",
    "confirmPassword": "vishal123123",
  }
}

// ===========login api==========

mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    id
    email
    token
    status
    message
  }
}
    //  send data example
{
  "loginInput": {
    "email": "vishal.vishwakarma@psiborg.in",
    "password":"vishal321"
  }
}


// ==========forgot api (send otp)=============
mutation Forgot($email: String!) {
  forgot(email: $email) {
    token
    otp
    email
    status
  }

  {
  "email": "vishal.vishwakarma@psiborg.in"
}


// =============check OTP===========
mutation CheckOTP($otp: Int) {
  checkOTP(otp: $otp) {
    status
    email
  }
}
{
  "otp": 8851
}

// ============reset password=========
mutation ResetPassword($newPassword: String, $confirmPassword: String) {
  resetPassword(newPassword: $newPassword, confirmPassword: $confirmPassword) {
    status
  }
}

{
  "newPassword": "vishal321",
  "confirmPassword": "vishal321"
}


// ================Delete user==============
 ====mutation
 mutation DeleteUser($deleteUserId: String!) {
  deleteUser(id: $deleteUserId) {
    id
    message
    status
    email
  }
}
variable=
{
  "deleteUserId": "650c193827d88e7d2e3ad204"
}
   ===========Query get all user data example========
query GetAllUser {
  getAllUser {
    id
    email
    username
    role
  }
}
*/

