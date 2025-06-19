const express = require('express');
require('./mongodb.config')
const {testConnection} = require('./sql.config');
testConnection();
const router = require('./router.config'); // Import the router configuration
const authService = require('../modules/auth/auth.service');
const { deleteFile } = require('../utils/helper');
const { MulterError } = require('multer');
const EventEmitter = require('events'); //EventEmitter is a class in Node.js that allows you to create and emit events.


const app = express() // Create an Express application

const myEventEmitter = new EventEmitter()

app.use((req, res, next) => {
    req.myEventEmitter = myEventEmitter
    next()
})   // Middleware to add the myEventEmitter to the request object

myEventEmitter.on('send-activation-email', async (user) => { // Listen for the 'send-activation-email' event 
    await authService.sendActivationEmail(user);
})

myEventEmitter.on('send-welcome-email', async (updatedUser) => { // Listen for the 'send-welcome-email' event 
    await authService.welcomeEmail(updatedUser);
})

myEventEmitter.on('send-password-reset-email', async (updatedUser) => { // Listen for the 'send-password-reset-email' event 
    await authService.sendPasswordResetEmail(updatedUser);
})

myEventEmitter.on('send-password-success-email', async (updatedUser) => { // Listen for the 'send-password-success-email' event 
    await authService.sendPasswordSuccessEmail(updatedUser);
})

app.use(router);

app.use(express.json()); // Middleware to parse JSON request bodies

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

app.use('/api/v1', router); // Use the router for handling requests

app.use((req, res, next) => {
    next({
        code: 404,
        message: 'Resource not Found',
        status: 'Not Found',
    }); // Call the next middleware in the stack

}); // Handle 404 errors

app.use((error, req, res, next) => { // Middleware to handle errors
    let code = error.code || 500; // Get the error code or default to 500
    let detail = error.detail || null; // Get the error details or default to null
    let message = error.message || 'Internal Server Error'; // Get the error message or default to 'Internal Server Error'
    let status = error.status || 'Server Error'; // Get the error status or default to 'error'

    if(req.file){
        deleteFile(req.file.path); // Delete the uploaded file if it exists  //Single file upload delete
    }
    else if(req.files && req.files.length > 0){ // Check if multiple files were uploaded
        // Loop through each file in the req.files array and delete it
        req.files.forEach(file => {
            deleteFile(file.path); // Delete each uploaded file if it exists
        });
    }
    if(error.name === "MongoServerError"){
    if(+error.code === 11000){ // Check if the error code is 11000 (duplicate key error)
        message = 'Duplicate Key Error'; // Set the error message to 'Duplicate Key Error'
        detail = {}, // Get the duplicate key value
        code = 409; // Set the HTTP status code to 409 (Conflict)

        Object.keys(error.keyValue).map((key) => {
            detail[key] = `${key} should be unique`; // Loop through the keys of the error object
            console.log(key, error.keyValue[key]); // Log the key and its value
        }); // Close the forEach loop
           console.log('Duplicate Key Error:', detail);
   
    }
}

if(error.name === "MulterError") {
    code = 422
}
console.log(error);
    res.status(code).json({ // Send a JSON response with the error details
        error: detail,
        message: message,
        status: status,
        options: null,  
    });
});

module.exports = app; // Export the Express application for use in other modules
