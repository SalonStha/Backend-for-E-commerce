const authService = require('../modules/auth/auth.service');
const jwt = require('jsonwebtoken');
const { appConfig } = require('../config/config');
const userService = require('../modules/user/user.service');
const { UserRole } = require('../config/constants');
const auth = (role = null) => {
    return async (req, res, next) => {
        try {
            let token = req.headers['authorization'] || null; // Get the token from the request headers //make sure to use lowercase for request headers i.e. authorization not Authorization
            if (!token) {
                return next({
                    code: 401,
                    message: 'Unauthorized access',
                    detail: 'Token not found',
                    status: 'UNAUTHORIZED_ACCESS',
                });
            }
            token = token.replace('Bearer ', ''); // Remove the 'Bearer ' prefix from the token

            const authData = await authService.getSingleAuthByFilter({
                maskedAccessToken: token,
            });
            if (!authData) {
                return next({
                    code: 401,
                    message: 'Unauthorized access',
                    detail: 'Token not found',
                    status: 'UNAUTHORIZED',
                });
            }

            const data = jwt.verify(authData.accessToken, appConfig.jwtSecret);

            if (!data.typ === 'Bearer') {
                throw {
                    code: 401,
                    message: "Bearer token expected",
                    status: "Token unexpected"
                }
            }
            let userDetail = await userService.getSingleUserByFilter({
                _id: data.sub
            })

            if (!userDetail) {
                throw {
                    code: 403,
                    message: "User not found or already deleted",
                    status: "USER_NOT_FOUND"
                }
            }
            userDetail = userService.getUserProfile(userDetail);
            req.loggedInUser = userDetail;

            if(userDetail.role === UserRole.ADMIN || role ===null || (Array.isArray(role) && role.includes(userDetail.role))) {
                next()
            } else {
                throw{
                    code: 403,
                    message: 'Access denied',
                    status: 'ACCESS_DENIED'
                }
            }
        }
        catch (error) {
            next(error);
        }
    };
}
module.exports = auth;

