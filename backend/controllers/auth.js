const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")
const crypto = require('crypto');
const User = require("../models/user");

let transporter = nodemailer.createTransport(  
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);
exports.postSignUp = (req,res,next) => {
  console.log(req.body)
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
          firstName:req.body.firstName,
          lastName:req.body.lastName,
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
              text: `You Have succesfully registered for online shopping at The Curators`, // plain text body
              htmL:`        
              <h3>Contact Details</h3>
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
        userId: fetchedUser._id,
        name: fetchedUser.firstName + " " + fetchedUser.lastName,
        email:fetchedUser.email
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Unknown Error Occured."
      });
    });
}
// RESET PASSWORD FUNCTIONS.


exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email
  console.log(req.body);
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message:"An Unknown Error Occured."
      });
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {         
          return res.status(500).json({
            message: 'No account with that email found.'
          });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        
        transporter.sendMail({
          from: `"The Curators" <info@4loop.online>`, // sender address
          to: email, // list of receivers
          replyTo: 'info@4loop.online',
          subject: "Password Reset Information", // Subject line
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:4200/reset/${token}">link</a> to set a new password.</p>
          `
        },(err, info) => {
          if (err) {
            return console.log(err);
          }
          else {
            res.status(200).json({
              message:"Password Reset Link Sent."
            })
            console.log(`Message sent %s, `, info)
            console.log('Message URL: %s,', nodemailer.getTestMessageUrl(info))
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      res.status(200).json({
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.status(200).json({
        message:"Succesfully Changed Password."
      })
    })
    .catch(err => {
      console.log(err);
    });

};

exports.getUser = (req,res) => {
  User.findById(req.params.userId)
  .then(user => {
    res.status(200).json({
      message: "succesfully retrieved a user",
      user: user
    })
  })
}