
const { Router } = require('express');

const userRouter = Router();

const Auth = require('../middleware/auth.middleware');

const AdminAuth = require('../middleware/admin.middleware');

const { RegisterNewUser, LoginUser, GetUserData , updateUserData, deleteUserProfile, getAllUsersData, updateUserRole} = require('../controller/user.controller')




/* All user routes which are unprotected or open for everyone */


userRouter.post("/register", RegisterNewUser )


userRouter.post("/login", LoginUser )



/* User can veiw it's details only after successfull login. Protected routes by auth middleware */ 


userRouter.get("/get", Auth , GetUserData)


userRouter.patch("/update", Auth, updateUserData)


userRouter.delete("/delete" , Auth, deleteUserProfile)




/* Routes for which  only Admin is Authorized to access. Protected by Admin middleware */


userRouter.get("/getall", AdminAuth, getAllUsersData )


userRouter.patch("/updateRole" , AdminAuth , updateUserRole )




module.exports = userRouter;