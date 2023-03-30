
const { Router } = require('express');

const Auth = require('../middleware/auth.middleware');

const cartRouter = Router();

const { AddItemToCart, GetCartItems, UpdateCartItems, deleteCartItem } = require('../controller/cart.controller');



/* All routes are protected using middleware. User can access only after login */ 


cartRouter.use(Auth);



cartRouter.post("/addToCart",AddItemToCart);



cartRouter.get("/get",GetCartItems);



cartRouter.patch("/update/:ProductID", UpdateCartItems)



cartRouter.delete("/delete/:ProductID" , deleteCartItem)



module.exports = cartRouter;