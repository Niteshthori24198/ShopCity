
const { Router } = require('express');

const userRouter = Router();



const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const Auth = require('../middleware/auth.middleware');

const AdminAuth = require('../middleware/admin.middleware');

const { passport } = require("../config/google.auth")

const { RegisterNewUser, LoginUser, GetUserData , updateUserData, deleteUserProfile, getAllUsersData, updateUserRole,updateUserPassword,googleAuthentication , UserQuery, getallQueries, confirmEmail, resetPassword, requestForgotPassword, saveNewPassword, uploadProfileImage, removeProfileImage} = require('../controller/user.controller')




/* All user routes which are unprotected or open for everyone */


userRouter.post("/register", RegisterNewUser )

userRouter.get('/confirm-email/:userToken', confirmEmail)

userRouter.patch('/request-forgot-password', requestForgotPassword)

userRouter.get('/reset-password', resetPassword)

userRouter.post('/saveNewPassword', Auth ,saveNewPassword);


userRouter.post("/login", LoginUser )


userRouter.post("/query", UserQuery)




// google auth


userRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


userRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session:false }), googleAuthentication )



/* User can veiw it's details only after successfull login. Protected routes by auth middleware */ 


userRouter.get("/get", Auth , GetUserData)


userRouter.patch("/update", Auth, updateUserData)


userRouter.patch("/changepass", Auth,updateUserPassword)


userRouter.delete("/delete" , Auth, deleteUserProfile)


// upload profile Image
userRouter.post('/upload-profile-image',  upload.single('Image'),Auth, uploadProfileImage)

userRouter.delete('/delete-profile-image', Auth, removeProfileImage)




/* Routes for which  only Admin is Authorized to access. Protected by Admin middleware */


userRouter.get("/getall", AdminAuth, getAllUsersData )


userRouter.put("/updateRole" , AdminAuth , updateUserRole )


userRouter.get("/getquery", AdminAuth, getallQueries)


module.exports = userRouter;