const userService = require("../user/user.service");
const authService = require("./auth.service"); // Import the authService module
const { Status } = require("../../config/constants"); // Import the Status constant
const bcrypt = require("bcryptjs"); // Import the bcrypt library for password hashing
const { appConfig } = require("../../config/config"); // Import the app configuration
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library for token generation
const { randomStringGenerator } = require("../../utils/helper");

class AuthController {
  activateUser = async (req, res, _next) => {
    // Define a route for the activate token
    let token = req.params.token; // Get the token from the query parameter
    const userDetail = await userService.getSingleUserByFilter({
      activationToken: token,
    }); // Fetch user details using the token
    if (!userDetail) {
      // Check if user details are found
      return res.status(404).json({
        message: "This user is already activated, Thank you!", // Send a message indicating the user is already activated
        data: null,
        status: "Not Found",
        options: null,
      });
    }
    const updatedUser = await userService.updateSingleUserByFilter(
      {
        _id: userDetail._id,
      },
      {
        status: Status.ACTIVE, // Update the user status to active
        activationToken: null, // Clear the activation token
      }
    );
    req.myEventEmitter.emit("send-welcome-email", updatedUser);
    // await authService.welcomeEmail(updatedUser); // Send an activation email to the user
    res.json({
      message: "User activated successfully, You can now Login!", // Send a message indicating success
      data: null, // Include the user profile in the response
      status: "success",
      options: null,
    });
  };
  loginUser = async (req, res, _next) => {
    // Define a route for the login URL
    const data = req.body; // Get the request body
    try {
      const { email, password } = req.body; // Destructure the email and password from the request body
      const user = await userService.getSingleUserByFilter({
        email: email, // Fetch user details using the email
      }); // Fetch user details using the email and status
      if (!user) {
        // Check if user details are found
        return res.status(404).json({
          message: "User not found or inactive", // Send a message indicating the user is not found or inactive
          data: null,
          status: "Not Found",
          options: null,
        });
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password); // Compare the password with the hashed password
      if (!isPasswordValid) {
        // Check if the password is valid
        return res.status(401).json({
          message: "Invalid credentials", // Send a message indicating invalid credentials
          data: null,
          status: "Unauthorized access",
          options: null,
        });
      }
      if (user.status !== Status.ACTIVE || user.activationToken !== null) {
        // Check if the user is active
        return res.status(401).json({
          message: "User is not authenticated", // Send a message indicating the user is not authenticated
          status: "Unauthorized access",
        });
      }

      const accessToken = jwt.sign(
        {
          sub: user._id,
          typ: "Bearer",
        },
        appConfig.jwtSecret,
        {
          expiresIn: "1h", // Set the token expiration time to 1 hour
        }
      ); // Generate an access token using the user ID and secret key
      const refreshToken = jwt.sign(
        {
          sub: user._id,
          typ: "Refresh",
        },
        appConfig.jwtSecret,
        {
          expiresIn: "1d", // Set the token expiration time to 1 day
        }
      );

      const maskedAccessToken = randomStringGenerator(150); // Generate a masked access token
      const maskedRefreshToken = randomStringGenerator(150); // Generate a masked refresh token

      const authData = {
        userId: user._id, // Set the user ID
        accessToken: accessToken, // Set the access token
        refreshToken: refreshToken, // Set the refresh token
        maskedAccessToken: maskedAccessToken, // Set the masked access token
        maskedRefreshToken: maskedRefreshToken, // Set the masked refresh token
      };
      await authService.createAuth(authData); // Create an authentication record in the database
      res.json({
        message: "Welcome to " + user.role + " Panel", // Send a welcome message
        data: {
          accessToken: maskedAccessToken,
          refreshToken: maskedRefreshToken,
        },
        status: "Logged In successfully",
        options: null,
      });
    } catch (error) {
      console.log("Error in loginUser:", error); // Log any errors that occur during the login process
      _next(error); // Pass any errors to the next middleware
    }
  };
  registerUser = async (req, res, _next) => {
    // Define a route for the signup URL
    try {
      const data = await authService.transformUserCreate(req); // Transform the user data using the authService
      let user = await userService.UserCreate(data); // Create a new user in the database
      req.myEventEmitter.emit('send-activation-email', user); // Send an activation email to the user
      res.json({
        message:
          "You have successfully signed up. Check your email for activation link",
        data: userService.getUserProfile(user),
        status: "success",
        options: null,
      });
    } catch (error) {
      _next(error); // Pass any errors to the next middleware
    }
  };
  getUserProfile = async (req, res, _next) => {
    // Define a route for the user profile URL
    res.json({
      data: req.loggedInUser,
      message: "Logged in user data fetched",
      status: "SUCCESS",
    });
  };
  refreshToken = async (req, res, _next) => {
    // Define a route for the refresh token URL
    try {
      let token = req.headers["authorization"].replace("Refresh ", ""); // Get the token from the request headers
      if (!token) {
        throw {
          code: 401,
          message: "Token not found", // Send a message indicating unauthorized access
          status: "TOKEN_REQUIRED",
        };
      }
      const authToken = await authService.getSingleAuthByFilter({
        maskedRefreshToken: token,
      });
      if (!authToken) {
        throw {
          code: 401,
          message: "Invalid token", // Send a message indicating invalid token
          status: "INVALID_TOKEN",
        };
      }
      const data = jwt.verify(authToken.refreshToken, appConfig.jwtSecret); // Verify the refresh token using the secret key
      const user = await userService.getSingleUserByFilter({
        _id: data.sub,
      });
      if (!user) {
        throw {
          code: 422,
          message: "User not found", // Send a message indicating user not found
          status: "USER_NOT_FOUND",
        };
      }

      const accessToken = jwt.sign(
        {
          sub: user._id,
          typ: "Bearer",
        },
        appConfig.jwtSecret,
        {
          expiresIn: "1h", // Set the token expiration time to 1 hour
        }
      ); // Generate an access token using the user ID and secret key
      const refreshToken = jwt.sign(
        {
          sub: user._id,
          typ: "Refresh",
        },
        appConfig.jwtSecret,
        {
          expiresIn: "1d", // Set the token expiration time to 1 day
        }
      );

      const maskedAccessToken = randomStringGenerator(150); // Generate a masked access token
      const maskedRefreshToken = randomStringGenerator(150); // Generate a masked refresh token

      const authData = {
        accessToken: accessToken, // Set the access token
        refreshToken: refreshToken, // Set the refresh token
        maskedAccessToken: maskedAccessToken, // Set the masked access token
        maskedRefreshToken: maskedRefreshToken, // Set the masked refresh token
      };
      await authService.updateSingleRowByFilter(
        {
          _id: authToken._id,
        },
        authData
      );
      res.json({
        message: "Token refreshed successfully", // Send a message indicating success
        data: {
          accessToken: authData.maskedAccessToken,
          refreshToken: authData.maskedRefreshToken,
        },
        status: "success",
        options: null,
      });
    } catch (error) {
      _next(error);
    }
  };

  forgetPassword = async (req, res, _next) => {
    try {
      const { email } = req.body;
      const userDetail = await userService.getSingleUserByFilter({
        email: email,
      });
      if (!userDetail) {
        throw {
          code: 404,
          message: "User not registered yet.",
          status: "USER_NOT_FOUND",
        };
      }
      const forgetPasswordData = {
        forgetPasswordToken: randomStringGenerator(100),
        activateTokenExpire: new Date(Date.now() + 3 * 60 * 60 * 1000),
      };
      const updatedUser = await userService.updateSingleUserByFilter(
        {
          _id: userDetail._id,
        },
        forgetPasswordData
      );
      req.myEventEmitter.emit("send-password-reset-email", updatedUser);
      // await authService.sendPasswordResetEmail(updatedUser); //
      res.json({
        message:
          "An email has been sent to the registered email address. Feel free to go through the steps to reset your password.",
        data: null,
        status: "Password Link send",
        options: null,
      });
    } catch (error) {
      _next(error);
    }
  };
  forgetPasswordVerifyToken = async (req, res, _next) => {
    try {
      let token = req.params.token;
      const userDetail = await authService.verfiyPasswordResetToken(token);
      token = randomStringGenerator(150);
      await userService.updateSingleUserByFilter(
        {
          _id: userDetail._id,
        },
        {
          forgetPasswordToken: token,
        }
      ),
        res.json({
          data: {
            token: token,
          },
          message: "Token verified successfully",
          status: "success",
          options: null,
        });
    } catch (error) {
      _next(error);
    }
  };
  resetPassword = async (req, res, _next) => {
    try {
      let token = req.headers.authorization;
      token = token.replace("Bearer ", "");

      const userDetail = await authService.verfiyPasswordResetToken(token);
      const password = bcrypt.hashSync(req.body.password, 12);
      const updateUser = await userService.updateSingleUserByFilter(
        {
          _id: userDetail._id,
        },
        {
          password: password,
          forgetPasswordToken: null,
          activateTokenExpire: null,
        }
      );
      await authService.logoutUserFromAll({
        user: userDetail._id,
      });
      req.myEventEmitter.emit("send-password-success-email", userDetail);
      // await authService.sendPasswordSuccessEmail(userDetail);
      res.json({
        message: "Password reset successfully",
        status: "SUCCESS",
        options: null,
      });
    } catch (error) {
      _next(error);
    }
  };
  logout = async (req, res, _next) => {
    // Define a route for the logout URL
    try {
      await authService.logoutUser(req.headers["authorization"]);
      res.json({
        data: null,
        message: "You have been logged out!",
        status: "LOGGED_OUT",
      });
    } catch (error) {
      _next(error);
    }
  };
  updateUserById = async (req, res, _next) => {
    try {      
      const id = req.params.id;
      const UserDetail = await userService.getSingleUserByFilter({
        _id: id
      });
      if (!UserDetail) {
        throw {
          code: 404,
          message: "User not found",
          status: "USER_NOT_FOUND",
        };
      }

      const payload = await authService.transformUserUpdate(req , UserDetail);
      console.log("payload", payload);
      const updatedUser = await userService.updateSingleUserByFilter(
        {
          _id: UserDetail._id,
        },
        payload
      );


      res.json({
        message: "User updated successfully",
        data: userService.getUserProfile(updatedUser),
        status: "SUCCESS",
        options: null,
      });
      console.log(updatedUser);
    } catch (error) {
      console.log(error);
      _next(error);
    }
  };
}

const authController = new AuthController();

module.exports = authController; // Export the AuthController class for use in other modules
