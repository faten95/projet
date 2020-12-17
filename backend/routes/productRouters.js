const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
  getMyProducts,
} = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')
router.route('/').get(getProducts).post(protect, createProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProducts)
router.route('/myproducts').get(protect, getMyProducts)

// router.route('/:id').get(getProductById)
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, deleteProduct)
  .put(protect, updateProduct)
module.exports = router
