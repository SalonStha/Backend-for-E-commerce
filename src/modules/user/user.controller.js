const { ucFirst } = require("../../utils/helper");
const authService = require("../auth/auth.service");
const userService = require("./user.service");

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const loggedInUser = req.loggedInUser;
      let filter = {
        _id: { $ne: loggedInUser._id },
      };

      if (req.query.search) {
        filter = {
          ...filter,
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { lastName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            { gender: { $regex: req.query.search, $options: "i" } },
            {
              "address.billingAddress": {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              "address.shippingAddress": {
                $regex: req.query.search,
                $options: "i",
              },
            },
          ],
        };
      }
      if (req.query.role) {
        filter = {
          ...filter,
          role: ucFirst(req.query.role),
        };
      }
      if (req.query.gender) {
        filter = {
          ...filter,
          gender: ucFirst(req.query.gender),
        };
      }

      const { data, pagination } = await userService.getAllUsers(
        filter,
        req.query
      );
      res.json({
        message: "User fetched successfully",
        data: data,
        status: "SUCCESS",
        options: {
          pagination,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  async getUserById(req, res, next) {
    try {
      const userId = req.params.userId;
      const userDetail = await userService.getSingleUserByFilter({
        _id: userId,
      });
      if (!userDetail) {
        return res.status(422).json({
          message: "User not found",
          status: "FAILED",
        });
      }
      res.json({
        message: "User fetched successfully",
        data: userService.getUserProfile(userDetail), //To get only public data
        status: "SUCCESS",
      });
    } catch (err) {
      next(err);
    }
  }
  async deleteUserById(req, res, next) {
    try {
      const userId = req.params.userId;
      if (req.loggedInUser._id.toString() === userId) {
        return res.status(422).json({
          message:
            "You can't delete you own account. Please contact admin if needed",
          status: "FORBIDDEN",
        });
      }

      const deletedUser = await userService.softDeleteUserByFilter(
        { _id: userId },
        req.loggedInUser._id
      ); // The softDeleteUserById service method handles checking if the user exists and isn't already deleted.

      if (!deletedUser) {
        return res.status(404).json({
          message: "User not found or already deleted",
          status: "FAILED",
        });
      }
      await authService.logoutUserFromAll({
        // Invalidate all active sessions for the soft-deleted user
        userId: deletedUser._id,
      });
      res.json({
        message: "User has been soft deleted successfully",
        data: userService.getUserProfile(deletedUser),
        status: "SUCCESS",
      });
    } catch (err) {
      next(err);
    }
  }
}
const userController = new UserController();
module.exports = userController;
