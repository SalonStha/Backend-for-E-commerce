const { UserRole } = require('../../config/constants')
const authValidator = require('../../middlewares/auth.middleware')
const uploader = require('../../middlewares/uploader.middleware')
const { BrandCreateDTO, BrandUpdateDTO } = require('./brand.validator')
const brandController = require('./brands.controller')
const auth = require('../../middlewares/authmodel.middleware')
const { get } = require('mongoose')

const brandsRouter = require('express').Router()
brandsRouter.route('/')
    .post(auth([UserRole.ADMIN]), uploader().single('logo'),authValidator(BrandCreateDTO),brandController.createBrand)
    .get(brandController.getAllBrands)

    brandsRouter.route('/:brandId')
        .get(brandController.getBrandById)
        .put(auth([UserRole.ADMIN]), uploader().single('logo'),authValidator(BrandUpdateDTO),brandController.updateBrand)
        .delete(auth(),brandController.deleteBrand)
    brandsRouter.route('/slug/:slug')
        .get(brandController.getBrandBySlug)

module.exports = brandsRouter