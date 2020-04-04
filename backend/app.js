const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
// ROUTES
const adminRoutes = require('./routes/admin')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images',express.static(__dirname+'/images'));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
        );
        next();
      });   

app.use((req, res, next) => {
    User.findById('5e8840937826942ebcf9f47f')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

app.use('/admin',adminRoutes)

mongoose
  .connect(
    'mongodb+srv://mitchell:7z7mA8y7OPbg4AUj@cluster0-p0lop.mongodb.net/test?retryWrites=true&w=majority'
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Justine',
          email: 'jmallandain@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    const PORT = process.env.PORT || 3000
    return app.listen(PORT);    
  })
  .then((PORT) => console.log("Server is listening on " , PORT._connectionKey))
  .catch(err => {
    console.log(err);
  });