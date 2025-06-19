const { UserRole } = require('../../config/constants');

const userRouter = require('express').Router(); // Import the express router

const userController = require('./user.controller'); // Import the user controller

const auth = require('../../middlewares/authmodel.middleware')

userRouter.get("/",auth([UserRole.ADMIN]),userController.getAllUsers)
userRouter.get("/:userId",auth([UserRole.ADMIN]),userController.getUserById)
userRouter.delete("/:userId",auth([UserRole.ADMIN]),userController.deleteUserById)


module.exports = userRouter; // Export the user router for use in other modules
