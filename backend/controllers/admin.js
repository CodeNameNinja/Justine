const Product = require("../models/product");
const Order = require("../models/order");
var ObjectID = require("mongodb").ObjectID;
exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        products: products,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching Products Failed.",
      });
    });
};
exports.postAddProduct = (req, res, next) => {
  // console.log(req.body.sizes)
  // const url = req.protocol + '://' + req.get('host');
  const url = "https://thecuratorsbucket.s3.amazonaws.com/";
  // console.log("req.files", req.files);
  const title = req.body.title;
  const description = req.body.description;
  const amount = +req.body.amount;
  const discount = +req.body.discount;
  const category = req.body.category;
  const sizes = JSON.parse(req.body.sizes);
  const imageUrls = [];
  req.files.map((file) => {
    imageUrls.push(url + file.key);
  });

  const product = new Product({
    title: title,
    description: description,
    amount: amount,
    discount: discount,
    category: category,
    sizes: sizes,
    imageUrls: imageUrls,
    userId: req.userData.userId,
  });
  product
    .save()
    .then((createdProduct) => {
      console.log(createdProduct);
      res.status(201).json({
        message: "Product succefully added",
        product: {
          title: createdProduct._doc.title,
          description: createdProduct._doc.description,
          amount: createdProduct._doc.amount,
          discount: createdProduct._doc.discount,
          category: createdProduct._doc.category,
          sizes: createdProduct._doc.sizes,
          imageUrls: createdProduct._doc.imageUrls,
          id: createdProduct._id,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Adding Product Failed.",
      });
    });
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.id;
  const body = req.body;
  console.log(body);
  Product.findByIdAndDelete(prodId)
    .then(() => {
      console.log("Products Removed");

      res.send({ message: "Product removed" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting Product failed.",
      });
    });
};

exports.updateProduct = (req, res) => {
  // console.log("req.body",req.body);
  // console.log("req.file",req.files);
  const url = "https://thecuratorsbucket.s3.amazonaws.com/";
  const title = req.body.title;
  const description = req.body.description;
  const amount = +req.body.amount;
  const discount = +req.body.discount;
  const category = req.body.category;
  const sizes = JSON.parse(req.body.sizes);
  const imageUrls = [];
  if (req.body.imageUrls) {
    for (const imageUrl of req.body.imageUrls) {
      imageUrls.push(imageUrl);
    }
  }

  if (req.files) {
    req.files.map((file) => {
      imageUrls.push(url + file.key);
    });
  }
  const product = new Product({
    _id: req.params.id,
    title: title,
    description: description,
    amount: amount,
    discount: discount,
    category: category,
    sizes: sizes,
    imageUrls: imageUrls,
    userId: req.userData.userId,
  });
  // console.log(product);

  Product.updateOne({ _id: ObjectID(req.params.id) }, product)
    .then((product) => {
      res.status(200).json({ message: "Update successful!", product: product });
    })
    .catch((error) => {
      res.status(500).json({
        message: "failed to update product.",
      });
    });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .then((orders) => {
      res.status(200).json({
        message: "Orders fetched successfully!",
        orders: orders,
      });
    })
    .catch((err) => json.status(500).json({ message: "failed to get orders" }));
};

exports.getOrder = (req, res) => {
  Order.findById(req.params.id).then((order) => {
    res.status(200).json({
      message: "Order fetched successfully!",
      order: order,
    });
  });
};
