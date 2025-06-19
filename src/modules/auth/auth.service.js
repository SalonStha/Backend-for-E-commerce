const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const { Status } = require("../../config/constants"); // Import the Status constants
const { randomStringGenerator } = require("../../utils/helper"); // Import the random string generator function
const cloudinaryService = require("../../services/cloudinary.services"); // Import the Cloudinary service
const { appConfig } = require("../../config/config"); // Import the app configuration
const emailService = require("../../services/email.services"); // Import the email service
const UserModel = require("../user/user.model"); // Import the User model
const AuthModel = require("./auth.model");
const userService = require("../user/user.service");
const auth = require("../../middlewares/authmodel.middleware");

class AuthService {
  async transformUserCreate(req) {
    try {
      const data = req.body; // Get the request body
      if (req.file) {
        data.image = await cloudinaryService.fileUpload(
          req.file.path,
          "/user/" + data.firstName
        ); // Upload the file to Cloudinary and get the URL
      }
      data.password = bcrypt.hashSync(data.password, 12); // Hash the password using bcrypt // Hash the password with a salt rounds of 12
      // console.log(bcrypt.compareSync(data.confirmPassword + 'dsadsf', data.password)); // Compare the hashed password with the plain password
      data.status = Status.INACTIVE; // Set the status to INACTIVE
      data.activationToken = randomStringGenerator(100); // Generate a random activation token

      const { confirmPassword, ...mappeddata } = data; // Destructure the data object to remove the confirmPassword field
      return mappeddata; // Return the mapped data object
    } catch (error) {
      throw error; // Throw any errors that occur during the transformation process
    }
  }
  async transformUserUpdate(req ,oldData) {
    try {
      const data = req.body; // Get the request body

      const payload = {
        ...data,
      }; // Create a payload object with the updated data

      if(req.loggedInUser && req.loggedInUser._id) {
        payload.updatedBy = req.loggedInUser._id; // Set the updatedBy field to the logged-in user's ID
      }
      if (req.file) {
        data.image = await cloudinaryService.fileUpload(
          req.file.path,
          "/user/" + data.firstName
        ); // Upload the file to Cloudinary and get the URL
      } else {
        data.image = oldData.image;
      }
   return payload; 
    } catch (error) {
      throw error; // Throw any errors that occur during the transformation process
    }
  }
  async sendActivationEmail(data) {
    try {
      await emailService.sendEmail({
        to: data.email, // Set the recipient email address
        sub: "Activate Your Account - Welcome to Sasto Bazzar", // Set the subject of the email
        msg: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="background-color:rgb(68, 53, 207); padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0;">Welcome to Sasto Bazzar, ${
                              data.firstName
                            }!</h1>
                        </div>
                        <div style="padding: 50px; text-align: center;">
                        <div style="padding: 40px;">
                            <p style="font-size: 18px;">We're thrilled to have you on board. Your journey to an amazing shopping experience starts here!</p>
                            <p style="font-size: 16px;">To get started, please activate your account by clicking the button below:</p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${appConfig.frontendUrl}/activate/${
          data.activationToken
        }" 
                                   style="background-color:rgb(50, 30, 165); color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                                   Activate My Account
                                </a>    
                            </div>
                            <p style="font-size: 16px;">If you didn't create an account, please ignore this email.</p>
                            <p style="font-size: 16px;">If you have any questions, feel free to reach out to us.</p>
                            <p style="font-size: 16px;">If the button above doesn't work, copy and paste the following link into your browser:</p>
                            <p style="font-size: 14px; color: #555;">${
                              appConfig.frontendUrl
                            }/activate/${data.activationToken}</p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="font-size: 14px; color: #555;">Need help? Feel free to <a href="${
                              appConfig.frontendUrl
                            }/contact" style="color: #4CAF50;">contact us</a>.</p>
                            <p style="font-size: 14px; color: #555;">Thank you for choosing <b>Sasto Bazzar</b>. We can't wait to serve you!</p>
                        </div>
                        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777; font-size: 12px;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Sasto Bazzar. All rights reserved.</p>
                        </div>
                    </div>
                `,
      });
    } catch (error) {
      throw error; // Throw any errors that occur during the email sending process
    }
  }
  async welcomeEmail(data) {
    try {
      return await emailService.sendEmail({
        to: data.email,
        sub: "Account Successfully Activated - Welcome to Sasto Bazzar",
        msg: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="background-color: rgb(68, 53, 207); padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0;">Congratulations, ${
                              data.firstName
                            }!</h1>
                        </div>
                        <div style="padding: 50px; text-align: center;">
                            <p style="font-size: 18px;">Your account has been successfully activated!</p>
                            <p style="font-size: 16px;">You are now part of the Sasto Bazzar family. Start exploring amazing deals and enjoy a seamless shopping experience.</p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${appConfig.frontendUrl}" 
                                   style="background-color: rgb(50, 30, 165); color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                                   Start Shopping
                                </a>
                            </div>
                            <p style="font-size: 16px;">If you have any questions or need assistance, feel free to reach out to us.</p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="font-size: 14px; color: #555;">Need help? Feel free to <a href="${
                              appConfig.frontendUrl
                            }/contact" style="color: #4CAF50;">contact us</a>.</p>
                            <p style="font-size: 14px; color: #555;">Thank you for choosing <b>Sasto Bazzar</b>. We are excited to have you on board!</p>
                        </div>
                        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777; font-size: 12px;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Sasto Bazzar. All rights reserved.</p>
                        </div>
                    </div>
                `,
      });
    } catch (error) {
      throw error; // Throw any errors that occur during the email sending process
    }
  }
  async createAuth(data) {
    try {
      const auth = new AuthModel(data); // Create a new authentication record in the database
      return await auth.save(); // Save the authentication record and return it
    } catch (error) {
      throw error; // Throw any errors that occur during the creation process
    }
  }
  async getSingleAuthByFilter(filter) {
    try {
      const auth = AuthModel.findOne(filter); // Find a single authentication record by the given filter
      return auth; // Return the authentication record
    } catch (error) {
      throw error; // Throw any errors that occur during the retrieval process
    }
  }
  async logoutUser(token) {
    try {
      const accessToken = token.replace("Bearer ", "");
      const authData = await this.getSingleAuthByFilter({
        maskedAccessToken: accessToken,
      });
      if (!authData) {
        throw {
          code: 401,
          message: "Token Invalid",
          status: "Token deleted from server",
        };
      }
      const authDel = await AuthModel.findOneAndDelete({
        maskedAccessToken: accessToken,
      }); //findanddelete to log out users from all devices //maskedAccessToken:accessToken  Use this instead user: user._id
      return authDel;
    } catch (error) {
      throw error;
    }
  }
  async logoutUserFromAll(filter) {
    try {
      const authDel = await AuthModel.deleteMany(filter);
      return authDel;
    } catch (error) {
      throw error;
    }
  }
  async updateSingleRowByFilter(filter, data) {
    try {
      const response = await AuthModel.findOneAndUpdate(
        filter,
        { $set: data },
        {
          new: true,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async sendPasswordResetEmail(userData) {
    try {
      return await emailService.sendEmail({
        to: userData.email,
        sub: "Password Reset Request - Sasto Bazzar",
        msg: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="background-color: rgb(68, 53, 207); padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0;">Password Reset Request</h1>
                        </div>
                        <div style="padding: 50px; text-align: center;">
                            <p style="font-size: 18px;">Hello ${
                              userData.firstName
                            },</p>
                            <p style="font-size: 16px;">We received a request to reset the password for your Sasto Bazzar account.</p>
                            <p style="font-size: 16px;">If you made this request, please click the button below to set a new password. This link is valid for 3 hours.</p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${
                                  appConfig.frontendUrl
                                }/reset-password/${
          userData.forgetPasswordToken
        }" 
                                   style="background-color: rgb(50, 30, 165); color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                                   Reset My Password
                                </a>    
                            </div>
                            <p style="font-size: 16px;">If you did not request a password reset, please ignore this email or contact us if you have concerns.</p>
                            <p style="font-size: 16px;">If the button above doesn't work, copy and paste the following link into your browser:</p>
                            <p style="font-size: 14px; color: #555;">${
                              appConfig.frontendUrl
                            }/reset-password/${userData.forgetPasswordToken}</p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="font-size: 14px; color: #555;">Need help? Feel free to <a href="${
                              appConfig.frontendUrl
                            }/contact" style="color: #4CAF50;">contact us</a>.</p>
                            <p style="font-size: 14px; color: #555;">Thank you for using <b>Sasto Bazzar</b>!</p>
                        </div>
                        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777; font-size: 12px;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Sasto Bazzar. All rights reserved.</p>
                        </div>
                    </div>
                `,
      });
    } catch (error) {
      throw error;
    }
  }
  async verfiyPasswordResetToken(token) {
    try {
      const userDetail = await userService.getSingleUserByFilter({
        forgetPasswordToken: token,
      });
      if (!userDetail) {
        throw {
          code: 404,
          message: "This user is already activated, Thank you!",
          status: "Not Found",
          options: null,
        };
      }
      let tokenExpiry = userDetail.activateTokenExpire.getTime(); // get time in milliseconds
      const currentTime = new Date(); // get current time in milliseconds
      if (currentTime > tokenExpiry) {
        throw {
          code: 401,
          message: "Token expired",
          status: "TOKEN_EXPIRED",
        };
      }
      return userDetail;
    } catch (error) {
      throw error;
    }
  }
  async sendPasswordSuccessEmail(userDetail) {
    try {
      return await emailService.sendEmail({
        to: userDetail.email,
        sub: "Password Reset Successfully - Sasto Bazzar",
        msg: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="background-color: rgb(68, 53, 207); padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0;">Password Successfully Reset!</h1>
                        </div>
                        <div style="padding: 50px; text-align: center;">
                            <p style="font-size: 18px;">Hello ${
                              userDetail.firstName
                            },</p>
                            <p style="font-size: 16px;">Your password for Sasto Bazzar has been successfully reset.</p>
                            <p style="font-size: 16px;">You can now log in with your new password.</p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${appConfig.frontendUrl}/login" 
                                   style="background-color: rgb(50, 30, 165); color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                                   Login to My Account
                                </a>    
                            </div>
                            <p style="font-size: 16px;">If you did not make this change, please contact our support team immediately.</p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="font-size: 14px; color: #555;">Need help? Feel free to <a href="${
                              appConfig.frontendUrl
                            }/contact" style="color: #4CAF50;">contact us</a>.</p>
                            <p style="font-size: 14px; color: #555;">Thank you for using <b>Sasto Bazzar</b>!</p>
                        </div>
                        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777; font-size: 12px;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Sasto Bazzar. All rights reserved.</p>
                        </div>
                    </div>
                `,
      });
    } catch (error) {
      throw error;
    }
  }
}
const authService = new AuthService();
module.exports = authService;
