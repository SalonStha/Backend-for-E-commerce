const multer = require('multer');
const fs = require('fs');
const { randomStringGenerator } = require('../utils/helper');

const myStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        let filePath = "./public/uploads/";
        if(!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, 
                {
                    recursive: true // Create the directory recursively if it doesn't exist
                }
            )
        }
        cb(null,filePath); // Set the destination for the uploaded file
    },

    filename: (req, file, cb) => {
        let fileName = randomStringGenerator(10) + '-' + file.originalname; // Generate a unique filename using the original name and a random string
        cb(null, fileName); // Set the filename for the uploaded file

    }
}); // Set up storage engine for multer

const uploader = (type = "image") => {
    const uploadConfig = {
        fileSize: 1024 * 1024 * 5, // 5 MB
        fileFilter: function (req, file, cb) {
            let allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp','svg','avif'];
            if (type === "video") {
                this.fileSize = 1024 * 1024 * 50; // 50 MB
                allowedExts = ['mp4', 'avi', 'mov', 'mkv'];
            } else if (type === "audio") {
                this.fileSize = 1024 * 1024 * 10; // 10 MB
                allowedExts = ['mp3', 'wav', 'ogg', 'mp4'];
            } else if (type === "document") {
                this.fileSize = 1024 * 1024 * 10; // 10 MB
                allowedExts = ['pdf', 'docx', 'txt', 'pptx', 'xlsx', 'csv', 'zip', 'rar', 'xml', 'json',];
            }
            const fileExt = file.originalname.split('.').pop().toLowerCase(); // Get the file extension of the uploaded file
            if (allowedExts.includes(fileExt)) {
                cb(null, true); // If the file extension is allowed, call the callback with null (no error) and true (accept the file)
            } else {
                cb({
                    code: 422,
                    message: "Invalid file type",
                    detail: `File type ${fileExt} is not allowed. Allowed types are: ${allowedExts.join(', ')}`,
                    status: "Unprocessable Entity",
                }); // If the file extension is not allowed, call the callback with an error message and false (reject the file)
            }
        }
    };
    return multer({
        storage: myStorage, // Set storage engine
        fileFilter: uploadConfig.fileFilter,
        limits: {
            fileSize: uploadConfig.fileSize
        }
    })
};

module.exports = uploader // Export the uploader function for use in other modules

