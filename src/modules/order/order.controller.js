const orderDetailService = require("./orderdetail/order-detail.service");
const orderService = require("./order.service");
const transactionService = require("./transaction/transaction.service");
const orderMail = require("./order.mail");
const axios = require("axios");
const { PaymentConfig, appConfig } = require("../../config/config");
const { TransactionStatus, PaymentMethod , OrderStatus } = require("../../config/constants");
const { UserRole } = require("../../config/constants");
const { ucFirst } = require("../../utils/helper");

class OrderController {
    async checkout (req, res, next) {
        try{
            let { cartId , voucher} = req.body;
            const loggedInUser = req.loggedInUser;
            let newCartId = []; 
            (new Set(cartId)).forEach((item) => { 
                newCartId.push(item);
            }); // remove duplicate cartId
            const {cart : cartInfo} = await orderDetailService.getOrderDetails({
                _id : {$in : cartId},
                buyer : loggedInUser._id,
                order: {$eq: null},
            } , {});

            if(!cartInfo) {
                throw new Error("Cart is empty");
            }

           let exists = [];
           let stockLeft = {};  // store product id and out of stock message
           cartInfo.forEach((item) => {
            if( newCartId.includes(item._id.toString())) {
                exists.push(item);
            } 
            if(item.product.stock < item.quantity) { 
                stockLeft[item._id.toString()] = "Sorry! This product is out of stock";
            }
            });   // check if all cartId in cartInfo is in newCartId

            if(Object.values(stockLeft).length > 0) {  // check if there is any product out of stock
                throw{
                    status : 422,
                    message : stockLeft,
                    status: "Out of Stock",
                }
            }

            if(exists.length !== newCartId.length) {
                throw{
                    status : 422,
                    message : "Cart is not valid",
                    status: "Cart Error",
                }
            }

            const appliedVoucher = null;

            const priceCalculation = orderService.calucalateOrderPrice(cartInfo, appliedVoucher);

            let orderDetail = await orderService.transformOrderObject(priceCalculation, loggedInUser);

            const order = await orderService.createOrder(orderDetail);

            await orderDetailService.updateOrderDetail(order, cartInfo);  // update order detail

            await orderDetailService.reduceProductStock(cartInfo);  // reduce product stock

            let transaction = transactionService.transformToTransactionObject(order); // transform order to transaction object

            await transactionService.createTransaction(transaction); // create transaction

            await orderMail.sendOrderMail(order , cartInfo);

            res.json({
                message : "Order created successfully",
                status : "ORDER_CREATED",
                data : order,
            })
        } catch (error) {
            next(error);
        }
    }
    async initiatePayment(req, res, next) {
        try {
            const orderCode  = req.params.orderCode;
            const order = await orderService.getOrderById({ 
                code : orderCode,
                buyer : req.loggedInUser._id,
            });
            if (!order) {
                throw new Error("Order not found");
            }
            const response = await fetch(
                PaymentConfig.khalti.url + "epayment/initiate/",
                {
                method : "POST",
                body : JSON.stringify({
                    "return_url": appConfig.frontendUrl + "/payment?success=true",
                    "website_url": appConfig.frontendUrl,
                    "amount": Math.round(order.total) + 565 ,
                    "purchase_order_id": orderCode,
                    "purchase_order_name": "test",
                    "customer_info": {
                        "name": order.buyer.firstName + " " + order.buyer.lastName,
                        "email": order.buyer.email,
                        "phone": order.buyer.phoneNumber
                    },
                    "amount_breakdown": [
                        {
                            "label": "Subtotal (Tax Included 13%)",
                            "amount": Math.round(order.subTotal) + Math.round(order.tax)
                        },
                        {
                            "label": "Service Fee",
                            "amount": 565
                        }
                    ],
                }),
                headers : { 
                    "Authorization" : "Key " + PaymentConfig.khalti.secretKey,
                    "Content-Type" : "application/json",
                }
                }
            );
            res.json({
                message : "Payment created successfully",
                status : "PAYMENT_CREATED",
                data : await response.json()
            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updatePayment(req, res, next) {
        try {
            const paymentData = req.body;
            const order = await orderService.getOrderById({
                code : req.params.orderCode,
            });
            if (!order) {
                throw new Error("Order not found");
            }
            order.isPaid = true;
            await order.save();

            const transaction = await transactionService.getTransactionByOrderId({
                order: order._id,
            });

            transaction.amount = +paymentData.total_amount;
            transaction.transactionId = paymentData.tidx;
            transaction.status = TransactionStatus.PAID;
            transaction.responseMessage = JSON.stringify(paymentData);
            transaction.paymentMethod = PaymentMethod.KHALTI;
            await transaction.save();

            if(!transaction) {
                throw new Error("Transaction not found");
            }
            res.json({
                message : "Payment has been made successfully",
                status : "PAYMENT_SUCCESS",
            })
        } catch (error) {
            next(error);
        }
    }
    async geAllOrders(req, res, next) {
        try {
            const loggedInUser = req.loggedInUser;
            if(loggedInUser.role == UserRole.ADMIN || loggedInUser.role == UserRole.CUSTOMER) {

                let filter = {};
                if(loggedInUser.role == UserRole.CUSTOMER) {
                    filter.buyer = loggedInUser._id;
                }
                if(req.query.search){
                    filter = {
                        ...filter,
                        $or : [
                            {code : {$regex : req.query.search, $options : "i"}},
                            {buyer : {$regex : req.query.search, $options : "i"}},
                        ]
                    }
                }
                if(req.query.status){
                    filter = {
                        ...filter,
                        status : ucFirst(req.query.status),
                    }
                }
                if(req.query.isPaid){
                    filter = {
                        ...filter,
                        isPaid : isPaid == "1" ? true : false, // convert string to boolean
                    }
                }
                const {data , pagination} = await orderService.getAllOrders(filter, req.query);
                res.json({
                    message : "Orders fetched successfully",    
                    status : "ORDERS_FETCHED",
                    data : data,
                    options : pagination,
                })
            } else {
                const filter = {
                    seller : loggedInUser._id,
                    order : {$ne : null},
                    status : {$ne : OrderStatus.PENDING},

                };
                const {data , pagination} = await orderDetailService.getOrderDetails(filter, req.query);
                res.json({
                    message : "Orders fetched successfully",    
                    status : "ORDERS_FETCHED",
                    data : data,
                    options : pagination,
                })
            }
        } catch (error) {
            next(error);
        }
    }
    async getOrderById(req, res, next) {
        try {
            const order = await orderService.getOrderById({
                code : req.params.orderCode,
            });
            if(!order) {
                throw new Error("Order not found");
            }
            let filter = {
                order : order._id
            }
            const loggedInUser = req.loggedInUser;
            if(loggedInUser.role == UserRole.CUSTOMER) {
                filter.buyer = loggedInUser._id;
            }
            const {cart, pagination} = await orderDetailService.getOrderDetails(filter ,req.query);
            res.json({
                message : "Order details fetched successfully",
                status : "ORDER_DETAILS_FETCHED",
                data : cart,
                options : pagination,
            })
        } catch (error) {
            next(error);
        }
    }
}

const orderController = new OrderController();

module.exports = orderController;


