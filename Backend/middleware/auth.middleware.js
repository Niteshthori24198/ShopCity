require('dotenv').config();

const jwt = require('jsonwebtoken');
const UserModel = require('../model/user.model');
const BlacklistModel = require('../model/blacklist.model');



const Auth = async (req,res,next)=>{


    const authToken = req.headers['authorization'];

    // console.log("--- auth MW >>> token ", authToken)

    if(!authToken){

        return res.status(400).send({

            "msg":"Kindly Login First to Access Protected Routes.",
           
            "error":"Invalid Access Detected.",

            "Success":false

        })

    }

    const token = authToken.trim().split(' ')[1];

    try {
        
        const decoded = jwt.verify(token , process.env.SecretKey);

        if(decoded){

            const isBlacklist = await BlacklistModel.findOne({token:token})
            if(isBlacklist){
                return res.status(400).send({
                    error : "Your Access Token is Blacklisted. (Kindly Login Again)",
                    msg : "Kindly Login Again",
                    Success : false
                })
            }

            const userInfo = await UserModel.findById( { _id: decoded.UserID });
            if(userInfo.isBlocked){
                return res.status(400).send({
                    error : "Your Account is Blocked by Admin.(Contact To manager.)",
                    msg : "User is Blocked",
                    Success : false
                })
            }

            req.body.UserID = decoded.UserID;

            next()

        }

        else{

            return res.status(400).send({

                "error":"Token found to be Invalid.",
              
                "Success":false
            })

        }


    } 
    
    catch (error) {
        
        return res.status(400).send({

            "error":error.message,

            "msg":error.message,

            "Success":false,

           
        })

    }

}





module.exports = Auth;