const { UserRole } = require('../../config/constants')
const authValidator = require('../../middlewares/auth.middleware')
const uploader = require('../../middlewares/uploader.middleware')
const { ProductCreateDTO, ProductUpdateDTO } = require('./product.validator')
const productController = require('./product.controller')
const auth = require('../../middlewares/authmodel.middleware')
const { get } = require('mongoose')

const productRouter = require('express').Router()
productRouter.route('/')
    .post(auth([UserRole.ADMIN],[UserRole.SELLER]), uploader().array('images'),authValidator(ProductCreateDTO),productController.createProduct)
    .get(auth([UserRole.ADMIN,UserRole.SELLER]),productController.getAllProducts)
    productRouter.get('/list-all-products',productController.getAllProductsForPublic)

    productRouter.route('/:productId')
        .get(productController.getProductById)
        .put(auth([UserRole.ADMIN]), uploader().array('images'),authValidator(ProductUpdateDTO),productController.updateProduct)
        .delete(auth([UserRole.ADMIN]),productController.deleteProduct)
    productRouter.route('/slug/:slug')
        .get(productController.getProductBySlug)
        

module.exports = productRouter