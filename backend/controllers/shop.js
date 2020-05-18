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
    const size = req.body.size;
    console.log(prodId);
    Product.findById(prodId)
      .then(product => {
        User.findOne({email:req.userData.email})
        .then(user => {
         user.addToCart(product, size); 
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
  

  exports.postOrder = (req, res, next) => {
  let retrievedUser;
  User.findOne({email:req.userData.email})
  .then(user => {
    retrievedUser = user
    user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        console.log(i)
        return { size: i.size,quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.userData.email,
          userId: req.userData.userId
        },
        orderDetails:{
          create_time:req.body.orderDetails.create_time,
          id: req.body.orderDetails.id,
          payer:req.body.orderDetails.payer,
          purchase_units: req.body.orderDetails.purchase_units
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return user.clearCart();
    })
    .then(() => {
      res.status(200).json({
        success:{
          message: "You have successfully ordered."
        }
      })
    })
    .catch(err => console.log(err));
  })
  
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.userData.userId })
    .then(orders => {
      res.status(200).json({
        message: "Succesfully retrieved orders",
        orders: orders
      })
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
  .then(product => {
    res.status(200).json({
      message: "succesfully retrieved product",
      product: product
    })
  })
}
