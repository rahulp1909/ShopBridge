const express = require('express');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const ProductController = require('../controllers/product');

const router = express.Router();

router.post('', checkAuth, extractFile, ProductController.createProduct);

router.put('/:id', checkAuth, extractFile, ProductController.updateProduct);

router.get('', checkAuth, ProductController.getProducts);

router.get('/:id', checkAuth, ProductController.getProduct);

router.delete('/:id', checkAuth, ProductController.deleteProduct);

module.exports = router;
