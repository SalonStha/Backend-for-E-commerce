const {randomStringGenerator} = require("../../utils/helper");
const { OrderStatus } = require("../../config/constants");
const OrderModel = require("./order.model");
const orderDetailService = require("./orderdetail/order-detail.service");
class OrderService {

    transformOrderObject(priceCalculation, loggedInUser) {
        return {
            code: randomStringGenerator(10),
            buyer: loggedInUser._id,
            ...priceCalculation,
            status: OrderStatus.PROCESSING,
            isPaid: false,
            createdBy: loggedInUser._id,
        }
    }

     calucalateOrderPrice(cartInfo, appliedVoucher) {
        let priceCalculation = {
            grossTotal: 0,
            discount: 0,
            deliveryFee: 0,
            serviceFee: 0,
            subTotal: 0,
            tax: 0,
            total: 0,
        }
        cartInfo.map((item) => {
            priceCalculation.grossTotal += item.product.afterDiscount * item.quantity;
            priceCalculation.deliveryFee += item.deliveryFee ;

            priceCalculation.subTotal += item.price * item.quantity;
        });

        priceCalculation.discount = appliedVoucher ? (priceCalculation.grossTotal * appliedVoucher.discount / 100) : 0;
        priceCalculation.serviceFee = (priceCalculation.grossTotal - priceCalculation.discount) * 10/100; 
        priceCalculation.subTotal = priceCalculation.grossTotal - priceCalculation.discount + priceCalculation.deliveryFee + priceCalculation.serviceFee; 
        priceCalculation.tax = priceCalculation.subTotal * 13/100;
        priceCalculation.total = priceCalculation.subTotal + priceCalculation.tax;
        return priceCalculation;
    }

    async createOrder(data) {
        try {
            const order = await OrderModel(data);
            return await order.save();
        } catch (error) {
            throw new Error(error);
        }
    }

    async getOrderById(orderId) {
        try {
            const order = await OrderModel.findOne(orderId)
            .populate('buyer', ['_id', 'firstName', 'lastName', 'email', 'phoneNumber', 'address','image','role','status']);
            return order;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllOrders(filter, query = {}) {
        try {
            const page = parseInt(query.page) || 1; 
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;
            const orders = await OrderModel.find(filter)
            .populate('buyer', ['_id', 'firstName', 'lastName', 'email', 'phoneNumber', 'address','image','role','status'])
            .sort({createdAt : -1})
            .skip(skip)
            .limit(limit);
            const totalCount = await OrderModel.countDocuments(filter);
            const pagination = {
                limit: limit,
                total: totalCount,
                currentPage : page,
                totalPages : Math.ceil(totalCount / limit),
            }
            return {data : orders, pagination};
        }catch (error) {
            throw new Error(error);
        }
    }
}

const orderService = new OrderService();

module.exports = orderService;

