const { Status } = require("../../config/constants");
const { ucFirst } = require("../../utils/helper");
const productService = require("../product/product.service");
const categoryService = require("./category.service");

class CategoryController {
  async createCategory(req, res, next) {
    try {
      const payLoad = await categoryService.transfromCategoryCreateData(req);
      const Category = await categoryService.create(payLoad);
      res.json({
        message: "Category created successfully",
        status: "SUCCESS",
        data: Category,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategories(req, res, next) {
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
      }if(+req.query.showInMenu === 1) {
        filter = {
          ...filter,
          showInMenu: true,
        }
      }else if(+req.query.showInMenu === 0) {
        filter = {
          ...filter,
          showInMenu: false,
        }
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
      const { data, pagination } = await categoryService.listAllCategories(
        req.query,
        filter
      );
      res.json({
        message: "Categories fetched successfully",
        status: "SUCCESS",
        data: data,
        options: pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  async getCategoryById(req, res, next) {
    try {
      const CategoryData = await categoryService.getSingleDataById({
        _id: req.params.categoryId,
      });
      if (!CategoryData) {
        throw {
          code: 404,
          message: "Category not found",
          status: "FAILED",
        };
      }
      res.json({
        message: "Category fetched successfully",
        status: "SUCCESS",
        data: CategoryData,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateCategory(req, res, next) {
    try {
      const CategoryDetail = await categoryService.getSingleDataById({
        _id: req.params.categoryId,
      });

      const payLoad = await categoryService.transformCategoryUpdateData(
        req,
        CategoryDetail
      );
      const updatedCategoryData = await categoryService.updateSingleDataById(
        { _id: CategoryDetail._id },
        payLoad
      );

      if (!CategoryDetail) {
        throw {
          code: 404,
          message: "Category not found",
          status: "FAILED",
        };
      }
      res.json({
        message: "Category updated successfully",
        status: "SUCCESS",
        data: updatedCategoryData,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteCategory(req, res, next) {
    try {
      const CategoryData = await categoryService.getSingleDataById({
        _id: req.params.categoryId,
      });
      if (!CategoryData) {
        throw {
          code: 404,
          message: "Category not found",
          status: "FAILED",
        };
      }
      const deletedData = await categoryService.deleteSingleDataById({
        _id: CategoryData._id,
      });
      res.json({
        message: "Category deleted successfully",
        status: "SUCCESS",
        data: deletedData,
      });
    } catch (error) {
      next(error);
    }
  }
  async getCategoryBySlug(req, res, next) {
    try {
      const slug = req.params.slug;
      const CategoryData = await categoryService.getSingleDataById({ slug: slug });

      if (!CategoryData) {
        throw {
          code: 404,
          message: "Category not found",
          status: "FAILED",
        };
      }

      //TODO product fetch 
      const filter = {
        category: {$in: CategoryData._id},
        status: Status.ACTIVE
        }
        const {data: products, pagination} = await productService.listAllProducts(req.query, filter);
      res.json({
        data: {
          CategoryData: CategoryData,
          products: products
        },
        message: "Category data fetched successfully",
        status: "SUCCESS",
        options: pagination,
      })
    } catch (error) {
      next(error);
    }
  }
}

const categoryController = new CategoryController();
module.exports = categoryController;
