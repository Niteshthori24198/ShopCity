const { Router } = require('express');

const AdminAuth = require('../middleware/admin.middleware');


const productRouter = Router();


const { GetAllProducts, GetOneProduct, GetProductByCategory, CreateProduct, UpdateProduct, RemoveProduct } = require('../controller/product.controller');





productRouter.get('/getall',GetAllProducts)


productRouter.get('/getone/:productID', GetOneProduct)


productRouter.get('/getbycategory/:Category',GetProductByCategory )




/* All Routes are Protected. Dont't Touch */ 


productRouter.use(AdminAuth)


productRouter.post("/add", CreateProduct)



productRouter.patch("/update/:productID", UpdateProduct)



productRouter.delete("/delete/:productID", RemoveProduct)


/* All Routes are Protected. Dont't Touch */ 



module.exports = productRouter;



