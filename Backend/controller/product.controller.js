
const ProductModel = require('../model/product.model');


const GetAllProducts = async (req,res)=>{

    const { search, limit, page, price } = req.query;

    console.log("--->",search,limit,page,price)

    let pricerange;

    if(price){

        console.log("--> pc",price)

        if(price==="asc" || price==='desc'){

            if(price === 'asc'){
                pricerange = 1;
            }
            else{
                pricerange = -1;
            }


        }
        
        else{

            return res.status(400).send({

                "msg": "Please select a valid way to sort items .Price order must be in either ascending or descending",
                
                "Success": false
            })
            
        }
    }

    try {

        const searchFilter = new RegExp(search, 'i');

        if(pricerange){

            console.log("hello",searchFilter,pricerange)

            const products = await ProductModel.find( { Title : searchFilter } ).sort({ Price: pricerange}).skip(limit*(page-1)).limit(limit);

            console.log(products)

            return res.status(200).send({

                "Success" : true,
               
                "Products" : products 

            })

        }
        
        else{

            const products = await ProductModel.find( { Title : searchFilter } ).skip(limit*(page-1)).limit(limit);

            return res.status(200).send({

                "Success" : true,
               
                "Products" : products 

            })

        }

    } 
    
    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong!",
           
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
           
            "Products" : product
        })

    } 
    
    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong!",
           
            "Success": false

        })
    }
}


const GetProductByCategory = async (req,res)=>{

    const { Category } = req.params;

    const {search, limit, page, price} = req.query;

    console.log(search,limit,page,price,Category)

    let pricerange;

    if(price){

        if(price==="asc" || price==='desc'){

            if(price === 'asc'){
                pricerange = 1;
            }
            else{
                pricerange = -1;
            }

        }
        
        else{

            return res.status(400).send({

                "msg": "Please select a valid way to sort items .Price order must be either ascending or descending",
              
                "Success": false
            })
            
        }
    }

    try {

        const searchFilter = new RegExp(search, 'i');

        if(pricerange){

            const products = await ProductModel.find( { Title : searchFilter , Category } ).sort({ Price: pricerange }).skip(limit*(page-1)).limit(limit);

            return res.status(200).send({

                "Success" : true,
                
                "msg": "Products has been fetched Successfully.",

                "Products" : products,

            })

        }
        
        else{

            const products = await ProductModel.find( { Title : searchFilter , Category} ).skip(limit*(page-1)).limit(limit);

            return res.status(200).send({

                "Success" : true,
              
                "msg": "Products has been fetched Successfully",

                "Products" : products 

            })

        }

    } 
    
    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong!",
           
            "Success": false

        })

    }


}


const CreateNewProduct = async (req, res) => {


    const payload = req.body;

    try {

        const verifyProduct = await ProductModel.find( { Image: payload.Image } );

        // console.log(verifyProduct)

        if (verifyProduct.length !== 0) {

            await ProductModel.findByIdAndUpdate({ _id: verifyProduct[0]._id }, payload)

            const product = await ProductModel.findById({ _id: verifyProduct[0]._id })

            return res.status(200).send({

                "msg": "New Product has been Successfully Added into Database",
               
                "Success": true,

                "ProductInfo": product

            })

        } 
        
        else {

            const product = new ProductModel(payload);

            await product.save();

            return res.status(200).send({

                "msg": "New Product has been Successfully Added into Database",

                "Success": true,

                "ProductInfo": product

            })
        }

    } 
    
    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong",
           
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

            "msg":"Product Info has been Updated Successfully.",

            "Success":true,
           
            "Product":product
            

        })

    } 
    
    catch (error) {
        
        return res.status(400).send({

            "error":error.message,

            "msg":"Something Went Wrong !",

            "Success":false


        })

    }


}


const RemoveProduct = async (req,res)=>{

    const { productID } = req.params;

    try {
        

        await ProductModel.findByIdAndDelete({_id:productID})

        return res.status(200).send({

            "msg":"Product has been Deleted Successfully from database.",

            "Success":true,
           

        })

    } 
    
    catch (error) {
        
        return res.status(400).send({

            "error":error.message,
            
            "msg":"Something Went Wrong !",
           
            "Success":false


        })

    }


}


module.exports = {

    GetAllProducts,
    GetOneProduct,
    GetProductByCategory,
    CreateNewProduct,
    UpdateProduct,
    RemoveProduct


}