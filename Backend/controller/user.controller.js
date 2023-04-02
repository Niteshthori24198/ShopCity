
const UserModel = require('../model/user.model');

const bcrypt = require('bcrypt');

require('dotenv').config();

const jwt = require('jsonwebtoken');



const RegisterNewUser = async (req, res) => {

    const { Email, Name, Password, Location, Gender, Contact } = req.body;


    if (!Email || !Name || !Password || !Location || !Contact || !Gender) {

        return res.status(400).send({

            "error": "Kindly Provide All Required Details for Registration.",
           
            "Success": false

        })

    }

    if (!(Gender == 'Male' || Gender == 'Female')) {

        return res.status(400).send({

            "msg": "Kindly Provide a Valid Gender details as : { Male/Female } only.",
          
            "Success": false

        })
    }


    /* don't touch this line */ 

    
    const isAdmin = false;


    /* don't touch this line */ 


    bcrypt.hash(Password, 7, async (err, hash) => {

        if (err) {

            return res.status(400).send({

                "msg": " Oops ! Something Went Wrong here. Kindly retry once after sometime.",

                "error": err.message,

                "Success":false,
              
            })

        }

        else {

            try {

                const user = new UserModel({ Email, Name, Password: hash, Location, Gender, Contact, isAdmin });

                await user.save();

                return res.status(200).send({

                    "msg": "Your Registration has been done Successfully.You can login with your crendentials.",

                    "Success": true,

                    "UserData": user,


                })

            }

            catch (error) {

                return res.status(400).send({

                    "error": error.message,

                    "Success": false,

                    "msg": "User is Already Registered with us. Kindly Login using crendentials."
                })

            }



        }

    })


}




const LoginUser = async (req, res) => {

    const { Email, Password } = req.body;

    try {

        const verifyuser = await UserModel.findOne({ Email });

        if (verifyuser) {

            bcrypt.compare(Password, verifyuser.Password, (err, result) => {

                if (!result) {

                    return res.status(400).send({

                        "msg": "Kindly Enter correct Password. Password entered is Invalid !",
                        
                        "Success": false
                    })

                }

                else {

                    return res.status(200).send({

                        "msg": "Login has been Successfull.",
                       
                        "Success": true,

                        "token": jwt.sign({ UserID: verifyuser._id }, process.env.SecretKey, { expiresIn: '24h' })
                    })

                }


            })


        }

        else {

            return res.status(400).send({

                "msg": "Kindly Register yourself First. User Doesn't Exists at all.",
               
                "error": "User Not Found! ",

                "Success":false

            })

        }

    }

    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "Success": false,

            "msg": "Something Went Wrong !"
        })
    }


}




const GetUserData = async (req,res)=>{

    const { UserID } = req.body;

    try {
        
        const user = await UserModel.findById({_id:UserID});

        res.status(200).send({

            "Success":true,
            "Code":200,
            "UserData":user

        })


    } 
    
    catch (error) {
        
        res.status(400).send({
            "error":error.message,
            "Code":400,
            "Success":false,
            "msg":"Something Went Wrong!"
        })

    }


}




const updateUserData = async (req,res) => {

    const { UserID } = req.body;

    const payload = req.body;

    if(payload.Gender || payload.Gender=='' || payload.Gender===null){

        if (!(payload.Gender == "Male" || payload.Gender == "Female")) {

            return res.status(400).send({

                "msg": "Gender provided must be either Male or Female",
               
                "Success": false

            })

        }

    }
    

    try {

        const user = await UserModel.findById( { _id : UserID } );

        if(user){

            payload.isAdmin = user.isAdmin;

            if(payload.Email === 'admin@gmail.com'){

                payload.Email = 'admin@gmail.com';

            }
    
            await UserModel.findByIdAndUpdate( { _id : UserID }, payload )
    
            const updatedUser = await UserModel.findById( { _id : UserID } )
    
            return res.status(200).send({

                "Success":true,

                "msg": "User Details has been updated Successfully.",

                "UserData" : updatedUser
            })
            
        }
        
        else{
            
            return res.status(404).send({

                "Success":false,

                "msg": "User Doesn't Exits."

            })

        }
        
    }
    
    catch (error) {

        return res.status(400).send({

            "Success":false,

            "msg": "Something Went Wrong",

            "error" : error.message
        })

    }


}



const deleteUserProfile = async (req,res) => {

    const { UserID } = req.body;

    try {

        const user = await UserModel.findById( { _id : UserID } );

        if(user){


            if(user.Email === 'admin@gmail.com'){
                
                return res.status(400).send({
                    "msg":"Access Denied. Can't remove standard Crendentials.",
                    "Success":false,
                    "Code":400

                })
            }
    
            const deletedUser = await UserModel.findByIdAndDelete( { _id : UserID } )
    
            return res.status(200).send({
                "Code":200,
                "Success":true,
                "msg": "User has been deleted Successfully.",
                "UserData": deletedUser
            })
            
        }
        
        else{
            
            return res.status(404).send({
                "Code":404,
                "Success":false,
                "msg": "User Doesn't Exits."
            })

        }
        
    } 
    
    catch (error) {

        return res.status(400).send({
            "Code":400,
            "Success":false,
            "msg": "Something Went Wrong",
            "error" : error.message
        })

    }


}




const updateUserRole = async (req,res) => {

    const {UserID, isAdmin} = req.body

    try {
        
        const user = await UserModel.findById( { _id : UserID } );

        if(user.Email === 'admin@gmail.com'){

            return res.status(400).send({

                "Success": false,
               
                "msg" : "Access Denied !! ---> You can't update this account as it's Standard crendentials."

            })

        }

        await UserModel.findByIdAndUpdate( {_id : UserID }, { isAdmin } )

        return res.status(200).send({

            "Success": true,
           
            "msg" : "User Role has been Updated Successfully.User Promoted to be admin"

        })

    } 
    
    catch (error) {
        
        return res.status(400).send({

            "Success": false,
           
            "msg" : "Something Went Wrong",

            "error" : error.message
        })

    }

}





const getAllUsersData = async (req, res) => {

    let {search, limit, page, isAdmin} = req.query;

    if(!limit){

        limit = 10
    }

    try {

        const searchFilter = new RegExp(search, 'i');

        if(isAdmin === undefined){

            const users = await UserModel.find( { Name : searchFilter } ).skip(limit*(page-1)).limit(limit)

            return res.status(200).send({

                "Success" : true,

                "UsersData" : users ,

                "msg" : "User data fetched Successfully."
            })

        }
        
        else{

            const users = await UserModel.find( { Name : searchFilter, isAdmin } ).skip(limit*(page-1)).limit(limit)
    
            return res.status(200).send({

                "Success" : true,
                
                "UsersData" : users ,

                "msg" : "User data fetched Successfully."
            })

        }

    } 
    
    catch (error) {
        
        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong!",
           
            "Success": false
        })

    }

}




module.exports = {

    RegisterNewUser,
    LoginUser,
    GetUserData,
    updateUserData,
    deleteUserProfile,
    updateUserRole,
    getAllUsersData

}