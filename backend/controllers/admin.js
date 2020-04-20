const Product = require('../models/product');
var ObjectID = require('mongodb').ObjectID;
exports.getProducts = (req, res) => {
  Product.find().then(products => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      products: products
    });
  })
  .catch(error => {
    res.status(500).json({
      message:"Fetching Products Failed."
    })
  })
}
exports.postAddProduct = (req, res, next) => {
    console.log(req.body)
    console.log(req.files);
    
   
    const url = req.protocol + '://' + req.get('host');
    const title = req.body.title;
    const description = req.body.description;
    const amount = +req.body.amount;
    const category = req.body.category;
    const imageUrls = [];
    req.files.map(file => {
       imageUrls.push(url + '/images/' + file.filename);
    })
    const product = new Product({
      title: title,
      description: description,
      amount: amount,
      category: category,
      imageUrls: imageUrls,
      userId: req.user
    });
    product
      .save()
      .then(createdProduct => {
        res.status(201).json({
          message:"Product succefully added",
          product: {
            title:createdProduct._doc.title,
            description:createdProduct._doc.description,
            amount:createdProduct._doc.amount,
            category:createdProduct._doc.category,
            imageUrls:createdProduct._doc.imageUrls,
            id:createdProduct._id
          }
        })
      })
      .catch(error => {
        res.status(500).json({
          message:"Adding Product Failed."
        })
      })
  };

  exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.id;
    const body = req.body;
    console.log(body);
    Product.findByIdAndDelete(prodId)
    .then(() => {
        console.log("Products Removed")

        res.send({message: "Product removed"})
       
    })
    .catch(error => {
      res.status(500).json({
        message:"Deleting Product failed."
      })
    })
  }

  exports.updateProduct = (req, res) => {
    console.log("req.body",req.body);
    console.log("req.file",req.files);
    const url = req.protocol + "://" + req.get("host");
    const title = req.body.title;
    const description = req.body.description;
    const amount = +req.body.amount;
    const category = req.body.category;
    const imageUrls = []
    if(req.body.imageUrls){
      for(const imageUrl of req.body.imageUrls){
        imageUrls.push(imageUrl)
      }     
    }
  
    if(req.files){
      req.files.map(file => {
         imageUrls.push(url + '/images/' + file.filename);
      })
    }
    const product = new Product({  
      _id: req.params.id,    
      title: title,
      description: description,
      amount: amount,
      category: category,
      imageUrls: imageUrls,
      userId: req.user
    });
    // console.log(product);
    
    Product.updateOne({'_id':ObjectID(req.params.id)} , product).then(product => {
      res.status(200).json({ message: "Update successful!", product:product });
    })
    .catch(error => {
      res.status(500).json({
        message:"failed to update product."
      })
    });
  }