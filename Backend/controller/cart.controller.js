
const CartModel = require("../model/cart.model");

const ProductModel = require("../model/product.model");




const AddItemToCart = async (req,res)=>{

    let {UserID, ProductID, Quantity} = req.body;

    console.log("---->>>>",UserID,ProductID,Quantity)

    /* Quantity must be nonzero positive */

    if(!Quantity || Quantity<=0){

        Quantity = 1
    } 

    /* checking invalid productid */

    if(!ProductID){

        return res.status(404).send({

            "Success":false,
           
            "msg" : "Product Not Found in database"

        })

    }

    else {

        try {

            const product = await ProductModel.findById({_id:ProductID})
           

        } 
        
        catch (error) {

            return res.status(404).send({

                "error":error.message,

                "Success":false,
                
                "msg" : "Product Not Found in database"
            })
        }
    }

    try {
        
        const UserCartExist = await CartModel.findOne( { UserID : UserID } )
    

        /*  If user has it's cart already present */

        if(UserCartExist){

            const checkUserCart = UserCartExist.Products.find((ele)=>{
            
                /* For Type Converison put (==) inseted of (===) to match id's. */

                if(ele.product == ProductID){
                    return true
                }
            })

         
            /*  Checking duplicate items in cart. */

            if(checkUserCart){

                return res.status(400).send({

                    "Success":false,
        
                    "msg":"Product Already been Added Into the Cart"
                })

            }


            /* add item if not added to cart */
            
            else{

                console.log("~~~~~~~ ", Quantity)
                
                UserCartExist.Products.push({ product: ProductID, Quantity: Quantity });


                try{

                   await CartModel.findByIdAndUpdate({_id: UserCartExist._id}, UserCartExist);

                   return res.status(200).send({

                        "Success" : true,
                      
                        "msg" : "Successfully Added Into Cart",

                        "CartItems" : UserCartExist
                    })

                }
                
                catch(error){

                    return res.status(400).send({

                        "msg" : "Something Went Wrong",

                        "Success" : false,
                       
                        "error" : error.message
                        
                    })

                }

            }

        }
        

        /*  If No carts is there then create new cart of user */

        else{

            try {
                
                const UserCart = new CartModel( {

                    UserID: UserID,

                    Products : [ { product: ProductID, Quantity: Quantity } ]

                } )

                await UserCart.save();

                return res.status(200).send({

                    "Success" : true,
                 
                    "msg" : "Product has been Added Into Cart Successfully",

                    "CartData" : UserCart
                })

            } 
            
            catch (error) {
                
                return res.status(400).send({

                    "error" : error.message,
                    
                    "Success" : false,

                    "msg" : "Something Went Wrong."
                })

            }

        }



    }
    
    catch (error) {

        return res.status(400).send({

            "error" : error.message,
            
            "Success" : false,

            "msg" : "Something Went Wrong."
        })

    }


}




const GetCartItems = async(req,res)=>{

    try {


        /* Feteching of cart items along with complete product details. */

        const items = await CartModel.findOne({UserID:req.body.UserID}).populate("Products.product")


        if(items){

            res.status(200).send({
    
                "msg":"Your Cart Items are as : ",

                "Success":true,
               
                "CartItem":items
    
            })
        }

        else{

            res.status(400).send({

                "Success":false,

                "msg":"Your Cart is Empty!"
    
            })

        }

    }

    catch(error){

        res.status(400).send({

            "error":error.message,
          
            "Success":false,

            "msg":"Something Went wrong !"

        })

    }
   
}




const UpdateCartItems = async(req,res)=>{

    const { ProductID } = req.params;
     
    let {UserID, Quantity} = req.body;

    if(!Quantity || Quantity<=0){

        Quantity=1

    } 

    try{

        const userCart = await CartModel.findOne( { UserID } )

        const checkCart = userCart.Products.find((ele)=>{

            if(ele.product == ProductID){

                ele.Quantity = Quantity

                return true
            }

        })

        if(checkCart){
            
            try {
                
                await CartModel.findByIdAndUpdate({ _id : userCart._id }, userCart)        
        
                return res.status(200).send({

                    "Success":true,

                    "msg":"Your Cart has been Successfully updated!",

                    "CartItem": userCart
                })

            } 
            
            catch (error) {

                return res.status(400).send({
                    
                    "error":error.message,
                   
                    "Success":false,
                   
                    "msg":"Something Went Wrong."
                
                })
            }

        }
        
        else{

            return res.status(404).send({

                "Success":false,

                "msg":"Product Not Found !"
            })
        }

        
    }
    
    catch(error){

        return res.status(400).send({

            "msg":"Your Cart Doesn't Even Exist",
            
            "Success":false,

            "error":error.message
        })
    }
    

}





const deleteCartItem =  async (req,res) =>{

    const {ProductID} = req.params
    
    let { UserID } = req.body;


    try{

        const userCart = await CartModel.findOne( { UserID } )

        
        const UpdatedCart  = userCart.Products.reduce((acc, curr)=>{

            if( curr.product != ProductID ){

                acc.push(curr);
                
            }

            return acc

        },[])

        userCart.Products = UpdatedCart;
        
        try {
            
            await CartModel.findByIdAndUpdate({ _id : userCart._id }, userCart)        
    
            return res.status(200).send({

                "msg":"Your Cart item has been Successfully Deleted!",
                
                "Success":true,

                "CartData": userCart
            })

        } 
        
        catch (error) {

            return res.status(400).send({

                "msg":"Something Went Wrong",

                "Success":false,

                "error":error.message

            })

        }
        
    }
    
    catch(error){

        return res.status(400).send({

            "msg":"Your Cart Doesn't Exist",
            
            "Success":false,

            "error":error.message

        })

    }
   
}



module.exports = {

    AddItemToCart,
    GetCartItems,
    UpdateCartItems,
    deleteCartItem

}