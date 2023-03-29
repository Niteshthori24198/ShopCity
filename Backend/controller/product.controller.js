
const ProductModel = require('../model/product.model');


const GetAllProducts = async (req,res)=>{

    const {search, limit, page, price} = req.query;

    let priceSort;

    if(price){

        if(price==="asc" || price==='desc'){

            priceSort = price==="asc" ? 1 : -1;

        }
        
        else{

            return res.status(400).send({
                "msg": "Please select a valid way to sort.Price order must be either asc or desc",
                "Code": 400,
                "Success": false
            })
            
        }
    }

    try {

        const searchFilter = new RegExp(search, 'i');

        if(priceSort){

            const products = await ProductModel.find( { Title : searchFilter } ).sort({Price:priceSort}).skip(limit*(page-1)).limit(limit);

            return res.status(200).send({

                "Success" : true,
                "Code" : 200,
                "Products" : products 

            })

        }
        
        else{

            const products = await ProductModel.find( { Title : searchFilter } ).skip(limit*(page-1)).limit(limit);

            return res.status(200).send({

                "Success" : true,
                "Code" : 200,
                "Products" : products 

            })

        }

    } 
    
    catch (error) {

        return res.status(400).send({

            "error": error.message,
            "msg": "Something Went Wrong!",
            "Code": 400,
            "Success": false

        })

    }

}



const GetOneProduct = async (req,res)=>{

    const {productID} = req.params;

    try {

        const product = await ProductModel.findById({_id:productID});

        return res.status(200).send({
            "Success" : true,
            "Code" : 200,
            "Products" : product
        })

    } 
    
    catch (error) {

        return res.status(400).send({

            "error": error.message,
            "msg": "Something Went Wrong!",
            "Code": 400,
            "Success": false

        })
    }
}


const GetProductByCategory = async (req,res)=>{

    const { Category } = req.params;

    const {search, limit, page, price} = req.query;

    let priceSort;

    if(price){

        if(price==="asc" || price==='desc'){

            priceSort = price==="asc" ? 1 : -1;

        }else{

            return res.status(400).send({
                "msg": "Please select a valid way to sort.Price order must be either asc or desc",
                "Code": 400,
                "Success": false
            })
            
        }
    }

    try {

        const searchFilter = new RegExp(search, 'i');

        if(priceSort){

            const products = await ProductModel.find( { Title : searchFilter , Category } ).sort({Price:priceSort}).skip(limit*(page-1)).limit(limit);

            return res.status(200).send({

                "Success" : true,
                "Code" : 200,
                "Products" : products 

            })

        }
        
        else{

            const products = await ProductModel.find( { Title : searchFilter , Category} ).skip(limit*(page-1)).limit(limit);

            return res.status(200).send({

                "Success" : true,
                "Code" : 200,
                "Products" : products 

            })

        }

    } 
    
    catch (error) {

        return res.status(400).send({

            "error": error.message,
            "msg": "Something Went Wrong!",
            "Code": 400,
            "Success": false

        })

    }


}


const CreateProduct = async (req, res) => {


    const payload = req.body;

    try {

        const verifyProduct = await ProductModel.find({Image:payload.Image});

        console.log(verifyProduct)

        if (verifyProduct.length) {

            await ProductModel.findByIdAndUpdate({ _id: verifyProduct[0]._id }, payload)

            const product = await ProductModel.findById({ _id: verifyProduct[0]._id })

            return res.status(200).send({

                "msg": "Product Successfully Added",
                "Code": 200,
                "Success": true,
                "ProductData": product

            })

        } 
        
        else {

            const product = new ProductModel(payload);

            await product.save();

            return res.status(200).send({

                "msg": "New Product has been Successfully Added",
                "Code": 200,
                "Success": true,
                "ProductData": product

            })
        }

    } 
    
    catch (error) {

        return res.status(400).send({

            "error": error.message,
            "msg": "Something Went Wrong",
            "Code": 400,
            "Success": false

        })

    }



}


const UpdateProduct = async (req,res)=>{

    const { productID } = req.params;

    const payload = req.body;

    try {
        
        await ProductModel.findByIdAndUpdate({_id:productID}, payload)

        const product = await ProductModel.findById({_id:productID})

        return res.status(200).send({

            "msg":"Product has been Updated Successfully.",
            "Success":true,
            "Code":200,
            "Product":product
            

        })

    } 
    
    catch (error) {
        
        return res.status(400).send({

            "error":error.message,
            "msg":"Something Went Wrong !",
            "Code":400,
            "Success":false


        })

    }


}


const RemoveProduct = async (req,res)=>{

    const { productID } = req.params;

    try {
        

        await ProductModel.findByIdAndDelete({_id:productID})

        return res.status(200).send({

            "msg":"Product has been Deleted Successfully.",
            "Success":true,
            "Code":200,

        })

    } 
    
    catch (error) {
        
        return res.status(400).send({

            "error":error.message,
            "msg":"Something Went Wrong !",
            "Code":400,
            "Success":false


        })

    }


}


module.exports = {

    GetAllProducts,
    GetOneProduct,
    GetProductByCategory,
    CreateProduct,
    UpdateProduct,
    RemoveProduct


}