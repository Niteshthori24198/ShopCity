
const UserModel = require('../model/user.model');

const bcrypt = require('bcrypt');

require('dotenv').config();

const jwt = require('jsonwebtoken');



const RegisterUser = async (req, res) => {

    const { Email, Name, Password, Location, Gender, Contact } = req.body;

    if (!Email || !Name || !Password || !Location || !Contact || !Gender) {

        return res.status(400).send({

            "error": "Kindly Provide All Required Details.",
            "Code": 400,
            "Success": false

        })

    }

    if (!(Gender == 'Male' || Gender == 'Female')) {

        return res.status(400).send({

            "error": "Kindly Provide Valid Gender details.",
            "Code": 400,
            "Success": false

        })
    }

    /* don't touch this line */ 

    
    const isAdmin = false;


    /* don't touch this line */ 


    bcrypt.hash(Password, 6, async (err, hash) => {

        if (err) {

            return res.status(400).send({

                "msg": " Oops ! Something Went Wrong. Kindly retry once.",
                "error": err.message,
                "Success":false
            })

        }

        else {

            try {

                const user = new UserModel({ Email, Name, Password: hash, Location, Gender, Contact, isAdmin });

                await user.save();

                return res.status(200).send({

                    "msg": "Registration has been done Successfully.",

                    "Success": true,

                    "Data": user,

                    "Code": 200

                })

            }

            catch (error) {

                return res.status(400).send({

                    "error": error.message,

                    "Success": false,

                    "Code": 400,

                    "Message": "User Already Registered with us. Kindly Login."
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
                        "msg": "Kindly Enter correct Password. Invalid Password !",
                        "Code": 400,
                        "Success": false
                    })

                }

                else {

                    return res.status(200).send({
                        "msg": "Login Successfull.",
                        "Code": 200,
                        "Success": true,
                        "token": jwt.sign({ UserID: verifyuser._id }, process.env.SecretKey, { expiresIn: '12h' })
                    })

                }


            })


        }

        else {

            return res.status(400).send({

                "msg": "Kindly Register First. User Doesn't Exists.",
                "Code": 400,
                "error": "404! User Not Found! ",
                "Success":false

            })

        }

    }

    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "Success": false,

            "Code": 400,

            "Message": "Something Went Wrong !"
        })
    }


}




const GetUser = async (req,res)=>{

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



module.exports = {

    RegisterUser,
    LoginUser,
    GetUser

}