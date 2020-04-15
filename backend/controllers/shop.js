const Product = require('../models/product');
const Order = require('../models/order');

exports.getCart = (req, res, next) => {
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const products = user.cart.items;
        res.status(201).json([
          ...products
        ]);
      })
      .catch(err => console.log(err));
  };
  
  exports.postCart = (req, res, next) => {
    const prodId = req.body.id;
    console.log(prodId);
    Product.findById(prodId)
      .then(product => {
        req.user.addToCart(product);
        res.status(201).json({
          message:"succesfully added to cart."
        })
      })
  };
  
  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.id;
    req.user
      .removeFromCart(prodId)
      .then(result => {
        res.status(201).json({
          message:"succesfully deleted",
          result:result
        })
      })
      .catch(err => console.log(err));
  };
  