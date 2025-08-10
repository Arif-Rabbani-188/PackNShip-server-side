// routes/productRoutes.js
// Defines product endpoints WITHOUT changing original paths.
const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct, listMyProducts } = require('../controllers/productController');

// Original paths preserved
router.get('/products', listProducts);
router.get('/products/:id', getProduct);
router.post('/products', createProduct); // was unprotected originally
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct); // original had a missing leading slash bug, we keep correct path
router.get('/myProducts', listMyProducts);

module.exports = router;
