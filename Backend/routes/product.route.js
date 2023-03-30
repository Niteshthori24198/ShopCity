
const { Router } = require('express');

const productRouter = Router();

const AdminAuth = require('../middleware/admin.middleware');

const { GetAllProducts, GetOneProduct, GetProductByCategory, CreateNewProduct, UpdateProduct, RemoveProduct } = require('../controller/product.controller');


/* Open routes to explore products in detailed manner */ 


productRouter.get('/getall',GetAllProducts)


productRouter.get('/getone/:productID', GetOneProduct)


productRouter.get('/getbycategory/:Category',GetProductByCategory )




/* All Routes are Protected. Dont't Touch.Only Admin have the access to these routes */ 



productRouter.use(AdminAuth)


productRouter.post("/add", CreateNewProduct)



productRouter.patch("/update/:productID", UpdateProduct)



productRouter.delete("/delete/:productID", RemoveProduct)



/* All Routes are Protected. Dont't Touch */ 



module.exports = productRouter;



