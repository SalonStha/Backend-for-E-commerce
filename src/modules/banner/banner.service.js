const cloudinaryService = require("../../services/cloudinary.services");
const BannerModel = require("./banner.model");

class BannerService  {
  async transfromBannerCreateData(req) {
    try {
      const data = req.body;

      if (req.file) {
        data.image = await cloudinaryService.fileUpload(
          req.file.path,
          "/banner_images/"
        );
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async transformBannerUpdateData(req, oldData) {
    try {
      const data = req.body;
      if (req.file) {
        data.image = await cloudinaryService.fileUpload(
          req.file.path,
          "/banner_images/"
        );
      } else {
        data.image = oldData.image;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  publicBannerData = (row) => {
    return {
      _id: row._id,
      title: row.title,
      status: row.status,
      link: row.link,
      image: row.image.optimizedUrl,
    };
  };
  async listAllBanners(query, filter) {
    try {
      const page = +query.page || 1;
      const limit = +query.limit || 10;
      const skip = (page - 1) * limit;

      const {rows: data, count} = await BannerModel.findAndCountAll({ 
        where: filter,  //Sequelize where is used to filter the data
        order: [["createdAt", "DESC"]], //Sequelize order is used to sort the data
        limit: limit, //Sequelize limit is used to limit the data
        offset: skip, //Sequelize offset is used to skip the data
      })
      return {
        data: data.map(this.publicBannerData),
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

  async createBanner(data) {
    try {
      const banner = await BannerModel.create(data);
      return banner;
    } catch (error) {
      throw error;
    }
  }
  async getSingleBannerById(id) {
    try {
      const banner = await BannerModel.findOne({
        where: id,
      });
      return banner;
    } catch (error) {
      throw error;
    }
  }
  async updateSingleBannerById(id, data) {
    try {
      const [count, banner] = await BannerModel.update(data, {
        where: id,
        returning: true,
      });
      return banner[0];
    } catch (error) {
      throw error;
    }
  }
  async deleteSingleBannerById(id) {
    try {
      const banner = await BannerModel.destroy({where: id}); 
      return banner; 
    } catch (error) {
      throw error;
    }
  }
}

const bannerService = new BannerService();
module.exports = bannerService;
