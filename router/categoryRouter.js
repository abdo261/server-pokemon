

const  {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createManyCategories
} =require('../controller/categoryController') 

const categoryRouter = require('express').Router()

categoryRouter.get('/', getAllCategories)

categoryRouter.get('/:id', getCategoryById)

categoryRouter.post('/', createCategory)
categoryRouter.post('/many', createManyCategories)

categoryRouter.put('/:id', updateCategory)

categoryRouter.delete('/:id', deleteCategory)

module.exports =  categoryRouter
