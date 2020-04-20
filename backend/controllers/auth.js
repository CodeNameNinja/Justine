const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")

const User = require("../models/user");

let transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",  
  secure: true,
  secureConnection: false, // TLS requires secureConnection to be false
  tls: {
      ciphers:'SSLv3'
  },
  requireTLS:true,
  port: 465,
  debug: true,
  auth: {
      user: "info@4loop.online",
      pass: "Mitch00788" 
  },
  tls:{
    rejectUnauthorized: false
}

});

exports.postSignUp = (req,res,next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
          name:req.body.name,
          email: req.body.email,
          password: hash,
          cart:{
              items:[]
          }
        });
        user
          .save()
          .then(result => {
            transporter.sendMail({
              from: `"The Curators" <info@4loop.online>`, // sender address
              to: req.body.email, // list of receivers
              replyTo: 'info@4loop.online',
              subject: "Succesfully Registered", // Subject line
              text: `Hello New message`, // plain text body
              htmL:`        
              <h3>Contact Details</h3>
              <ul>
                  <li>Name: ${req.body.name}</li>
                  <li>Email: ${req.body.email}</li>
              </ul>
              <h3>Message </h3>
              <p>You have succesfully registered for online shopping.</p>
              `
            },(err, info) => {
              if (err) {
                return console.log(err);
              }
              else {
                res.status(200).json({
                  message:"User succesfully created."
                })
                console.log(`Message sent %s, `, info)
                console.log('Message URL: %s,', nodemailer.getTestMessageUrl(info))
              }
            })
          })
          .catch(err => {
            res.status(500).json({
              message: "Invalid authentication credentials"
            });
          });
      });
}

exports.postLogin = (req,res,next) => {
    console.log(req.body);
    let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "User does not exist."
        });
      }
      
      fetchedUser = user;
      req.user = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Username Or Password is incorrect."
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Username Or Password is incorrect."
      });
    });
}