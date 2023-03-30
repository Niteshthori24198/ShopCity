
const { Router } = require('express');

const orderRouter = Router();

const Auth = require('../middleware/auth.middleware')


const AdminAuth = require('../middleware/admin.middleware');


const { PlaceNewOrder, GetOrders, CancelOrder, GetAllOrders, ChangeOrderStatus } = require('../controller/order.controller');



/* All routes are protected by middleware. User can acceess them only after logging into system */ 


orderRouter.post("/place" , Auth, PlaceNewOrder);



orderRouter.get("/get" , Auth, GetOrders);



orderRouter.delete("/cancel/:ID", Auth , CancelOrder);




/*  Admin accessible routes protected by admin middleware . */



orderRouter.get("/getAll" , AdminAuth , GetAllOrders);



orderRouter.patch("/updatestatus/:ID" , AdminAuth , ChangeOrderStatus);





module.exports = orderRouter;



