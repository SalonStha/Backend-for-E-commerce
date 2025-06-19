const { Status } = require("../../config/constants");
const { ucFirst } = require("../../utils/helper");
const productService = require("./product.service");

class ProductController {
  async createProduct(req, res, next) {
    try {
      const payLoad = await productService.transfromProductCreateData(req);
      const Product = await productService.create(payLoad);
      res.json({
        message: "Product created successfully",
        status: "SUCCESS",
        data: Product,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllProducts(req, res, next) {
    try {
      let filter = {};

      let loggedInUser = req.loggedInUser;
      if (loggedInUser) {
        filter = {
          ...filter,
          seller: req.loggedInUser._id,
        };
      }
      if (req.query.search) {
        filter = {
          ...filter,
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { description: { $regex: req.query.search, $options: "i" } },
          ]
        };
      }
      if (req.query.status) {
        filter = {
          ...filter,
          status: ucFirst(req.query.status),
        };
      }
      if(+req.query.homeFeature === 1) {
        filter = {
          ...filter,
          homeFeature: true,
        }
      }
      if(+req.query.homeFeature === 0) {
        filter = {
          ...filter,
          homeFeature: false,
        }
      }
      const { data, pagination } = await productService.listAllProducts(
        req.query,
        filter
      );
      res.json({
        message: "Products fetched successfully",
        status: "SUCCESS",
        data: data,
        options: pagination,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getAllProductsForPublic(req, res, next) {
    try {
      let filter = {
        status: Status.ACTIVE,
      };

      if (req.query.search) {
        filter = {
          ...filter,
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { description: { $regex: req.query.search, $options: "i" } },
          ]
        };
      }
      if(+req.query.homeFeature === 1) {
        filter = {
          ...filter,
          homeFeature: true,
        }
      }
      if(+req.query.homeFeature === 0) {
        filter = {
          ...filter,
          homeFeature: false,
        }
      }
      const { data, pagination } = await productService.listAllProducts(
        req.query,
        filter
      );
      res.json({
        message: "Products fetched successfully",
        status: "SUCCESS",
        data: data,
        options: {pagination},
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getProductById(req, res, next) {
    try {
      const ProductData = await productService.getSingleDataById({
        _id: req.params.productId,
      });
      if (!ProductData) {
        throw {
          code: 404,
          message: "Product not found",
          status: "FAILED",
        };
      }
      res.json({
        message: "Product fetched successfully",
        status: "SUCCESS",
        data: ProductData,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProduct(req, res, next) {
    try {
      const ProductDetail = await productService.getSingleDataById({
        _id: req.params.productId,
      });

      const payLoad = await productService.transformProductUpdateData(
        req,
        ProductDetail
      );
      const updatedProductData = await productService.updateSingleDataById(
        { _id: ProductDetail._id },
        payLoad
      );

      if (!ProductDetail) {
        throw {
          code: 404,
          message: "Product not found",
          status: "FAILED",
        };
      }
      res.json({
        message: "Product updated successfully",
        status: "SUCCESS",
        data: updatedProductData,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteProduct(req, res, next) {
    try {
      const ProductData = await productService.getSingleDataById({
        _id: req.params.productId,
      });
      if (!ProductData) {
        throw {
          code: 404,
          message: "Product not found",
          status: "FAILED",
        };
      }
      const deletedData = await productService.deleteSingleDataById({
        _id: ProductData._id,
      });
      res.json({
        message: "Product deleted successfully",
        status: "SUCCESS",
        data: deletedData,
      });
    } catch (error) {
      next(error);
    }
  }
  async getProductBySlug(req, res, next) {
    try {
      const slug = req.params.slug;
      const ProductData = await productService.getSingleDataById({ slug: slug });

      if (!ProductData) {
        throw {
          code: 404,
          message: "Product not found",
          status: "FAILED",
        };
      }

      //TODO product fetch 
      const {data :reletedProducts} = await productService.listAllProducts(
        {
          page: 1,
          limit: 10
        },
        {
        category: {$in: ProductData.category.map(item => item._id)},
        _id: {$ne: ProductData._id}
      })
      res.json({
        data: {
          ProductData: ProductData,
          reletedProducts: reletedProducts
        },
        message: "Product data fetched successfully",
        status: "SUCCESS",
      })
    } catch (error) {
      next(error);
    }
  }
}

const productController = new ProductController();
module.exports = productController;
