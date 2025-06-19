const { default: slugify } = require("slugify");
const cloudinaryService = require("../../services/cloudinary.services");
const CommonService = require("../../services/common.service");
const ProductModel = require("./product.model");
const { Query } = require("mongoose");
const { randomStringGenerator } = require("../../utils/helper");
const userService = require("../user/user.service");
const categoryService = require("../category/category.service");
const brandService = require("../brands/brand.service");


class ProductService extends CommonService {
  async transfromProductCreateData(req) {
    try {
      const data = req.body;
      data.createdBy = req.loggedInUser._id;

      if (data.category === "" || data.category === "null") {
        data.category = null;
      }

      if (!data.brand || data.brand === "null") {
        data.brand = null;
      }
      data.slug = slugify(
        data.name.replace("'", "").replace('"', "") +
          "-" +
          randomStringGenerator(5)
      ); //convert the data name into slug

      data.price = data.price * 100;

      data.afterDiscount = data.price - (data.price * data.discount) / 100;

      data.seller = req.loggedInUser._id;

      if (req.files) {
        let images = [];
        data.images = [];
        req.files.map((image) => {
          let uploadResponse = cloudinaryService.fileUpload(
            image.path,
            "/product_images/"
          ); //donot await as it makes this line of code in pending state and the other code will not execute until this code in executed
          images.push(uploadResponse);
        });
        const uploadStatus = await Promise.allSettled(images);
        uploadStatus.map((cloudinaryUploadSuccess) => {
          if (cloudinaryUploadSuccess.status === "fulfilled") {
            data.images.push(cloudinaryUploadSuccess.value);
          }
        });
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async transformProductUpdateData(req, oldData) {
    try {
      const data = req.body;
      data.updatedBy = req.loggedInUser._id;

      if (data.category === "" || data.category === "null") {
        data.category = null;
      }

      if (!data.brand || data.brand === "null") {
        data.brand = null;
      }

      data.price = data.price * 100;

      data.afterDiscount = data.price - (data.price * data.discount) / 100;

      if (req.files) {
        let images = [];
        data.images = [...oldData.images];
        req.files.map((image) => {
          let uploadResponse = cloudinaryService.fileUpload(
            image.path,
            "/product_images/"
          ); //donot await as it makes this line of code in pending state and the other code will not execute until this code in executed
          images.push(uploadResponse);
        });
        const uploadStatus = await Promise.all(images);
        uploadStatus.map((cloudinaryUploadSuccess) => {
          if (cloudinaryUploadSuccess.status === "fulfilled") {
            data.images.push(cloudinaryUploadSuccess.value);
          }
        });
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  publicProductData = (row) => {
    return {
      _id: row._id,
      name: row.name,
      status: row.status,
      slug: row.slug,
      description: row.description,
      price: row.price,
      discount: row.discount,
      afterDiscount: row.afterDiscount,
      images: row.images.map((image) => image?.optimizedUrl),
      category: row.category.map((category) => (categoryService.publicCategoryData(category))),
      brand: row.brand && brandService.publicBrandData(row.brand),
      tags: row.tags,
      stock: row.stock,
      sku: row.sku,
      homeFeature: row.homeFeature,
      seller: userService.getUserProfile(row.seller),
      attributes: row.attributes,      
      createdBy: userService.getUserProfile(row.createdBy),
      updatedBy: row.updatedBy && userService.getUserProfile(row.updatedBy),
    };
  };
  async listAllProducts(query, filter) {
    try {
      const page = +query.page || 1;
      const limit = +query.limit || 10;
      const skip = (page - 1) * limit;

      const data = await this.model
        .find(filter)
        .populate("brand", ["_id", "name", "slug", "logo", "status"])
        .populate("category", ["_id", "name", "slug", "icon", "status"])
        .populate("seller", [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          "status",
          "image",
        ])
        .populate("createdBy", [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          "status",
          "image",
        ]) //This means the createdBy field in a Product document stores an ObjectId that references a document in the User collection.
        // The .populate("createdBy") part tells Mongoose: "Hey, when you fetch a product, don't just give me the ID for createdBy. Go find the actual User document that this ID refers to and put it here instead
        .populate("updatedBy", [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          "status",
          "image",
        ])
        .sort({ createdAt: "desc", name: "asc" })
        .skip(skip)
        .limit(limit);

      const count = await this.model.countDocuments(filter);
      return {
        data: data.map(this.publicProductData),
        pagination: {
          current: page,
          limit: limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

const productService = new ProductService(ProductModel);
module.exports = productService;
