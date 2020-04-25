const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
// router.get('/', shopController.getIndex);

// router.get('/products', shopController.getProducts);

router.get('/product/:productId', shopController.getProduct);

router.get('/cart',checkAuth, shopController.getCart);

router.post('/cart',checkAuth, shopController.postCart);

router.post('/cart-delete-item',checkAuth, shopController.postCartDeleteProduct);

router.post('/create-order',checkAuth, shopController.postOrder);

router.get('/orders',checkAuth, shopController.getOrders);

module.exports = router;