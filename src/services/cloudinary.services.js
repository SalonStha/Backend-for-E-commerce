const { appConfig } = require('../config/config');
const { deleteFile } = require('../utils/helper');
const cloudinary = require('cloudinary').v2;
class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: appConfig.cloudinaryCloudName,
            cloud_api_key: appConfig.cloudinaryApiKey,
            cloud_api_secret: appConfig.cloudinaryApiSecret,
            secure: true
        })
    }
    fileUpload = async (filePath, dir = "/") => { // Upload a file to Cloudinary
        try {
            const { public_id, secure_url, url } = await cloudinary.uploader.upload(filePath, {
                unique_filename: true,
                folder: "/api-42" + dir,
                resource_type: "auto"
            }); // Upload the file to Cloudinary with unique filename and specified folder

            deleteFile(filePath); // Delete the file after upload

            const optimizedUrl = cloudinary.url(public_id, { // Generate an optimized URL
                transformation: [
                    { quality: "auto" },
                    { fetch_format: "auto" },
                    { width: 500, height: 500, crop: "fill" }
                ]
            });
            return { // Return the file details
                publicId :public_id,
                secureUrl :secure_url,
                optimizedUrl: optimizedUrl,
            };
        } catch (err) {
            // console.log(err);
            throw {   // Handle errors during upload
                code: 500,
                message: "Internal Server Error",
                status: "Server Error",
                detail: err.message,
            }
        }
    }
}

const cloudinaryService = new CloudinaryService();
module.exports = cloudinaryService; // Export the CloudinaryService instance for use in other modules