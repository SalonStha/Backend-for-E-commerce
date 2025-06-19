const { Status } = require("../../config/constants");
const UserModel = require("./user.model");

class UserService {
  async UserCreate(data) {
    try {
      const user = new UserModel(data); // Create a new user in the database
      return await user.save(); // Save the user to the database // Return the saved user object
    } catch (error) {
      // if (error.code === 11000) { // Check for duplicate key error
      //     throw new Error('User already exists');
      // }
      throw error;
    }
  }
  getUserProfile(user) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      gender: user.gender,
      status: user.status,
      dob: user.dob,
      image: user.image,
      address: user.address,
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
      createdBy: user.createdBy,
      isDeleted: user.isDeleted,
      deletedAt: user.deletedAt,
      activationToken: user.activationToken,
    };
  }
  getSingleUserByFilter = async (filter) => {
    try {
        const finalFilter = { isDeleted: false, ...filter }; //By default, do not include soft-deleted users
      const userData = await UserModel.findOne(finalFilter); // Find a single user by filter //Re-usable function
      return userData;
    } catch (error) {
      throw error;
    }
  };

  getAllUsers = async (filter, query) => {
    try {
      const baseFilter = { isDeleted: false, ...filter }; //By default, do not include soft-deleted users
      const page = +query.page || 1;
      const limit = +query.limit || 10;
      const skip = (page - 1) * limit;

      const data = await UserModel.find(baseFilter)
        .sort({ name: "asc", createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const count = await UserModel.countDocuments(baseFilter);
      return {
        data: data.map((user) => this.getUserProfile(user)),
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
  };

  async updateSingleUserByFilter(filter, data) {
    try {
      const userData = await UserModel.findOneAndUpdate(
        filter,
        { $set: data },
        { new: true }
      ); // Find and update a single user by filter
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async softDeleteUserByFilter(filter) {
    try {

      const finalFilter = {...filter, isDeleted : false}
      const updateData = {
        isDeleted: true,
        deletedAt: new Date(),
        status: Status.DELETED,
        activationToken: null,
        forgetPasswordToken: null,
        // updatedBy: req.loggedInUser._id,
      };
      const updatedUser = await UserModel.findOneAndUpdate(
        finalFilter,
        { $set: updateData },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

const userService = new UserService();
module.exports = userService;
