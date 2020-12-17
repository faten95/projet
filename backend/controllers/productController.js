const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
//@desc    fetch all products
//@route   GET /api/products
//@access   public
exports.getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}
  const products = await Product.find({ ...keyword })
  res.json(products)
})

// @desc    Get logged in user products
// @route   GET /api/products/myproducts
// @access  Private
exports.getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id })
  res.json(products)
})

//@desc    fetch single products
//@route   GET /api/products/:id
//@access   public
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
})
//@desc    Delete single products
//@route   Delete /api/products/:id
//@access   Private
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/image/sample.jpg',
    category: 'Sample category',
    countInStock: 0,
    numberReviews: 0,
    description: 'Sample description',
    adressProduct: 'Sample Adress',
    contact: 'Sample Contact',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    category,
    countInStock,
    adressProduct,
    contact,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.category = category
    product.countInStock = countInStock
    product.adressProduct = adressProduct
    product.contact = contact

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const review = {
      // user: req.user._id,
      // name: req.user.name,
      rating: Number(rating),
      comment,
    }

    product.reviews.push(review)

    product.numberReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
exports.getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.json(products)
})
