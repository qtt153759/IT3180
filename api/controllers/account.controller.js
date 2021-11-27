const accountService  = require('../services/account.service');
const {userValidator} = require('../helpers/validator');
//ham login
let handleLogin= async(req,res)=>{
    const{error}=userValidator(req.body);//validate
    if(error)return res.status(400).send(error.details[0].message);

    let userData=await accountService.handleUserLogin(req.body);//tao file accountservice rieng cho gon
    console.log(userData);
    return res.status(200).json({
        errCode:userData.errCode,
        message:userData.errMessage,
        user:userData.user?userData.user:{}
    });
}
//ham tao tai khoan
let createAccount=async(req,res)=>{
    const{error}=userValidator(req.body);//validate
    if(error)return res.status(400).send(error.details[0].message);

    let userData=await accountService.createUserAccount(req.body);//tao file accountservice rieng cho gon
    console.log(userData);
    return res.status(200).json({
        errCode:userData.errCode,
        message:userData.errMessage,
        user:userData.user?userData.user:{}
    });
}
module.exports ={
    handleLogin:handleLogin,
    createAccount:createAccount
}