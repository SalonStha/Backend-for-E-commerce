const mongoose  = require("mongoose");
const OrderModel = require("../order.model"); // Assuming the order model is in the same directory
const { OrderStatus } = require("../../../config/constants"); // Importing OrderStatus from constants
const ProductModel = require("../../product/product.model"); // Assuming the product model is in the product directory

const OrderDetailSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      // This field is optional, can be null if the order is not yet created
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 70 * 100, // Default delivery fee set to 10000 paisa
    },
    subTotal: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING, // Default status set to Pending
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, 
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, 
    },
  },
  { timestamps: true, 
    autoCreate: true,
    autoIndex: true,
   }
);

const OrderDetailModel = mongoose.model("OrderDetail", OrderDetailSchema);

module.exports = OrderDetailModel;