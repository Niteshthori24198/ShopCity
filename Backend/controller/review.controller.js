
const bcrypt = require('bcrypt');
const ReviewModel = require('../model/review.model');
const ProductModel = require('../model/product.model');
const UserModel = require('../model/user.model');
const OrderModel = require('../model/order.model');

require('dotenv').config();






const addReview = async (req, res) => {
    const { UserID } = req.body;
    const { ProductId, OrderId, NewRating, Description } = req.body;


    if (!ProductId || !OrderId || !NewRating || !Description) {
        return res.status(404).send({
            "error": "Kindly Pass All The Required Details",
            "Success": false,
            "msg": "Kindly Pass All The Required Details"
        })
    }

    try {

        const userInfoo = await UserModel.findById({ _id: UserID });
        if (!userInfoo) {
            return res.status(404).send({
                "error": "This User is currently not available",
                "Success": false,
                "msg": "This User is currently not available"
            })
        }

        

        const alreadyReviewPresent = await ReviewModel.findOne({ ProductId, OrderId, CustomerId: UserID });
        console.log('===>',alreadyReviewPresent);
        if (alreadyReviewPresent) {
            console.log('review over ride ho rha hai .....');
            const productInfo = await ProductModel.findById({ _id: ProductId })
            if (!productInfo) {
                return res.status(404).send({
                    "error": "This Product is currently not available",
                    "Success": false,
                    "msg": "This Product is currently not available"
                })
            }

            // productInfo.Total_Review_Count++;
            productInfo.Total_Review_Sum = (+productInfo.Total_Review_Sum) - (+alreadyReviewPresent.NewRating) + (+NewRating);
            productInfo.Rating = productInfo.Total_Review_Count ? (productInfo.Total_Review_Sum / productInfo.Total_Review_Count).toFixed(1) : 0;

            await ProductModel.findByIdAndUpdate({ _id: ProductId }, { ...productInfo });

            await ReviewModel.findByIdAndUpdate({_id:alreadyReviewPresent._id}, { NewRating, Description, CustomerName: userInfoo.Name, CustomerImage: userInfoo.Image });

            return res.status(200).send({
                "error": "no error",
                "Success": true,
                "msg": "Your review has been successfully added."
            })
        } else {
    

            const OrderItem = await OrderModel.findOne({ UserID: UserID })
            console.log(OrderItem);
            const isDelivered = isOrderDelivered(OrderItem.Products, ProductId)

            if(!isDelivered){
                return res.status(400).send({
                    "error": "You can not able to give review now",
                    "Success": false,
                    "msg": "Your order not deliverd yet"
                })
            }


            const productInfo = await ProductModel.findById({ _id: ProductId })
            if (!productInfo) {
                return res.status(404).send({
                    "error": "This Product is currently not available",
                    "Success": false,
                    "msg": "This Product is currently not available"
                })
            }

            productInfo.Total_Review_Count++;
            productInfo.Total_Review_Sum = (+productInfo.Total_Review_Sum) + (+NewRating);
            productInfo.Rating = productInfo.Total_Review_Count ? (productInfo.Total_Review_Sum / productInfo.Total_Review_Count).toFixed(1) : 0;

            await ProductModel.findByIdAndUpdate({ _id: ProductId }, { ...productInfo });

            // add review and update product
            const newReview = new ReviewModel({
                ProductId, OrderId, NewRating, Description, CustomerId: UserID,  CustomerName: userInfoo.Name
            })
            await newReview.save();


            return res.status(404).send({
                "error": "no error",
                "Success": true,
                "msg": "Your review has been successfully added."
            })


        }

    } catch (error) {
        return res.status(404).send({
            "error": error.message,
            "Success": false,
            "msg": "Something Went Wrong"
        })
    }


}

function isOrderDelivered(orders, productId){
    for(let i=0; i<orders.length; i++){
        if(orders[i].product == productId){
            if(orders[i].Status == 'Delivered'){
                return true
            }else{
                return false
            }
        }
    }
    return false
}

const updateReview = async (req, res) => {
    const { reviewId } = req.params
    const { UserID, ProductId, OrderId, NewRating, Description } = req.body;
    try {
        const reviewInfo = await ReviewModel.findById({ _id: reviewId });
        if (!reviewInfo) {
            return res.status(404).send({
                "error": "Review Not Found",
                "Success": false,
                "msg": "Something Went Wrong"
            })
        }

        if (UserID != reviewInfo.CustomerId) {
            return res.status(404).send({
                "error": "Unauthorized access",
                "Success": false,
                "msg": "You are not able to update this review"
            })
        }

        let ableToUpdate = true
        if (ProductId) {
            if (reviewInfo.ProductId != ProductId) {
                ableToUpdate = false
            }
        }
        if (OrderId) {
            if (OrderId != reviewInfo.OrderId) {
                ableToUpdate = false
            }
        }

        if (!ableToUpdate) {
            return res.status(404).send({
                "error": "You are not able to update productid or orderid",
                "Success": false,
                "msg": "Something Went Wrong"
            })
        }

        if (Description) {
            reviewInfo.Description = Description;
        }

        if (NewRating) {


            const productInfo = await ProductModel.findById({ _id: ProductId })
            if (!productInfo) {
                return res.status(404).send({
                    "error": "This Product is currently not available",
                    "Success": false,
                    "msg": "This Product is currently not available"
                })
            }

            // productInfo.Total_Review_Count++;
            productInfo.Total_Review_Sum = productInfo.Total_Review_Sum + NewRating - reviewInfo.NewRating;

            productInfo.Rating = productInfo.Total_Review_Count ? (productInfo.Total_Review_Sum / productInfo.Total_Review_Count).toFixed(1) : 0;

            await ProductModel.findByIdAndUpdate({ _id: ProductId }, { ...productInfo });

            reviewInfo.NewRating = NewRating


        }

        await ReviewModel.findByIdAndUpdate({ _id: reviewInfo._id }, { ...reviewInfo })

        return res.status(404).send({
            "error": "no error",
            "Success": true,
            "msg": "Your review has been successfully updated"
        })



    } catch (error) {
        return res.status(404).send({
            "error": error.message,
            "Success": false,
            "msg": "Something Went Wrong"
        })
    }

}

const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const { UserID } = req.body;

    try {
        const reviewInfo = await ReviewModel.findById({ _id: reviewId });
        if (!reviewInfo) {
            return res.status(404).send({
                "error": "Review Not Found",
                "Success": false,
                "msg": "Something Went Wrong"
            })
        }

        let ableToDelete = false

        // If User want to delete own review
        if (UserID == reviewInfo.CustomerId) {

            ableToDelete = true

        }else{

            const userInfo = await UserModel.findById({ _id: UserID });
            // If User is Admin then can able to delete any review
            if (userInfo && userInfo.isAdmin) {
    
                ableToDelete = true
    
            }

        }




        if (ableToDelete) {

            const productInfo = await ProductModel.findById({ _id: reviewInfo.ProductId })
            if (!productInfo) {
                return res.status(404).send({
                    "error": "This Product is currently not available",
                    "Success": false,
                    "msg": "This Product is currently not available"
                })
            }

            productInfo.Total_Review_Count--;
            productInfo.Total_Review_Sum = productInfo.Total_Review_Sum - reviewInfo.NewRating;
            productInfo.Rating = productInfo.Total_Review_Count ? (productInfo.Total_Review_Sum / productInfo.Total_Review_Count).toFixed(1) : 0;

            await ProductModel.findByIdAndUpdate({ _id: productInfo._id }, { ...productInfo });

            await ReviewModel.findByIdAndDelete({ _id: reviewId })

            return res.status(200).send({
                "error": "no error",
                "Success": true,
                "msg": "Your review has been successfully deleted."
            })

        } else {
            // not able to delete
            return res.status(404).send({
                "error": "You can not delete this review",
                "Success": false,
                "msg": "You can not delete this review"
            })
        }

    } catch (error) {
        return res.status(404).send({
            "error": error.message,
            "Success": false,
            "msg": "Something Went Wrong"
        })

    }

}

const getReviewByProductId = async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        return res.status(404).send({
            "error": "Review Not Found",
            "Success": false,
            "msg": "Review Not Found",
            "Review": []
        })
    }
    try {

        const reviewInfo = await ReviewModel.find({ ProductId: productId });
        if (!reviewInfo) {
            return res.status(404).send({
                "error": "Review Not Found",
                "Success": false,
                "msg": "Review Not Found",
                "Review": []
            })
        }
        for(let review of reviewInfo){
            const user = await UserModel.findById({ _id: review.CustomerId });

            const currentDate = new Date();
            // Get the current date and get expiration date
            const futureDate = new Date();
            futureDate.setDate(currentDate.getDate() + 7);
            futureDate.setMinutes(futureDate.getMinutes() - 20);
            console.log(currentDate ,user?.S3_Url_ExipreDate);
    
    
            if (user.S3_Url_ExipreDate && user.S3_Url_ExipreDate < currentDate) {
                user.S3_Url_ExipreDate = futureDate;
    
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: user.S3_Url
                }
                const command1 = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command1, { expiresIn: 604800 });
                user.Image = url;
                await UserModel.findByIdAndUpdate({ _id: user._id }, { S3_Url_ExipreDate: futureDate, Image: url })
            }
            
            review.CustomerImage = user.Image
            
            review.CustomerName = user.Name
        }
        return res.status(200).send({
            "error": "no error",
            "Success": true,
            "msg": "Review Found",
            "Review": reviewInfo
        })

    } catch (error) {
        return res.status(404).send({
            "error": error.message,
            "Success": false,
            "msg": "Something Went Wrong"
        })

    }
}

const getReviewByOrderId = async (req, res) => {
    const { orderId } = req.params;
    if (!orderId) {
        return res.status(404).send({
            "error": "Review Not Found",
            "Success": false,
            "msg": "Review Not Found",
            "Review": []
        })
    }
    try {
        const reviewInfo = await ReviewModel.find({ OrderId: orderId });
        if (!reviewInfo) {
            return res.status(404).send({
                "error": "Review Not Found",
                "Success": false,
                "msg": "Review Not Found",
                "Review": []
            })
        }
        return res.status(200).send({
            "error": "no error",
            "Success": true,
            "msg": "Review Found",
            "Review": reviewInfo
        })
    } catch (error) {
        return res.status(404).send({
            "error": error.message,
            "Success": false,
            "msg": "Something Went Wrong"
        })
    }


}





module.exports = {

    addReview,
    updateReview,
    deleteReview,
    getReviewByProductId,
    getReviewByOrderId


}