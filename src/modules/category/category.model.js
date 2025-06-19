const mongoose = require("mongoose");
const { Status } = require("../../config/constants");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId, //In essence, this parentId field allows you to create a hierarchical or tree-like structure for your categories,
      // where a category can have a parent category, enabling features like subcategories.
      ref: "Category",
      default: null,
    },
    brands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        default: null,
      },
    ],
    showInMenu: {
      type: Boolean,
      default: false,
    },
    homeFeature : {
      type: Boolean,
      default: false,
    },
    icon: {
      publicId: String,
      secureUrl: String,
      optimizedUrl: String,
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

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel; // Export the Category model for use in other modules
