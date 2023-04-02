require('dotenv').config();

const jwt = require('jsonwebtoken');



const Auth = (req,res,next)=>{


    const authToken = req.headers['authorization'];

    console.log("---~~~~~~ >>> token ", authToken)

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

            "msg":"Something Wrong with the Token passed",

            "Success":false,

           
        })

    }

}





module.exports = Auth;