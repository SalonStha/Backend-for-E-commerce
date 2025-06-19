const { ucFirst } = require("../../utils/helper");
const bannerService = require("./banner.service");
const { Status } = require("../../config/constants");
const { Op } = require("sequelize");


class BannerController {
  async createBanner(req, res, next) {
    try {
      const payLoad = await bannerService.transfromBannerCreateData(req);
      const banner = await bannerService.createBanner(payLoad);
      res.json({
        message: "Banner created successfully",
        status: "SUCCESS",
        data: banner,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllBanners(req, res, next) {
    try {
      let filter = {};
      if (req.query.search) {
        filter = {
          ...filter,
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        };
      }
      if (req.query.status) {
        filter = {
          ...filter,
          status: ucFirst(req.query.status),
        };
      }
      const { data, pagination } = await bannerService.listAllBanners(
        req.query,
        filter
      );
      res.json({
        message: "Banners fetched successfully",
        status: "SUCCESS",
        data: data,
        options: pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  async getBannerById(req, res, next) {
    try {
      const bannerData = await bannerService.getSingleBannerById({
        _id: req.params.bannerId,
      });
      if (!bannerData) {
        throw {
          code: 404,
          message: "Banner not found",
          status: "FAILED",
        };
      }
      res.json({
        message: "Banner fetched successfully",
        status: "SUCCESS",
        data: bannerData,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBanner(req, res, next) {
    try {
      const bannerDetail = await bannerService.getSingleBannerById({
        _id: req.params.bannerId,
      });

      const payLoad = await bannerService.transformBannerUpdateData(
        req,
        bannerDetail
      );
      console.log("Banner payload", payLoad);
      const updatedBannerData = await bannerService.updateSingleBannerById(
        { _id: bannerDetail._id },
        payLoad
      );

      if (!bannerDetail) {
        throw {
          code: 404,
          message: "Banner not found",
          status: "FAILED",
        };
      }
      res.json({
        message: "Banner updated successfully",
        status: "SUCCESS",
        data: updatedBannerData,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteBanner(req, res, next) {
    try {
      const bannerData = await bannerService.getSingleBannerById({
        _id: req.params.bannerId,
      });
      if (!bannerData) {
        throw {
          code: 404,
          message: "Banner not found",
          status: "FAILED",
        };
      }
      const deletedData = await bannerService.deleteSingleBannerById({
        _id: bannerData._id,
      });
      res.json({
        message: "Banner deleted successfully",
        status: "SUCCESS",
        data: deletedData,
      });
    } catch (error) {
      next(error);
    }
  }
}

const bannerController = new BannerController();
module.exports = bannerController;
