const Product = require('../models/product');


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
            ...createdProduct,
            id:createdProduct._id
        })
      })
      .catch(err => {
        console.log(err);
      });
  };