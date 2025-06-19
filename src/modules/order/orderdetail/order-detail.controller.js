const orderDetailService = require("./order-detail.service");

const productService = require("../../product/product.service"); // Import product service to fetch product details
const { configDotenv } = require("dotenv");

class OrderDetailController {
  addToCart = async (req, res, next) => {
    try {
      const { productId, quantity } = req.body; // Extract productId and quantity from the request body
      const loggedInUser = req.loggedInUser; // Get the logged-in user from the request object
      if (!productId || !quantity) {
        return res.status(400).json({
          message: "Product ID and quantity are required",
          status: "error",
        });
      }

      const productDetail = await productService.getSingleDataById({
        _id: productId,
      }); // Fetch product details from the database
      if (!productDetail) {
        return res.status(422).json({
          message: "Product not found",
          status: "FAILED",
        });
      }
      if (productDetail.stock < quantity) {
        return res.status(422).json({
          message: "Insufficient stock",
          status: "OUT_OF_STOCK",
        });
      }
      const cartFilter = {
        order: { $eq: null }, // Assuming 'order' is a field that indicates if the product is in an order}
        buyer: loggedInUser._id,
        product: productId,
      };
      const existingCartItem = await orderDetailService.getSingleOrderDetail(
        cartFilter
      ); // Check if the product is already in the cart

      let currentCart = null;

      if (existingCartItem) {
        // If the product is already in the cart, update the quantity
        existingCartItem.quantity = +quantity + +existingCartItem.quantity; // Ensure quantity is a number
        if (existingCartItem.quantity > productDetail.stock) {
          return res.status(422).json({
            message: "Insufficient stock for the requested quantity",
            status: "OUT_OF_STOCK",
          });
        }
        existingCartItem.price = productDetail.afterDiscount; // Update the price to the current product price
        existingCartItem.subTotal =
          existingCartItem.price * existingCartItem.quantity;
        existingCartItem.totalPrice =
          existingCartItem.subTotal + existingCartItem.deliveryFee;
        currentCart = await existingCartItem.save(); // Update the cart item
      } else {
        const cartItem = orderDetailService.transformToCartItem({
          productDetail,
          quantity,
          loggedInUser,
        });
        currentCart = await orderDetailService.addToCart(cartItem); // Add the product to the cart
      }
      return res.status(200).json({
        message: "Item added in the cart",
        data: currentCart,
        status: "success",
      });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  };

  getCart = async (req, res, next) => {
    try {
      const loggedInUser = req.loggedInUser; // Get the logged-in user from the request object
      const cartFilter = {
        order: { $eq: null }, // Assuming 'order' is a field that indicates if the product is in an order
        buyer: loggedInUser._id,
      };
      const { cart, pagination } = await orderDetailService.getOrderDetails(
        cartFilter,
        req.query
      ); // Fetch all items in the cart for the logged-in user
      return res.status(200).json({
        message: "Cart fetched successfully",
        data: cart,
        status: "success",
        options: {
          pagination,
        },
      });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  };

  deleteFromCart = async (req, res, next) => {
    try {
      const { productId, quantity } = req.body; // Extract productId and quantity from the request body
      const loggedInUser = req.loggedInUser; // Get the logged-in user from the request object
      if (!productId || !quantity) {
        return res.status(400).json({
          message: "Product ID and quantity are required",
          status: "error",
        });
      }

      const productDetail = await productService.getSingleDataById({
        _id: productId,
      }); // Fetch product details from the database
      if (!productDetail) {
        return res.status(422).json({
          message: "Product not found",
          status: "FAILED",
        });
      }
      if (productDetail.stock < quantity) {
        return res.status(422).json({
          message: "Insufficient stock",
          status: "OUT_OF_STOCK",
        });
      }
      const cartFilter = {
        order: { $eq: null }, // Assuming 'order' is a field that indicates if the product is in an order}
        buyer: loggedInUser._id,
        product: productId,
      };
      const existingCartItem = await orderDetailService.getSingleOrderDetail(
        cartFilter
      ); // Check if the product is already in the cart

      let currentCart = null;

      if (!existingCartItem) {
        throw {
          code: 422,
          message: "Cart doesnot exist",
          status: "FAILED",
        };
      }
      if (existingCartItem.quantity < quantity) {
        throw {
          code: 422,
          message: "Quantity exceed than cart quantity",
          status: "FAILED",
        };
      } else if (existingCartItem.quantity === quantity || quantity === 0) {
        currentCart = await orderDetailService.deleteFromCart({
          _id: existingCartItem._id,
        });
      } else {
        existingCartItem.quantity = +existingCartItem.quantity - +quantity; // Ensure quantity is a number
        existingCartItem.price = productDetail.afterDiscount; // Update the price to the current product price
        existingCartItem.subTotal =
          existingCartItem.price * existingCartItem.quantity;
        existingCartItem.totalPrice =
          existingCartItem.subTotal + existingCartItem.deliveryFee;
        currentCart = await existingCartItem.save(); // Update the cart item
      }
      return res.status(200).json({
        message: "Cart has been updated",
        data: currentCart,
        status: "success",
      });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  };
}

const orderDetailController = new OrderDetailController();
module.exports = orderDetailController;
