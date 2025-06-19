const OrderDetailModel = require("./order-detail.model");

const { OrderStatus } = require("../../../config/constants");


class OrderDetailService {
  async getSingleOrderDetail(filter) {
    try {
      const orderDetail = await OrderDetailModel.findOne(filter);
      return orderDetail;
    } catch (error) {
      throw error;
    }
  }
   transformToCartItem({ productDetail, quantity, loggedInUser }) {
    return{
      order: null,
      buyer: loggedInUser._id,
      product: productDetail._id,
      quantity: quantity,
      price: productDetail.afterDiscount,
      deliveryFee: 70 * 100, // Default delivery fee set to 7000 paisa
      subTotal: productDetail.afterDiscount * quantity,
      totalPrice: (productDetail.afterDiscount * quantity) + 70 * 100, // Total price including delivery fee
      status: OrderStatus.PENDING, 
      seller: productDetail.seller._id,
      createdBy: loggedInUser._id,
    }
  }

  addToCart = async (data) => {
    try {
      const orderDetailObject = new OrderDetailModel(data)
      return await orderDetailObject.save(); // Save the order detail to the database
    } catch (error) {
      throw error;
    }
  };
  getOrderDetails = async (filter , query) => {
    try {
      const page = +query.page || 1; // Default to page 1 if not provided
      const limit = +query.limit || 10; // Default to 10 items per page if not provided
      const skip = (page - 1) * limit; // Calculate the number of items to skip for pagination
      const orderDetails = await OrderDetailModel.find(filter)
        .populate("order", ['_id','code', 'status', 'subTotal', 'deliveryFee','totalPrice', 'isPaid'])
        .populate("product", ["_id","name", "image", "price", "afterDiscount","seller","brand","stock"])
        .populate("buyer", ["_id" , "firstName", "lastName", "email", "phoneNumber" , "address"])
        .populate("createdBy", ["_id" , "firstName", "lastName", "email", "phoneNumber" , "address"])
        .populate("seller", ["_id" , "firstName", "lastName", "email", "phoneNumber" , "address"])
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .skip(skip) // Skip the calculated number of items
        .limit(limit); // Limit the number of items returned to the specified limit
      const totalCount = await OrderDetailModel.countDocuments(filter); // Get the total count of documents matching the filter
      return {
        cart: orderDetails, 
        pagination: {
          totalCount: totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit), // Calculate total pages based on count and limit
          limit: limit,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  deleteFromCart = async (filter) => {
    try {
      const cartDetail = await OrderDetailModel.deleteOne(filter);
      return cartDetail;
    } catch (error) {
      throw error;
    }
  }  

  async updateOrderDetail(order, cartInfo) {
    try {
        const updatedCart = [];
        cartInfo.map((item) => {
            item.order = order._id;
            item.price = item.product.afterDiscount;
            item.subTotal = item.price * item.quantity;
            item.totalPrice = item.subTotal + item.deliveryFee;
            item.status = OrderStatus.PROCESSING;
            updatedCart.push(item.save()); // save the updated item
        });
        const updateStatus = await Promise.allSettled(updatedCart);
        let returnOrderDetail = [];
        updateStatus.forEach((item) => {
            if(item.status === "fulfilled") {
                returnOrderDetail.push(item.value);
            }
        });
        return returnOrderDetail;
    } catch (error) {
        throw new Error(error);
    }
}
async reduceProductStock(cartInfo) {
  try {
    let updatedCart = [];
    cartInfo.map((item) => {
      item.product.stock -= item.quantity; 
      updatedCart.push(item.product.save());  
    });
    const updateStatus = await Promise.allSettled(updatedCart); 
    let returnProduct = [];
    updateStatus.forEach((productResponse) => {
      if(productResponse.status === "fulfilled") {
        returnProduct.push(productResponse.value); // push the updated product to the returnProduct array
      }
    });
    return returnProduct;
  } catch (error) {
    throw new Error(error);
  }
}
}

const orderDetailService = new OrderDetailService();
module.exports = orderDetailService;
