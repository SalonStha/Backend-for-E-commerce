const orderDetailRouter = require('express').Router(); 
const { UserRole } = require('../../../config/constants'); // Import UserRole from the constant configuration
const authValidator = require('../../../middlewares/auth.middleware');
const auth = require('../../../middlewares/authmodel.middleware');
const orderDetailController = require('./order-detail.controller');
const { AddToCartDTO, DeleteFromCartDTO } = require('./order-detail.validator'); // Import DTOs for validation

orderDetailRouter.post('/addToCart', auth([UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER]),authValidator(AddToCartDTO),orderDetailController.addToCart); // Route to add products to the cart
orderDetailRouter.get('/getCart', auth([UserRole.ADMIN, UserRole.CUSTOMER]),orderDetailController.getCart); // Route to get the cart details
orderDetailRouter.post('/deleteCart',auth([UserRole.ADMIN, UserRole.CUSTOMER]),authValidator(DeleteFromCartDTO),orderDetailController.deleteFromCart)


module.exports = orderDetailRouter; // Export the OrderDetailRouter for use in other modules