const { default: slugify } = require("slugify");
const cloudinaryService = require("../../services/cloudinary.services");
const CommonService = require("../../services/common.service");
const CategoryModel = require("./category.model");
const { Query } = require("mongoose");

class CategoryService extends CommonService {
  async transfromCategoryCreateData(req) {
    try {
      const data = req.body;
      data.createdBy = req.loggedInUser._id;

      if (req.file) {
        data.icon = await cloudinaryService.fileUpload(
          req.file.path,
          "/category_icon/"
        );
      }

      if (data.parentId === "" || data.parentId === "null") {
        data.parentId = null;
      }

      if (!data.brands || data.brands === "null") {
        data.brands = null;
      }
      data.slug = slugify(data.name.replace("'", "").replace('"', "")); //convert the data name into slug
      return data;
    } catch (error) {
      throw error;
    }
  }
  async transformCategoryUpdateData(req, oldData) {
    try {
      const data = req.body;
      data.updatedBy = req.loggedInUser._id;

      if (req.file) {
        data.icon = await cloudinaryService.fileUpload(
          req.file.path,
          "/category_icon/"
        );
      } else {
        data.icon = oldData.icon;
      }
      if (data.parentId === "" || data.parentId === "null") {
        data.parentId = null;
      }

      if (!data.brands || data.brands === "null") {
        data.brands = null;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  publicCategoryData = (row) => {
    return {
      _id: row._id,
      name: row.name,
      status: row.status,
      slug: row.slug,
      parentId: {
        _id: row.parentId?._id,
        name: row.parentId?.name,
        slug: row.parentId?.slug,
        icon: row.parentId?.icon.optimizedUrl,
        status: row.parentId?.status,
      },
      brands: row?.brands?.map((brand) => ({
        _id: brand._id,
        name: brand.name,
        slug: brand.slug,
        logo: brand?.logo?.optimizedUrl,
        status: brand.status,
      })),
      icon: row.icon.optimizedUrl,
      createdBy: {
        _id: row.createdBy?._id,
        firstName: row.createdBy?.firstName,
        lastName: row.createdBy?.lastName,
        email: row.createdBy?.email,
        role: row.createdBy?.role,
        status: row.createdBy?.status,
        image: row.createdBy?.image.optimizedUrl, ///Mongodb cannot use spread module row
      },
    };
  };
  async listAllCategories(query, filter) {
    try {
      const page = +query.page || 1;
      const limit = +query.limit || 10;
      const skip = (page - 1) * limit;

      const data = await this.model
        .find(filter)
        .populate("brands", ["_id", "name", "slug", "logo", "status"])
        .populate("parentId", ["_id", "name", "slug", "icon", "status"])
        .populate("createdBy", [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          "status",
          "image",
        ]) //This means the createdBy field in a Category document stores an ObjectId that references a document in the User collection.
        // The .populate("createdBy") part tells Mongoose: "Hey, when you fetch a category, don't just give me the ID for createdBy. Go find the actual User document that this ID refers to and put it here instead
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
        data: data.map(this.publicCategoryData),
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

const categoryService = new CategoryService(CategoryModel);
module.exports = categoryService;
