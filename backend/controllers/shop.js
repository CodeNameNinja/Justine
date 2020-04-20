const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user')
exports.getCart = (req, res, next) => {
  console.log(req.userData)
    User.findOne({email:req.userData.email})
    .then(user => {
      user
      .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
          const products = user.cart.items;
          res.status(201).json([
            ...products
          ]);
        })
        .catch(error => {
          res.status(500).json({
            message:"Failed to fetch cart items."
          })
        })
    })
  };
  
  exports.postCart = (req, res, next) => {
    const prodId = req.body.id;
    console.log(prodId);
    Product.findById(prodId)
      .then(product => {
        User.findOne({email:req.userData.email})
        .then(user => {
         user.addToCart(product); 
         user
         .populate('cart.items.productId')
         .execPopulate()
         .then(popUser => {
          const products = popUser.cart.items;
            res.status(201).json(
              [
                ...products
              ]
                      
          )        
        })
       
        }).catch(error => {
          res.status(500).json({
            message:"Adding to cart failed. Check you internet connection."
          })
        })
        
      })
  };
  
  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.id;
    User.findOne({email:req.userData.email})
    .then(user => {
      user
      .removeFromCart(prodId)
      .then(result => {
        res.status(201).json({
          message:"succesfully deleted",
          result:result
        })
      })
      .catch(error => {
        res.status(500).json({
          message:"Couldn't Delete item from cart."
        })
      })
    })
     
  };
  