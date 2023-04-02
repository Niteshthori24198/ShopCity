
const OrderModel = require('../model/order.model');

const ProductModel = require('../model/product.model');




const PlaceNewOrder = async (req,res) => {

    console.log(req.body)

    let { UserID, Orders } = req.body;

    console.log("----> order aaya",Orders)

    let flag = false

    let UserOrders = Orders.map((ele)=>{

        if(ele.Quantity <= 0){

            flag = true

            return 
        }

        return {

            product: ele.ProductID, Quantity:ele.Quantity, Address:ele.Address, Status:"Confirmed"
        }

    })

    if(flag){

        return res.status(400).send({

            "Success":false,
           
            "msg":"Quantity is Invalid ! "
        })

    }


    try {
        
        const exist = await OrderModel.findOne( { UserID : UserID } );

        /*  if User order schema already exists */


        if(exist){

            exist.Products.push(...UserOrders);

            try
                {
                   await OrderModel.findByIdAndUpdate({_id:exist._id}, exist);


                    /*  Updating product quantities after order placed */ 

                   for(let i=0; i<UserOrders.length; i++){
                    
                        const item = await ProductModel.findById( {_id : UserOrders[i].product } )
                
                        item.Quantity = (+item.Quantity) - (+UserOrders[i].Quantity);
                
                        await ProductModel.findByIdAndUpdate( {_id : UserOrders[i].product }, item )
                
                    }

                   return res.status(200).send({

                       "msg" : "Order has been Successfully Placed",
                       
                       "Success" : true,

                        "Orders" : exist

                    })

                }
                
                catch(error){

                    return res.status(400).send({

                        "Success" : false,
                        
                        "error" : error.message,

                        "msg" : "Something Went Wrong"
                    })

                }

        }
        

        /*  User is making order first time */

        else{

            try {
                
                const order = new OrderModel( {

                    UserID: UserID,

                    Products : [ ...UserOrders ]

                } )

                await order.save();


                 /*  Updating product quantities after order placed */ 

                for(let i=0; i<UserOrders.length; i++){
                    
                    const item = await ProductModel.findById( {_id : UserOrders[i].product } )
            
                    item.Quantity = (+item.Quantity) - (+UserOrders[i].Quantity);
            
                    await ProductModel.findByIdAndUpdate( {_id : UserOrders[i].product }, item )
            
                }


                return res.status(200).send({

                    "msg" : "New Order has been Successfully Placed",
                    
                    "Success" : true,

                    "Orders" : order
                })

            } 
            
            catch (error) {
                
                return res.status(400).send({

                    "error" : error.message,
                    
                    "msg" : "Something Went Wrong.",
                    
                    "Success" : false
                })

            }
        }

    }
    
    catch (error) {

        return res.status(400).send({
            
            "error" : error.message,
            
            "msg" : "Something Went Wrong.",
            
            "Success" : false
        })
    }

    
}



const GetOrders = async (req, res) => {

    try{

        /*  Fetching order details along with product details */


        const OrderItem = await OrderModel.findOne({UserID:req.body.UserID}).populate("Products.product")
        
        if(OrderItem){

            return res.status(200).send({

                "Success":true,
                
                "msg": "Your Orders are : ",

                "Orders": OrderItem
            })

        }
        
        else{

            return res.status(400).send({

                "Success": false,
            
                "msg": "Your Order List is Empty !"
            })
        }

    }

    catch(error){

        return res.status(400).send({

            "error":error.message,
            
            "msg": "Something Went Wrong",
            
            "Success": false
        })
    }
}




const  CancelOrder = async (req,res) =>{

    const {ID} = req.params;

    const {UserID} = req.body;

    try {

        const order = await OrderModel.findOne( { UserID } )

        let isDelivered = false;

        let isCancelled = false;


        let cancelledProduct;

        let cancelledQunatity;


        order.Products.map((ele)=>{
          

            if( ele._id == ID){

                if(ele.Status === 'Delivered'){

                    isDelivered = true

                    return 
                }

                if(ele.Status === 'Cancelled'){

                    isCancelled = true

                    return 
                }

                cancelledProduct = ele.product

                cancelledQunatity = ele.Quantity

                ele.Status = 'Cancelled'

                return true

            }

        })



        if(isDelivered){

            return res.status(400).send({

                "Success":false,
               
                "msg":"Order has been Already Delivered. No Cancelation option for Delivered Products"
            })

        }
        
        else if(isCancelled){

            return res.status(400).send({

                "Success":false,
               
                "msg":"Order has been Already Canceled by user."
            })

        }
        
        else{


            await OrderModel.findByIdAndUpdate( { _id: order._id }, order )


            /*  Updating product quantities after order cancelled */ 


            const item = await ProductModel.findById( {_id :  cancelledProduct} )
                
            item.Quantity = (+item.Quantity) + (+cancelledQunatity);
    
            await ProductModel.findByIdAndUpdate( {_id :  cancelledProduct}, item )


            return res.status(200).send({

                "Success":true,
               
                "msg":"Order has been Successfully Canceled."
            })

        }


    } 
    
    catch (error) {

        return res.status(400).send({

            "error":error.message,
            
            "Success": false,
            
            "msg": "Something Went Wrong"
        })

    }
}





const GetAllOrders = async (req, res) => {

    try{

        const Orders = await OrderModel.find().populate("Products.product")
        
        if(Orders){

            return res.status(200).send({

                "Success":true,
              
                "msg": "All Orders details : ",

                "Orders": Orders
            })

        }
        
        else{

            return res.status(400).send({

                "Success": false,
                
                "msg": "Your Order List is Empty"
            })

        }

    }
    
    catch(error){

        return res.status(400).send({

            "error":error.message,
            
            "msg": "Something Went Wrong",
            
            "Success": false
        })
    }
}




const ChangeOrderStatus = async (req,res) =>{

    const {ID} = req.params;

    try {

        const order = await OrderModel.find()


        let orderID;
        
        let data;

        let isDelivered = false;
        let isCancelled = false;

        let flag = false

        for(let i=0; i<order.length; i++){

            order[i].Products.map((ele)=>{
    
                if( ele._id == ID){
    
                    if(ele.Status === 'Delivered'){
    
                        isDelivered = true

                        return 
    
                    }
                    
                    else if(ele.Status === 'Cancelled'){
    
                        isCancelled = true

                        return 
    
                    }

                    else{

                        orderID = order[i]._id

                        data = order[i]

                        ele.Status = 'Delivered'

                        flag = true

                        return true
    
                    }
                }
            })

            if(flag){

                break
            }

        }

        if(isDelivered){

            return res.status(400).send({

                "msg":"Order has been Already Delivered.",
                
                "Success":false
            })

        }
        
        else if(isCancelled){

            return res.status(400).send({

                "Success":false,
              
                "msg":"Order has been already Canceled By User"
            })

        }
        
        else{


            await OrderModel.findByIdAndUpdate( { _id: orderID }, data);


            return res.status(200).send({

                "Success":true,
               
                "msg":"Order has been Successfully Delivered."
            })

        }


    } 
    
    catch (error) {

        return res.status(400).send({

            "Success": false,
           
            "msg": "Something Went Wrong",
            
            "error":error.message
        })

    }
}





module.exports = { PlaceNewOrder, GetOrders, CancelOrder, GetAllOrders, ChangeOrderStatus }