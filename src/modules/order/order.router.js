const orderRouter = require('express').Router();
const orderDetailRouter = require('./orderdetail/order-detail.router'); // Import the OrderDetailRouter

const auth = require("../../middlewares/authmodel.middleware");
const { UserRole } = require('../../config/constants');
const authValidator = require('../../middlewares/auth.middleware');
const { CheckoutDTO } = require('./order.validator');
const orderController = require('./order.controller');


orderRouter.use('/detail', orderDetailRouter); // Use the OrderDetailRouter for handling requests to the /detail path

orderRouter.post('/checkout',auth([UserRole.ADMIN,UserRole.CUSTOMER]),authValidator(CheckoutDTO),orderController.checkout)

orderRouter.get('/payment/:orderCode',auth([UserRole.ADMIN, UserRole.CUSTOMER]),orderController.initiatePayment)

orderRouter.put('/payment/:orderCode',auth([UserRole.ADMIN, UserRole.CUSTOMER]),orderController.updatePayment)

orderRouter.get('/',auth(),orderController.geAllOrders)

orderRouter.get('/:orderCode',auth([UserRole.ADMIN, UserRole.CUSTOMER]),orderController.getOrderById)



module.exports = orderRouter;