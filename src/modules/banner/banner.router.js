const { UserRole } = require('../../config/constants')
const authValidator = require('../../middlewares/auth.middleware')
const uploader = require('../../middlewares/uploader.middleware')
const { BannerCreateDTO, BannerUpdateDTO } = require('./banner.validator')
const bannerController = require('./banner.controller')
const auth = require('../../middlewares/authmodel.middleware')

const bannerRouter = require('express').Router()
bannerRouter.route('/')
    .post(auth([UserRole.ADMIN]), uploader().single('image'),authValidator(BannerCreateDTO),bannerController.createBanner)
    .get(bannerController.getAllBanners)

    bannerRouter.route('/:bannerId')
        .get(bannerController.getBannerById)
        .put(auth([UserRole.ADMIN]), uploader().single('image'),authValidator(BannerUpdateDTO),bannerController.updateBanner)
        .delete(auth([UserRole.ADMIN]),bannerController.deleteBanner)

module.exports = bannerRouter