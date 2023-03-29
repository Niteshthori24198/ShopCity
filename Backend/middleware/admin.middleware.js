require('dotenv').config();

const jwt = require('jsonwebtoken');

const UserModel = require('../model/user.model')




const AdminAuth = async (req,res,next)=>{


    const authToken = req.headers['authorization'];

    if(!authToken){

        return res.status(400).send({

            "msg":"Kindly Login First to Access Protected Routes.",
            "Code":400,
            "error":"Invalid Access",
            "Success":false

        })

    }

    const token = authToken.trim().split(' ')[1];

    try {
        
        const decoded = jwt.verify(token , process.env.SecretKey);

        if(decoded){

            const user = await UserModel.findById({_id:decoded.UserID})

            if(user.isAdmin){

                req.body.UserID = decoded.UserID;

                next()

            }

            else{

                return res.status(400).send({

                    "error":"Access Denied!! Unauthorized access detected.",
                    "Code":400,
                    "Success":false

                })

            }

        }

        else{

            return res.status(400).send({
                "error":"Invalid Token Found!",
                "Code":400,
                "Success":false
            })

        }


    } 
    
    catch (error) {
        
        return res.status(400).send({
            "error":error.message,
            "msg":"Something Wrong with Token",
            "Success":false,
            "Code":400
        })

    }

}





module.exports = AdminAuth;