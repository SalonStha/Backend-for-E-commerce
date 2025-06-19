const { default: slugify } = require("slugify");
const cloudinaryService = require("../../services/cloudinary.services");
const CommonService = require("../../services/common.service");
const BrandModel = require("./brands.model");
const { Query } = require("mongoose");

class BrandService extends CommonService {
  async transfromBrandCreateData(req) {
    try {
      const data = req.body;
      data.createdBy = req.loggedInUser._id;

      if (req.file) {
        data.logo = await cloudinaryService.fileUpload(
          req.file.path,
          "/brand_logos/"
        );
      }
      data.slug = slugify(data.name.replace("'", "").replace('"', "")); //convert the data name into slug
      return data;
    } catch (error) {
      throw error;
    }
  }
  async transformBrandUpdateData(req, oldData) {
    try {
      const data = req.body;
      data.updatedBy = req.loggedInUser._id;

      if (req.file) {
        data.logo = await cloudinaryService.fileUpload(
          req.file.path,
          "/brand_logos/"
        );
      } else {
        data.logo = oldData.logo;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  publicBrandData = (row) => {
    return {
      _id: row._id,
      name: row.name,
      status: row.status,
      slug: row.slug,
      logo: row.logo.optimizedUrl,
      createdBy: {
        _id: row?.createdBy?._id,
        firstName: row?.createdBy?.firstName,
        lastName: row?.createdBy?.lastName,
        email: row?.createdBy?.email,
        role: row?.createdBy?.role,
        status: row?.createdBy?.status,
        image: row?.createdBy?.image.optimizedUrl, ///Mongodb cannot use spread module row
      },
    };
  };
  async listAllBrands(query, filter) {
    try {
      const page = +query.page || 1;
      const limit = +query.limit || 10;
      const skip = (page - 1) * limit;

      const data = await this.model
        .find(filter)
        .populate("createdBy", [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          "status",
          "image",
        ]) //This means the createdBy field in a Brand document stores an ObjectId that references a document in the User collection.
        // The .populate("createdBy") part tells Mongoose: "Hey, when you fetch a brand, don't just give me the ID for createdBy. Go find the actual User document that this ID refers to and put it here instead
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
        data: data.map(this.publicBrandData),
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

const brandService = new BrandService(BrandModel);
module.exports = brandService;
