const { UserRole } = require('../../config/constants')
const authValidator = require('../../middlewares/auth.middleware')
const uploader = require('../../middlewares/uploader.middleware')
const { CategoryCreateDTO, CategoryUpdateDTO } = require('./category.validator')
const categoryController = require('./category.controller')
const auth = require('../../middlewares/authmodel.middleware')
const { get } = require('mongoose')

const categoryRouter = require('express').Router()
categoryRouter.route('/')
    .post(auth([UserRole.ADMIN]), uploader().single('icon'),authValidator(CategoryCreateDTO),categoryController.createCategory)
    .get(categoryController.getAllCategories)

    categoryRouter.route('/:categoryId')
        .get(categoryController.getCategoryById)
        .put(auth([UserRole.ADMIN]), uploader().single('icon'),authValidator(CategoryUpdateDTO),categoryController.updateCategory)
        .delete(auth([UserRole.ADMIN]),categoryController.deleteCategory)
    categoryRouter.route('/slug/:slug')
        .get(categoryController.getCategoryBySlug)

module.exports = categoryRouter