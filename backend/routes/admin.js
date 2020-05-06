const path = require('path');
var aws = require('aws-sdk')
const express = require('express');

const adminController = require('../controllers/admin');
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const multer = require('multer')
var multerS3 = require('multer-s3')

var s3 = new aws.S3({ 
    accessKeyId: 'AKIAW5ZQRSMK3MTQMJED',
    secretAccessKey: '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'
 })

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg' : 'jpeg'
};
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const isValid = MIME_TYPE_MAP[file.mimetype];
//         let error = new Error('Invalid mime type');
//         if(isValid){
//             error = null
//         }
//         cb(error, "./images")
//     },
//     filename: (req, file, cb) => {
//         const name = file.originalname.toLowerCase().split(' ').join('-');
//         const ext = MIME_TYPE_MAP[file.mimetype];
//         cb(null, name + '-' + Date.now()+ '.' + ext);
//     }
// });

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'thecuratorsbucket',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        const name ="images/" + file.originalname.toLowerCase().split(' ').join('-');
                const ext = MIME_TYPE_MAP[file.mimetype];
                cb(null, name + '-' + Date.now()+ '.' + ext);
        // cb(null, Date.now().toString())
      }
    })
  })
   

// let upload = multer({storage});

// /admin/add-product => POST
router.get('/add-product', adminController.getProducts);
router.post('/add-product',checkAuth,upload.array("images[]", 12), adminController.postAddProduct);

// router.get('/edit-product/:productId', adminController.getEditProduct);

router.put('/update-product/:id',checkAuth,upload.array("images[]", 12), adminController.updateProduct);

router.post('/delete-product',checkAuth,adminController.postDeleteProduct);

router.get('/orders',adminController.getAllOrders);

router.get('/order/:id',adminController.getOrder);

module.exports = router;
