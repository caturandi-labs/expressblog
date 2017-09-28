var express = require('express');
var router = express.Router();
const nodeMailer = require('nodemailer');


/* GET About page. */
router.get('/about', (req, res, next) =>{
  res.render('about',{title: 'About'});
});

router.get('/contact', (req, res, next) =>{
    res.render('contact',{title: 'Contact'});
});

//route post untuk send email
router.post('/send', (req,res) => {
    
    //definisikan transporter
    const transporter = nodeMailer.createTransport({
        service: 'Gmail',
        //Isi Data Dibawah ini dengan email an password anda
        auth: {
            user: 'catur.andi.pamungkas@gmail.com',
            pass: '*******'
        }
    });

    //denisikan mail options
    const mailOptions = {
        from: 'Catur Andi Pamungkas <catur.andi.pamungkas@gmail.com>',
        to: 'championbatang010@gmail.com',
        subject: 'Website Submission',
        text: 'You Have a submission with the following details : ' 
                + 'Name :' +req.body.nama + 'Email : ' + req.body.email 
                + 'Message : ' + req.body.message,
        html: '<p>You Have a submission with the following details</p' 
                + "<ul>" + 
                    "<li>Name : " + req.body.nama + "</li>" + 
                    "<li>Email : " + req.body.email + "</li>" + 
                    "<li>Message : " + req.body.message + "</li>"
    }

    //send email
    transporter.sendMail(mailOptions,(error, info)=>{
        if(error){
            console.log("ERROR : " + error);
        }else{
            console.log('Message Sent' + info.response);
        }
        res.redirect('/'); //redirect ke home page
    })
});

module.exports = router;
