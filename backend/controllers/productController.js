import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  // throw new Error("Some error");
  res.json(products);
});

// @desc    Fetch a product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    // if product not found, throw error
    res.status(404);
    throw new Error("Resource not found");
  }
});

export { getProducts, getProductById };
