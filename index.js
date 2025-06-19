const http = require('http'); // Import the http module to create an HTTP server
const app = require('./src/config/express.config'); // Import the Express application


const server = http.createServer(app); // Create an HTTP server using the Express application
const PORT = 9005; // Define the port number
const HOST = 'localhost'; // Define the hostname

server.listen(PORT, HOST, (err) => {

    if (err) {
        console.error('Error starting server:', err); // Log error if server fails to start
        return;
    }
    console.log(`Server is running at http://${HOST}:${PORT}`); // Log success message with server UR
}) // Start the server and listen on the specified port and hostname