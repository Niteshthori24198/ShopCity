
const bcrypt = require('bcrypt');
const ReviewModel = require('../model/review.model');
const ProductModel = require('../model/product.model');
const UserModel = require('../model/user.model');

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

        const alreadyReviewPresent = await ReviewModel.findOne({ ProductId, OrderId, CustomerId: UserID });
        if (alreadyReviewPresent) {
            return res.status(404).send({
                "error": "Your review is already added",
                "Success": false,
                "msg": "Your review is already added"
            })
        } else {

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
                ProductId, OrderId, NewRating, Description, CustomerId: UserID
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

const updateReview = async (req, res) => {
    const { reviewId } = req.params
    const { UserID, ProductId, OrderId, NewRating, Description } = req.body;
    try {
        const reviewInfo = await ReviewModel.findById({_id:reviewId});
        if(!reviewInfo){
            return res.status(404).send({
                "error": "Review Not Found",
                "Success": false,
                "msg": "Something Went Wrong"
            })
        }

        if(UserID != reviewInfo.CustomerId ){
            return res.status(404).send({
                "error": "Unauthorized access",
                "Success": false,
                "msg": "You are not able to update this review"
            })
        }

        let ableToUpdate = true
        if(ProductId){
            if(reviewInfo.ProductId != ProductId ){
                ableToUpdate = false
            }
        }
        if(OrderId){
            if(OrderId != reviewInfo.OrderId){
                ableToUpdate = false
            }
        }

        if(!ableToUpdate){
            return res.status(404).send({
                "error": "You are not able to update productid or orderid",
                "Success": false,
                "msg": "Something Went Wrong"
            })
        }

        if(Description){
            reviewInfo.Description = Description;
        }

        if(NewRating){


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

            productInfo.Rating = productInfo.Total_Review_Count ? (productInfo.Total_Review_Sum / productInfo.Total_Review_Count) : 0;

            await ProductModel.findByIdAndUpdate({ _id: ProductId }, { ...productInfo });

            reviewInfo.NewRating = NewRating


        }

        await ReviewModel.findByIdAndUpdate({_id : reviewInfo._id}, {...reviewInfo})

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
        const reviewInfo = await ReviewModel.findById({_id: reviewId});
        if(!reviewInfo){
            return res.status(404).send({
                "error": "Review Not Found",
                "Success": false,
                "msg": "Something Went Wrong"
            })
        }

        let ableToDelete = false

        // If User want to delete own review
        if(UserID == reviewInfo.CustomerId ){

            ableToDelete = true

        }



        const userInfo = await UserModel.findById({_id : UserID});
        // If User is Admin then can able to delete any review
        if(userInfo && userInfo.isAdmin){

            ableToDelete = true
        
        }

        if(ableToDelete){

            const productInfo = await ProductModel.findById({ _id: ProductId })
            if (!productInfo) {
                return res.status(404).send({
                    "error": "This Product is currently not available",
                    "Success": false,
                    "msg": "This Product is currently not available"
                })
            }

            productInfo.Total_Review_Count--;
            productInfo.Total_Review_Sum = productInfo.Total_Review_Sum - reviewInfo.NewRating;
            productInfo.Rating = productInfo.Total_Review_Count ? (productInfo.Total_Review_Sum / productInfo.Total_Review_Count) : 0;

            await ProductModel.findByIdAndUpdate({ _id: ProductId }, { ...productInfo });

            await ReviewModel.findByIdAndDelete({_id:reviewId})

            return res.status(200).send({
                "error": "no error",
                "Success": true,
                "msg": "Your review has been successfully deleted."
            })

        }else{
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
    const {productId} = req.params;
    if(!productId){
        return res.status(404).send({
            "error": "Review Not Found",
            "Success": false,
            "msg": "Review Not Found",
            "Review" : []
        })
    }
    try {

        const reviewInfo = await ReviewModel.find({ ProductId: productId });
        if(!reviewInfo){
            return res.status(404).send({
                "error": "Review Not Found",
                "Success": false,
                "msg": "Review Not Found",
                "Review" : []
            })
        }
        return res.status(200).send({
            "error": "no error",
            "Success": true,
            "msg": "Review Found",
            "Review" : reviewInfo
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
    const {orderId} = req.params;
    if(!orderId){
        return res.status(404).send({
            "error": "Review Not Found",
            "Success": false,
            "msg": "Review Not Found",
            "Review" : []
        })
    }
    try {
        const reviewInfo = await ReviewModel.find({ OrderId: orderId });
        if(!reviewInfo){
            return res.status(404).send({
                "error": "Review Not Found",
                "Success": false,
                "msg": "Review Not Found",
                "Review" : []
            })
        }
        return res.status(200).send({
            "error": "no error",
            "Success": true,
            "msg": "Review Found",
            "Review" : reviewInfo
        })
    }catch (error) {
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