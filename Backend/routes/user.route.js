const { Router } = require('express');

const userRouter = Router();


const Auth = require('../middleware/auth.middleware');

const { RegisterUser, LoginUser, GetUser } = require('../controller/user.controller')


userRouter.post("/register",RegisterUser )


userRouter.post("/login",LoginUser )


userRouter.get("/get", Auth ,GetUser)



module.exports = userRouter;