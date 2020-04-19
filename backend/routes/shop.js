const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
// router.get('/', shopController.getIndex);

// router.get('/products', shopController.getProducts);

// router.get('/products/:productId', shopController.getProduct);

router.get('/cart',checkAuth, shopController.getCart);

router.post('/cart',checkAuth, shopController.postCart);

router.post('/cart-delete-item',checkAuth, shopController.postCartDeleteProduct);

// router.post('/create-order', shopController.postOrder);

// router.get('/orders', shopController.getOrders);

module.exports = router;