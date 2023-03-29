const { Router } = require('express');

const Auth = require('../middleware/auth.middleware');

const cartRouter = Router();

const { addToCart, getCartproduct, updateCartItem, deleteCartItem } = require('../controller/cart.controller');




cartRouter.use(Auth);



cartRouter.post("/addToCart",addToCart);



cartRouter.get("/get",getCartproduct);


cartRouter.patch("/update/:ProductID", updateCartItem)


cartRouter.delete("/delete/:ProductID" , deleteCartItem)



module.exports = cartRouter;