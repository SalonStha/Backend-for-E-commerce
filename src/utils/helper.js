const randomStringGenerator = (length= 100) => {
let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@';
const charsLength = chars.length;
let random = "";


for (let i = 1; i <= length; i++) {
    const posn = Math.floor(Math.random() * charsLength); //(charsLength - 1);
    random += chars[posn]; //chars[posn]
}
return random;
}

const fs = require('fs'); // Import the file system module

const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

const ucFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


module.exports = {
    randomStringGenerator,
    deleteFile,
    ucFirst
}