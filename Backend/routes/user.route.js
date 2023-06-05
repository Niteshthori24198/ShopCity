
const { Router } = require('express');

const userRouter = Router();

const Auth = require('../middleware/auth.middleware');

const AdminAuth = require('../middleware/admin.middleware');

const { passport } = require("../config/google.auth")

const { RegisterNewUser, LoginUser, GetUserData , updateUserData, deleteUserProfile, getAllUsersData, updateUserRole,updateUserPassword,googleAuthentication , UserQuery, getallQueries} = require('../controller/user.controller')




/* All user routes which are unprotected or open for everyone */


userRouter.post("/register", RegisterNewUser )


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




/* Routes for which  only Admin is Authorized to access. Protected by Admin middleware */


userRouter.get("/getall", AdminAuth, getAllUsersData )


userRouter.put("/updateRole" , AdminAuth , updateUserRole )


userRouter.get("/getquery", AdminAuth, getallQueries)


module.exports = userRouter;