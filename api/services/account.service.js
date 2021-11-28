const Account= require("../models/account.model");
const bcrypt =require ("bcryptjs")
const salt=bcrypt.genSaltSync(10);

let handleUserLogin= (dataLogin)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            password=dataLogin.password;
            email=dataLogin.email;
            let userData={};
            let isExsit=await checkUserEmail(email);
            if(isExsit){
                let user=await Account.findOne({
                    attributes:['email','role','password','demographic_id'],//select
                    where:{email:email},
                    raw:true
                });
                if(user){
                    let check=await bcrypt.compareSync(password,user.password);
                    if(check){
                        userData.errCode=0;
                        userData.errMessage="Ok";
                        delete user.password;//sau khi attributes ma muon an thuoc tinh nao thi delete
                        userData.user=user;
                    }else{
                        userData.errCode=3;
                        userData.errMessage="wrong password";
                    }
                }else{
                    userData.errCode=2;
                    userData.errMessage="User not found";
                }
            }else{
                userData.errCode=1;
                userData.errMessage="Your email isn't exsit"
            }
            resolve(userData);
        }catch(er){
            reject(er);
        }
    });
}

let createUserAccount=(dataRegister)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let userData={};
            let isExsit=await checkUserEmail(dataRegister.email);//kiem tra email co ton tai
            if(isExsit){
                userData.errCode=1;
                userData.errMessage="Your email has already exsited"
            }else{
                let hashPasswordFromBcrypt=await hashUserPassword(dataRegister.password);
                await Account.create({
                    email:dataRegister.email,
                    password:hashPasswordFromBcrypt,
                    role:dataRegister.role,
                    demographic_id:dataRegister.demographic_id
                })
                userData.errCode=0;
                userData.errMessage="Ok";
                delete dataRegister.password;
                userData.user=dataRegister;
            }
            resolve(userData);
        }catch(er){
            reject(er);
        }
    })
}
let checkUserEmail=async(userEmail)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let user=await Account.findOne({
                where:{email: userEmail}
            })
            if(user){
                resolve(true);
            }else{
                resolve(false);
            }
        }catch(err){
            reject(err);
        }
    })
}
let hashUserPassword=(password)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let hashPassword=await bcrypt.hashSync(password,salt);
            resolve(hashPassword);
        }catch(ex){
            reject(ex);
        }
    })
}
module.exports={//luu y jo duong exports={handleUserLogin:handleUserLogin}  vi se co lôi handleUserLogin is not function=>luc nao cung dung module.export
    handleUserLogin:handleUserLogin,
    createUserAccount:createUserAccount
}