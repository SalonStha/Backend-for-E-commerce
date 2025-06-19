const router = require('express').Router(); // Import the Router from Express

const authRouter = require('../modules/auth/auth.router'); // Import the auth router

const userRouter = require('../modules/user/user.router'); // Import the user router

const productRouter = require('../modules/product/product.router'); // Import the products router

const brandsRouter = require('../modules/brands/brands.router'); // Import the brands router

const categoryRouter = require('../modules/category/category.router'); // Import the category router

const orderRouter = require('../modules/order/order.router');

const bannerRouter = require('../modules/banner/banner.router'); // Import the banner router

const chatRouter = require('../modules/chat/chat.router'); // Import the chat router

router.get('/', (req, res, _next) => { // Define a route for the root URL
    res.json({
        message: 'This is Base URL for the application', // Send a JSON response with a message
        data: "Base URL is working",
        status: 'success',
        options: null
    }); // Send a JSON response
});

router.use('/auth', authRouter); // Use the auth router for handling requests to the /auth path

router.use('/user', userRouter); // Use the user router for handling requests to the /user path

router.use('/product', productRouter); // Use the products router for handling requests to the /products path

router.use('/brands', brandsRouter); // Use the brands router for handling requests to the /brands path

router.use('/category', categoryRouter); // Use the category router for handling requests to the /category path

router.use('/order', orderRouter); // Use the order router for handling requests to the /order path 

router.use('/banner', bannerRouter); // Use the banner router for handling requests to the /banner path

router.use('/chat', chatRouter); // Use the chat router for handling requests to the /chat path

module.exports = router; // Export the router for use in other modules