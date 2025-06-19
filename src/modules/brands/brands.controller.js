const { options } = require("joi");
const { ucFirst } = require("../../utils/helper");
const productService = require("../product/product.service");
const brandService = require("./brand.service");
const { Status } = require("../../config/constants");


class BrandController {
  async createBrand(req, res, next) {
    try {
      const payLoad = await brandService.transfromBrandCreateData(req);
      const brand = await brandService.create(payLoad);
      res.json({
        message: "Brand created successfully",
        status: "SUCCESS",
        data: brand,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllBrands(req, res, next) {
    try {
      let filter = {};
      if (req.query.search) {
        filter = {
          ...filter,
          name: new RegExp(req.query.search, "i"),
        };
      }
      if (req.query.status) {
        filter = {
          ...filter,
          status: ucFirst(req.query.status),
        };
      }
      const { data, pagination } = await brandService.listAllBrands(
        req.query,
        filter
      );
      res.json({
        message: "Brands fetched successfully",
        status: "SUCCESS",
        data: data,
        options: pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  async getBrandById(req, res, next) {
    try {
      const brandData = await brandService.getSingleDataById({
        _id: req.params.brandId,
      });
      if (!brandData) {
        throw {
          code: 404,
          message: "Brand not found",
          status: "FAILED",
        };
      }
      res.json({
        message: "Brand fetched successfully",
        status: "SUCCESS",
        data: brandData,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBrand(req, res, next) {
    try {
      const brandDetail = await brandService.getSingleDataById({
        _id: req.params.brandId,
      });

      const payLoad = await brandService.transformBrandUpdateData(
        req,
        brandDetail
      );
      console.log("Brand payload", payLoad);
      const updatedBrandData = await brandService.updateSingleDataById(
        { _id: brandDetail._id },
        payLoad
      );

      if (!brandDetail) {
        throw {
          code: 404,
          message: "Brand not found",
          status: "FAILED",
        };
      }
      res.json({
        message: "Brand updated successfully",
        status: "SUCCESS",
        data: updatedBrandData,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteBrand(req, res, next) {
    try {
      const brandData = await brandService.getSingleDataById({
        _id: req.params.brandId,
      });
      if (!brandData) {
        throw {
          code: 404,
          message: "Brand not found",
          status: "FAILED",
        };
      }
      const deletedData = await brandService.deleteSingleDataById({
        _id: brandData._id,
      });
      res.json({
        message: "Brand deleted successfully",
        status: "SUCCESS",
        data: deletedData,
      });
    } catch (error) {
      next(error);
    }
  }
  async getBrandBySlug(req, res, next) {
    try {
      const slug = req.params.slug;
      const brandData = await brandService.getSingleDataById({ slug: slug });

      if (!brandData) {
        throw {
          code: 404,
          message: "Brand not found",
          status: "FAILED",
        };
      }

      //TODO product fetch 
      const filter = {
        brand: brandData._id,
        status: (Status.INACTIVE)
      }
      const {data: products, pagination} = await productService.listAllProducts(req.query, filter)
      res.json({
        data: {
          brandData: brandData,
          products: products,
        },
        message: "Brand data fetched successfully",
        status: "SUCCESS",
        options: pagination,
      })
      console.log(products)
    } catch (error) {
      next(error);
    }
  }
}

const brandController = new BrandController();
module.exports = brandController;
