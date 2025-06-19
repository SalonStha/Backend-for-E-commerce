const mongoose = require("mongoose");
const { OrderStatus } = require("../../config/constants");
const OrderDetailModel = require("./orderdetail/order-detail.model"); // Import OrderDetailModel

const OrderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      minlength: 10,
      maxlength: 20,
      required: true,
      unique: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grossTotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    tax: Number,
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING, // Default status set to Pending
    },
    isPaid: Boolean,
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
    orderdetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderDetail",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    autoCreate: true, // Automatically create the collection if it doesn't exist
    autoIndex: true, // Automatically create indexes defined in the schema
  }
);  

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
