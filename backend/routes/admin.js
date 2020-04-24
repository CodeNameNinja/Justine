const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const multer = require('multer')
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg' : 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid){
            error = null
        }
        cb(error, "./images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now()+ '.' + ext);
    }
});

let upload = multer({storage});
// /admin/add-product => GET
// router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
// router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.get('/add-product',checkAuth, adminController.getProducts);
router.post('/add-product',checkAuth,upload.array("images[]", 12), adminController.postAddProduct);

// router.get('/edit-product/:productId', adminController.getEditProduct);

router.put('/update-product/:id',checkAuth,upload.array("images[]", 12), adminController.updateProduct);

router.post('/delete-product',checkAuth,adminController.postDeleteProduct);

router.get('/orders',adminController.getAllOrders);

router.get('/order/:id',adminController.getOrder);

module.exports = router;
