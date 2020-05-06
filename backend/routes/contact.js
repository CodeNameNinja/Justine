const express = require('express');
const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")
const router = express.Router();


let transporter = nodemailer.createTransport(  
    sendgridTransport({
      auth: {
        api_key:
          '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'
      }
    })
  );

  const Email = require('email-templates');
  const path  = require('path')

  router.post('/email', (req,res) => {
    const email = new Email({
        message: {
          from: 'info@4loop.online'
        },
        send: true,
        transport:transporter
      });
      
      email
        .send({
          template: path.join(__dirname, "../templates", "contact"),
          message: {
            to: 'info@4loop.online'
          },
          locals: {
            name: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            message:req.body.message,
            email:req.body.email
          }
        })
        .then(() => {
            res.status(200).json({
                message: "Email Has Been Sent Succesfully."
            })
        })
        .catch(console.error);
  })


module.exports = router