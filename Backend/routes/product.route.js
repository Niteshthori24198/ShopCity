
const { Router } = require('express');

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const productRouter = Router();

const AdminAuth = require('../middleware/admin.middleware');

const { GetAllProducts, GetOneProduct, GetProductByCategory, CreateNewProduct, UpdateProduct, RemoveProduct,UpdateProductImage } = require('../controller/product.controller');


/* Open routes to explore products in detailed manner */ 


productRouter.get('/getall',GetAllProducts)


productRouter.get('/getone/:productID', GetOneProduct)


productRouter.get('/getbycategory/:Category',GetProductByCategory )




/* All Routes are Protected. Dont't Touch.Only Admin have the access to these routes */ 



productRouter.use(AdminAuth)


productRouter.post("/add",upload.single('Image'), CreateNewProduct)



productRouter.patch("/update/:productID", UpdateProduct)

productRouter.patch("/updateImage/:productID",upload.single('Image'), UpdateProductImage)



productRouter.delete("/delete/:productID", RemoveProduct)



/* All Routes are Protected. Dont't Touch */ 



module.exports = productRouter;



