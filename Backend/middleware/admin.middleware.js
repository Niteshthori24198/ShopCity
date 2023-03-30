
require('dotenv').config();

const jwt = require('jsonwebtoken');

const UserModel = require('../model/user.model')




const AdminAuth = async (req,res,next)=>{


    const authToken = req.headers['authorization'];

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

            const user = await UserModel.findById( { _id: decoded.UserID } )

            if(user.isAdmin){

                req.body.AdminID = decoded.UserID;

                next()

            }

            else{

                return res.status(400).send({

                    "error":"Access Denied!! Unauthorized access detected.",
                   
                    "Success":false

                })

            }

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

            "msg":"Something Wrong with the Token.",

            "Success":false,
          

        })

    }

}





module.exports = AdminAuth;