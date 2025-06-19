const mongoose = require("mongoose");
const { Status } = require("../../config/constants");
const { required } = require("joi");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true, //set price always in Paisa for better account partiality //For clear audit
      min: 200 * 100, //This price is in Paisa not in Rupee
    },
    discount: {
      type: Number,
      default: 0,
      max: 70,
      min: 0,
    },
    afterDiscount: {
      type: Number,
      default: 0,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    tags: [String],
    stock: {
      type: Number,
      min: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attributes: [
      {
        key: String,   //{key: colour}
        value: [String], //{value: 'red','black','blue'}
      },
    ],
    images: [
      {
        publicId: String,
        secureUrl: String,
        optimizedUrl: String,
      },
    ],
    sku: String,
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    homeFeature: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
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
  {
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel; // Export the Product model for use in other modules
