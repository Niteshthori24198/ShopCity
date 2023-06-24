
const { Router } = require('express');

const reviewRouter = Router();

const Auth = require('../middleware/auth.middleware');

const AdminAuth = require('../middleware/admin.middleware');


const {
    addReview,
    updateReview,
    deleteReview,
    getReviewByProductId,
    getReviewByOrderId
    
} = require('../controller/review.controller');



reviewRouter.post('/add',Auth ,addReview);

reviewRouter.patch('/update/:reviewId', Auth, updateReview);

reviewRouter.delete('/delete/:reviewId', Auth, deleteReview);

reviewRouter.get('/get-by-productId/:productId', getReviewByProductId);

reviewRouter.get('/get-by-orderId/:orderId', getReviewByOrderId);



module.exports = reviewRouter;