
const UserModel = require('../model/user.model');

const QueryModel = require('../model/query.model');

const bcrypt = require('bcrypt');

require('dotenv').config();

const jwt = require('jsonwebtoken');

const nodemailer = require("nodemailer");


// AWS S3

// sharp is used for image resizing
const sharp = require('sharp');

// crypto is used for generate unique image name
const crypto = require('crypto')
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// aws s3 services 
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const BlacklistModel = require('../model/blacklist.model');

// aws s3 bucket credentials
const bucketName = process.env.bucketName
const bucketRegion = process.env.bucketRegion
const accessKey = process.env.accessKey
const secretAccessKey = process.env.secretAccessKey

// aws s3 client
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})



const uploadProfileImage = async (req, res) => {
    console.log(req.body);
    const { UserID } = req.body
    console.log('userid for profile image :- ', UserID);

    console.log(req.file);
    if (!req.file) {
        return res.status(400).send({

            "error": "Image Not Found",

            "msg": "Kindly Pass Only JPEG or PNG Image",

            "Success": false

        })

    }
    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
        console.log('Invalid File Type');
        return res.status(400).send({

            "error": "Invalid File Type",

            "msg": "Kindly Pass Only JPEG or PNG Image",

            "Success": false

        })
    }
    try {

        const userInfo = await UserModel.findById({ _id: UserID })
        if (!userInfo) {
            return res.status(400).send({
                "error": "User Not Found",
                "msg": "User Not Found",
                "Success": false
            })
        }

        if (userInfo.S3_Url) {
            const params = {
                Bucket: bucketName,
                Key: userInfo.S3_Url
            }
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
            console.log('successfully deleted image from s3');
        }

        const buffer = await sharp(req.file.buffer).resize({ width: 400, height: 400, fit: "contain" }).toBuffer()

        const ImageName = randomImageName()

        const params = {
            Bucket: bucketName,
            Key: ImageName,
            Body: buffer,
            ContentType: req.file.mimetype
        }

        console.log('params for s3 ', params);

        const command = new PutObjectCommand(params)
        await s3.send(command)

        console.log('Product Image uploaded successfully to s3');
        const getObjectParams = {
            Bucket: bucketName,
            Key: ImageName
        }
        const command1 = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command1, { expiresIn: 604800 });
        console.log(url);




        // Get the current date
        const currentDate = new Date();

        // Add 7 days to the current date
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 7);

        // Remove 20 minutes from the future date
        futureDate.setMinutes(futureDate.getMinutes() - 20);
        console.log(futureDate);

        await UserModel.findByIdAndUpdate({ _id: UserID }, { Image: url, S3_Url: ImageName, S3_Url_ExipreDate: futureDate })




        return res.status(200).send({
            "msg": "Your Profile Image has been Successfully Uploaded",
            "Success": true
        })


    } catch (error) {

        return res.status(400).send({
            "error": error.message,
            "msg": "Something Went Wrong",
            "Success": false
        })

    }
}

const removeProfileImage = async (req, res) => {
    console.log(req.body);
    const { UserID } = req.body
    try {
        const userInfo = await UserModel.findById({ _id: UserID })
        if (!userInfo) {
            return res.status(400).send({
                "error": "User Not Found",
                "msg": "User Not Found",
                "Success": false
            })
        }
        if (userInfo.S3_Url) {
            const params = {
                Bucket: bucketName,
                Key: userInfo.S3_Url
            }
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
            console.log('successfully deleted image from s3');
        }
        await UserModel.findByIdAndUpdate({ _id: UserID }, {
            S3_Url: null, S3_Url_ExipreDate: null,
            Image: 'https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png'
        })

        return res.status(200).send({
            "msg": "Your Profile Image has been Successfully Deleted",
            "Success": true
        })

    } catch (error) {
        return res.status(400).send({
            "error": error.message,
            "msg": "Something Went Wrong",
            "Success": false
        })
    }
}





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


    let userVerifiedFlag = true

    try {
        const userPresent = await UserModel.findOne({ Email })
        if (userPresent) {
            userVerifiedFlag = false
            if (userPresent.isMailVerified) {
                return res.status(400).send({

                    "Success": false,

                    "msg": "User is Already Registered with us. Kindly Login using crendentials."
                })
            } else {
                // send new Email For Verification 
                const result = await sendEmailForVerification(userPresent._id, Name, Email)
                console.log('mail send verification result=> ', result);

                if (result) {
                    return res.status(400).send({
                        "Success": true,
                        "msg": "Kindly Verify Your Email Id.(Email Sent Successfully)"
                    })
                } else {
                    return res.status(400).send({
                        "Success": false,
                        "msg": "Something Went Wrong .Try After Some Time"
                    })
                }

            }
        }
    } catch (error) {
        return res.status(500).send({
            "error": error.message,
            "Success": false,
            "msg": "Internal Server Error"
        })
    }

    if (userVerifiedFlag) {
        bcrypt.hash(Password, 7, async (err, hash) => {

            if (err) {

                return res.status(400).send({
                    "msg": " Oops ! Something Went Wrong here. Kindly retry once after sometime.",
                    "error": err.message,
                    "Success": false,
                })

            } else {

                try {

                    const user = new UserModel({ Email, Name, Password: hash, Location, Gender, Contact, isAdmin });

                    await user.save();

                    // Email Send For Verification
                    const result = await sendEmailForVerification(user._id, Name, Email)
                    console.log('mail send verification result=> ', result);

                    if (result) {
                        return res.status(400).send({
                            "Success": true,
                            "msg": "Your Registration has been successfully. (Kindly Verify Your Email)"
                        })
                    } else {
                        return res.status(400).send({
                            "Success": false,
                            "msg": "Something Went Wrong. Try After Some Time"
                        })
                    }

                } catch (error) {

                    return res.status(400).send({
                        "error": error.message,
                        "Success": false,
                        "msg": `Something Went Wrong. (${error.message})`
                    })

                }

            }

        })

    }


}





function sendEmailForVerification(userid, Name, Email) {

    console.log("new user for db => ", userid)

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'qr.insight.craft@gmail.com',
            pass: 'hnzadhtrmwbqcyui'
        }
    });

    const BaseUrl_Backend = `http://localhost:3000`

    const accessToken = jwt.sign({ UserID: userid }, process.env.SecretKey, { expiresIn: '6h' })

    let mailOptions = {
        from: 'qr.insight.craft@gmail.com',
        to: Email,
        subject: 'Email For User Verification',
        html: `<p>Hi ${Name} <br> Welcome ToShop City <br/> Please click here to 
        <a href="${BaseUrl_Backend}/user/confirm-email/${accessToken}">verify</a>  
        your Email. This Link is Expired in 6 hours</p>`
    };

    console.log('mailOptions => ', mailOptions)

    return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log("While Email Send error: ", err);
                reject(false);
            } else {
                console.log(`Mail sent successfully!`);
                console.log(info);
                resolve(true);
            }
        });
    });
}



const confirmEmail = async (req, res) => {
    const { userToken } = req.params;
    try {
        const decoded = jwt.verify(userToken, process.env.SecretKey);
        if (decoded) {
            console.log(decoded);
            const { UserID } = decoded

            await UserModel.findByIdAndUpdate({ _id: UserID }, { isMailVerified: true })

            return res.status(200).send(`
                <h1> Thank You. Your Email Is Verified Successfully. </h1>
            `)
        } else {
            return res.status(500).send(`
                <h1> OOps! This Links is expired. Kindly Register Again </h1>
            `)
        }
    } catch (error) {
        return res.status(500).send(`
            <h1> Internal Server Error(500).  ${error.message} </h1>
        `)
    }
}


const LoginUser = async (req, res) => {

    const { Email, Password } = req.body;

    try {

        const verifyuser = await UserModel.findOne({ Email });

        if (verifyuser) {

            console.log('user data =>',verifyuser);
            if (!verifyuser.isMailVerified) {
                return res.status(400).send({

                    "msg": "Kindly Verify Email ID.",

                    "error": "Email is Not Verified ",

                    "Success": false

                })
            }
            if(verifyuser.isBlocked){
                return res.status(400).send({

                    "msg": "Kindly Contact To Manager",

                    "error": "Your account is blocked by Admin.(Contact To manager.)",

                    "Success": false

                })
            }

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

                "Success": false

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



const requestForgotPassword = async (req, res) => {
    const { Email } = req.body;
    console.log(Email);
    if (!Email) {
        return res.status(400).send({
            "msg": "Kindly Pass the Email ID in Body.",
            "error": "Email  Not Found",
            "Success": false
        })
    }
    try {
        const userPresent = await UserModel.findOne({ Email });
        if (userPresent) {
            // email send for forgot password

            const result = await sendEmailForForgotPassword(userPresent._id, userPresent.Name, userPresent.Email)
            console.log('mail send verification result=> ', result);

            if (result) {
                return res.status(400).send({
                    "Success": true,
                    "msg": "Reset password link is sent to you email."
                })
            } else {
                return res.status(400).send({
                    "Success": false,
                    "msg": "Something Went Wrong. Try After Some Time"
                })
            }

        } else {
            return res.status(400).send({
                "msg": "This Email is not registered with shopcity",
                "error": "Email Not Found",
                "Success": false
            })
        }
    } catch (error) {
        return res.status(400).send({
            "msg": "Something Went Wrong",
            "error": error.message,
            "Success": false
        })
    }
}


function sendEmailForForgotPassword(userid, Name, Email) {

    console.log("user id for forgot password => ", userid)

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'qr.insight.craft@gmail.com',
            pass: 'hnzadhtrmwbqcyui'
        }
    });

    const BaseUrl_Backend = `http://localhost:3000`

    const accessToken = jwt.sign({ UserID: userid }, process.env.SecretKey, { expiresIn: '30m' })

    let mailOptions = {
        from: 'qr.insight.craft@gmail.com',
        to: Email,
        subject: 'Email For Forgot Password',
        html: `<p>Hi ${Name} <br> Welcome To Shop City <br/> Please click here to
         <a href="${BaseUrl_Backend}/user/reset-password/?userToken=${accessToken}">forgot password</a>  
        your Email. This Link is Expired in 30 Minutes</p>`
    };

    console.log('mailOptions => ', mailOptions)

    return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log("While forgot password  Email Send error: ", err);
                reject(false);
            } else {
                console.log(`forgot password Mail sent successfully!`);
                console.log(info);
                resolve(true);
            }
        });
    });
}


const resetPassword = async (req, res) => {
    const { userToken } = req.query;

    try {
        const decoded = jwt.verify(userToken, process.env.SecretKey);
        if (decoded) {

            return res.sendFile('forgot-password.html', { root: './View' })

        } else {
            return res.status(404).send(`
                <h1> OOps! This Links is expired. Kindly Generate New Link For Reset Password. </h1>
            `)
        }
    } catch (error) {
        return res.status(400).send(`
            <h1> Error(400).  ${error.message} </h1>
        `)
    }
}


const saveNewPassword = async (req, res) => {
    const { UserID } = req.body;
    const { Password } = req.body;
    try {
        const userPresent = await UserModel.findById({ _id: UserID });

        if (userPresent) {
            const hashPass = bcrypt.hashSync(Password, 7);
            await UserModel.findByIdAndUpdate({ _id: UserID }, { Password: hashPass })

            return res.status(400).send({
                "msg": "Your Password Successfully Changed.",
                "Success": true
            })

        } else {
            return res.status(400).send({
                "msg": "Your Account Not Exit",
                "error": "User Not Found",
                "Success": false
            })
        }

    } catch (error) {
        return res.status(400).send({
            "msg": "Something Went Wrong",
            "error": error.message,
            "Success": false
        })
    }

}




const GetUserData = async (req, res) => {

    const { UserID } = req.body;

    try {

        const user = await UserModel.findById({ _id: UserID });

        // check if image is expire then generate new image link from  s3

        const currentDate = new Date();
        // Get the current date and get expiration date
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 7);
        futureDate.setMinutes(futureDate.getMinutes() - 20);


        if (user.S3_Url_ExipreDate && user.S3_Url_ExipreDate < currentDate) {
            user.S3_Url_ExipreDate = futureDate;

            const getObjectParams = {
                Bucket: bucketName,
                Key: user.S3_Url
            }
            const command1 = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command1, { expiresIn: 604800 });
            user.Image = url;
            await UserModel.findByIdAndUpdate({ _id: user._id }, { S3_Url_ExipreDate: futureDate, Image: url })
        }

        // check if image is expire then generate new image link from  s3

        res.status(200).send({

            "Success": true,
            "Code": 200,
            "UserData": user

        })


    }

    catch (error) {

        res.status(400).send({
            "error": error.message,
            "Code": 400,
            "Success": false,
            "msg": "Something Went Wrong!"
        })

    }


}




const updateUserData = async (req, res) => {

    const { UserID } = req.body;

    const payload = req.body;

    if (payload.Gender || payload.Gender == '' || payload.Gender === null) {

        if (!(payload.Gender == "Male" || payload.Gender == "Female")) {

            return res.status(400).send({

                "msg": "Gender provided must be either Male or Female",

                "Success": false

            })

        }

    }


    try {

        if (payload.Password) {
            const hashpass = bcrypt.hashSync(payload.Password, 7);
            payload.Password = hashpass;
        }


        const user = await UserModel.findById({ _id: UserID });

        if (user) {

            payload.isAdmin = user.isAdmin;

            if (payload.Email === 'admin.shopcity@gmail.com') {

                payload.Email = 'admin.shopcity@gmail.com';

            }

            await UserModel.findByIdAndUpdate({ _id: UserID }, payload)

            const updatedUser = await UserModel.findById({ _id: UserID })

            return res.status(200).send({

                "Success": true,

                "msg": "User Details has been updated Successfully.",

                "UserData": updatedUser
            })

        }

        else {

            return res.status(404).send({

                "Success": false,

                "msg": "User Doesn't Exits."

            })

        }

    }

    catch (error) {

        return res.status(400).send({

            "Success": false,

            "msg": "Something Went Wrong",

            "error": error.message
        })

    }


}



const deleteUserProfile = async (req, res) => {

    const { UserID } = req.body;

    try {

        const user = await UserModel.findById({ _id: UserID });

        if (user) {


            if (user.Email === 'admin.shopcity@gmail.com') {

                return res.status(400).send({
                    "msg": "Access Denied. You Can't remove standard Crendentials.",
                    "Success": false,
                    "Code": 400

                })
            }

            const deletedUser = await UserModel.findByIdAndDelete({ _id: UserID })

            return res.status(200).send({
                "Code": 200,
                "Success": true,
                "msg": "User has been deleted Successfully.",
                "UserData": deletedUser
            })

        }

        else {

            return res.status(404).send({
                "Code": 404,
                "Success": false,
                "msg": "User Doesn't Exits."
            })

        }

    }

    catch (error) {

        return res.status(400).send({
            "Code": 400,
            "Success": false,
            "msg": "Something Went Wrong",
            "error": error.message
        })

    }


}




const updateUserRole = async (req, res) => {


    const { UserID, isAdmin } = req.body

    // console.log("userid and role mile ---> ",UserID,isAdmin)

    try {

        const user = await UserModel.findById({ _id: UserID });

        if (user.Email === 'admin.shopcity@gmail.com') {

            return res.status(400).send({

                "Success": false,

                "msg": "Access Denied !! ---> You can't update this account as it's Standard crendentials."

            })

        }

        await UserModel.findByIdAndUpdate({ _id: UserID }, { isAdmin })

        return res.status(200).send({

            "Success": true,

            "msg": "User Role has been Updated Successfully !"

        })

    }

    catch (error) {

        return res.status(400).send({

            "Success": false,

            "msg": "Something Went Wrong",

            "error": error.message
        })

    }

}





const getAllUsersData = async (req, res) => {

    let { search, limit, page, isAdmin } = req.query;

    if (!limit) {

        limit = 10
    }

    try {

        const searchFilter = new RegExp(search, 'i');
        let users = []

        if (isAdmin === undefined) {

            users = await UserModel.find({ Name: searchFilter }).skip(limit * (page - 1)).limit(limit)

        }

        else {

            users = await UserModel.find({ Name: searchFilter, isAdmin }).skip(limit * (page - 1)).limit(limit)

        }




        // check if image is expire then generate new image link from  s3

        const currentDate = new Date();
        // Get the current date and get expiration date
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 7);
        futureDate.setMinutes(futureDate.getMinutes() - 20);

        for (let user of users) {

            if (user.S3_Url_ExipreDate && user.S3_Url_ExipreDate < currentDate) {
                user.S3_Url_ExipreDate = futureDate;

                const getObjectParams = {
                    Bucket: bucketName,
                    Key: user.S3_Url
                }
                const command1 = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command1, { expiresIn: 604800 });
                user.Image = url;
                await UserModel.findByIdAndUpdate({ _id: user._id }, { S3_Url_ExipreDate: futureDate, Image: url })
            }

        }

        // check if image is expire then generate new image link from  s3





        return res.status(200).send({

            "Success": true,

            "UsersData": users,

            "msg": "User data fetched Successfully."
        })

    }

    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong!",

            "Success": false
        })

    }

}



const updateUserPassword = async (req, res) => {

    const { UserID, currpass, newpass } = req.body;

    try {

        const user = await UserModel.findById({ _id: UserID })

        if (user) {


            const decryptoldpass = bcrypt.compareSync(currpass, user.Password)

            if (decryptoldpass) {

                const hashnewpass = bcrypt.hashSync(newpass, 7);

                const user = await UserModel.findByIdAndUpdate({ _id: UserID }, { Password: hashnewpass })

                return res.status(200).send({

                    "Success": true,

                    "UsersData": user,

                    "msg": "User Password has been Updated Successfully."
                })

            }
            else {
                return res.status(400).send({

                    "msg": "Kindly Enter Correct Current Password !",

                    "Success": false
                })
            }


        }
        else {
            return res.status(404).send({

                "Success": false,

                "msg": "User Doesn't Exists !"
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



const logout = async (req, res) => {
    const authToken = req.headers['authorization'];

    if (!authToken) {
        return res.status(400).send({

            "msg": "Token Not Found.",

            "error": "Token Not Found.",

            "Success": false

        })
    }

    const token = authToken.trim().split(' ')[1];

    try {

        const decoded = jwt.decode(token)
        console.log(decoded);
        const expireDate = new Date(decoded.exp * 1000);

        const newBlacklistToken = new BlacklistModel({
            token: token,
            expirationDate: expireDate
        })

        await newBlacklistToken().save()
        
        return res.status(200).send({

            "error": "no error",
    
            "Success": true,
            "msg": "Logout Successfull."
        })


    }

    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Wrong with the Token passed",

            "Success": false,


        })

    }
}



const clearExpiredBlacklistToken = async (req, res) => {
    try {
        const currentDate = new Date();
        await BlacklistModel.deleteMany({ expirationDate: { $lte: currentDate } });
        return res.status(200).send({
            "error": "no error",
            "Success": true,
            "msg": "Successfull Cleared Expired Blacklist Token. "
        })
    } catch (error) {
        return res.status(400).send({

            "error": error.message,

            "msg": "Something Wrong with the Token passed",

            "Success": false,


        })

    }
}



const blockUserAccount = async (req, res) => {
    const { accountId } = req.params;
    try {
        const userInfo = await UserModel.findById({ _id: accountId });
        if(userInfo.Email == 'admin.shopcity@gmail.com'){
            return res.status(400).send({
                error : "You are not able to block this account",
                msg : "You are not able to block this account",
                Success : false
            })
        }
        await UserModel.findByIdAndUpdate({ _id: accountId }, { isBlocked: true })
        return res.status(200).send({
            error : "no error",
            msg : "User Blocked Successfully",
            Success : true
        })

    } catch (error) {
        return res.status(400).send({
            error : error.message,
            msg : "Something Went Wrong",
            Success : false
        })
    }


}


const activeUserAccount = async (req, res) => {
    const { accountId } = req.params;
    try {
        
        await UserModel.findByIdAndUpdate({ _id: accountId }, { isBlocked: false })
        return res.status(200).send({
            error : "no error",
            msg : "User Account Activate Successfully",
            Success : true
        })

    } catch (error) {
        return res.status(400).send({
            error : error.message,
            msg : "Something Went Wrong",
            Success : false
        })
    }

}


// Google Authentication code

const googleAuthentication = async (req, res) => {

    // Successful authentication, redirect home.

    console.log(req.user)

    const user = req.user

    let token = jwt.sign({ UserID: user._id }, process.env.SecretKey, { expiresIn: "24h" })

    // const frontendURL = `https://qr-insight-craft.netlify.app/`

    const frontendURL = "http://127.0.0.1:5501/FrontEnd/index.html"

    res.send(`
                <a href="${frontendURL}?token=${token}" id="myid" style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #222222; margin: 0; padding: 0; overflow: scroll;">
                    <img style="width:100%;" src="https://cdn.dribbble.com/users/1787505/screenshots/7300251/media/a351d9e0236c03a539181b95faced9e0.gif" alt="https://i.pinimg.com/originals/c7/e1/b7/c7e1b7b5753737039e1bdbda578132b8.gif">
                </a>
                <script>
                    let a = document.getElementById('myid')
                    setTimeout(()=>{
                        a.click()
                    },3000)
                    console.log(a)
                </script>
        `)

}



const UserQuery = async (req, res) => {

    const payload = req.body;

    console.log("Query received from user --- > ", payload)

    try {

        const userquery = new QueryModel(payload)

        await userquery.save()

        return res.status(200).send({
            "msg": "Your Query has been Submitted Successfully ! Our Team will contact you soon regarding your issue. Thank You",
            "Success": true
        })


    }
    catch (error) {
        return res.status(400).send({
            "error": error.message,
            "msg": "Something Went Wrong",
            "Success": false
        })
    }

}





const getallQueries = async (req, res) => {

    try {

        const userqueries = await QueryModel.find({})

        return res.status(200).send({
            "msg": "Feedback queries fetched successfully",
            "Queries": userqueries,
            "Success": true
        })

    }
    catch (error) {
        return res.status(400).send({
            "error": error.message,
            "msg": "Something went wrong",
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
    getAllUsersData,
    updateUserPassword,
    googleAuthentication,
    UserQuery,
    getallQueries,
    confirmEmail,
    requestForgotPassword,
    resetPassword,
    saveNewPassword,
    uploadProfileImage,
    removeProfileImage,
    logout,
    clearExpiredBlacklistToken,
    blockUserAccount,
    activeUserAccount

}