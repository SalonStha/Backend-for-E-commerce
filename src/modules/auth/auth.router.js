const authRouter = require('express').Router()

const authValidator = require('../../middlewares/auth.middleware') // Import the authValidator middleware

const auth = require('../../middlewares/authmodel.middleware') // Import the auth middleware

const uploader = require('../../middlewares/uploader.middleware') // Import the uploader middleware

const { RegisterDTO, LoginDTO, ForgetPasswordDTO, ResetPasswordDTO, UpdateUserDTO } = require('./auth.validator')

const authController = require('./auth.controller')

authRouter.post('/signup',uploader().single("image") ,authValidator(RegisterDTO), authController.registerUser) // Define a route for the signup URL

authRouter.post('/login', authValidator(LoginDTO), authController.loginUser) // Define a route for the login URL

authRouter.get('/activate/:token', authController.activateUser) // Define a route for the activate token URL

authRouter.get('/me-panel',auth(), authController.getUserProfile) // Define a route for the user profile URL

authRouter.get('/refresh-token', authController.refreshToken) // Define a route for the refresh token URL

authRouter.post('/forget-password', authValidator(ForgetPasswordDTO), authController.forgetPassword) // Define a route for the forget password URL

authRouter.get('/forget-password-verify/:token', authController.forgetPasswordVerifyToken) // Define a route for the forget password verify URL

authRouter.put('/reset-password',authValidator(ResetPasswordDTO), authController.resetPassword) // Define a route for the password reset URL

authRouter.get('/logout', authController.logout) // Define a route for the logout URL

authRouter.put('/update/:id',auth(), uploader().single("image"), authValidator(UpdateUserDTO),authController.updateUserById) // Define a route for the update user



module.exports = authRouter // Export the router for use in other modules