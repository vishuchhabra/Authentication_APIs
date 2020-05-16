const express = require('express')
const router = express.Router()
const mongoose  = require('mongoose')
const User  = require('../models/authS')
const Joi  =  require('@hapi/joi')//joi for applying the validations 
const {registerValidation,loginValidation} = require('../script/validation')  //another method to access 
const bcrypt  = require('bcryptjs')

//for generating the token we will use jwt library
const jwt = require('jsonwebtoken')

//for sending an email ,we will use
const nodemailer = require('nodemailer')
const handlers =  require('express-handlebars')
const {transporter} = require('./transporter')

//importing the njwt library
const njwt =  require('njwt')

//const {loginValidation} =  require('../script/validation')

//schema for just checking the working of the joi module
const schema =Joi.object( 
{
    name :  Joi.string().min(6).required(),
    email :  Joi.string().min(6).required().email(),
    password:  Joi.string().min(6).required()
})
 
//for registering the user while we are taking the validations in the api

router.post('/registerW',async(req,res)=>
{
   //lets validate the upper mention Schema 
   //const validation  =  schema.validate(req.body)
   //res.send(validation.error.details[0].message )//for getting the error message


    const {error}= schema.validate(req.body)
    if(error){
       return res.status(400).send(error.details[0].message)
    }

     
    const user  =  new User(
    {
             name : req.body.name,
             email: req.body.email,
             password : req.body.password
    }) 
    try 
    {
        const  savedUser = await user.save() 
        res.send("User Saved")   
    }
    catch(err)
    {
        res.status(400).send(err)
    }
})


//api with extenal validations is shown a following as 
router.post('/register',async(req,res)=>
{
   //lets validate the upper mention Schema 
   //const validation  =  schema.validate(req.body)
   //res.send(validation.error.details[0].message )//for getting the error message
    const error = await registerValidation(req.body)
    if(error){
       return res.status(400).send(error.details[0].message)
    }

    //aplly validation that no any other user can register with same email
    const Exist =await  User.findOne({email: req.body.email}) 
    if(Exist)
    return res.status(400).send("Email already Exist")


    //hash the password for safe side   //basciay salt is the string of random characters
    const salt =  await bcrypt.genSalt(5) //bascially decide the salt for hashing to make complex  hashing
    const hashedPassword = await bcrypt.hash(req.body.password,salt)//hash the password //onlybcryt can decrypt the password
    //now hashedPassword consist two parts ,first one is salt   + hashpassword //for security purpose

    //create new user
    const user  =  new User(
    {
             name : req.body.name,
             email: req.body.email,
             password : hashedPassword
    }) 
    try 
    {
        const  savedUser = await user.save()
        //generate the token for email 
        const salt =  await bcrypt.genSalt(5)
        const token = jwt.sign({email: req.body.email},process.env.tokenSecret)  //used to create  the token
        
        //optionlal  data for the email 
        var mailOptions = {
            from: 'vishuchhabraabohariya@gmail.com',
            to: req.body.email,
            subject: 'Account Confirmation',
            text: `please Confirm your account first,before login`,
            html : `<p>Click <a href='http://localhost:4000/user/verify/${token}/'>here</a> to verify account</p>`
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.send(400).json(
                  {
                     type: "failure",
                     err: error
              })
            } 
            else {
              console.log('Email sent: ' + info.response);
              res.send("Registered Successfully ,Please vefiy your accout before login")
            }
          })
    }
    catch(err)
    {
        res.status(400).send(err)
    }
})



//login api is always post for the safety purpose
router.post('/login',async (req,res)=>
{
    const error = await loginValidation(req.body)
    if(error){
       return res.status(400).send(error.details[0].message)
    }

    //check if email not exist
    const userR =await  User.findOne({email: req.body.email}) 
    if(!userR)
    return res.status(400).send("Email not Exist")
    
    //now we have to check that password is correct or not
    const validP = await bcrypt.compare(req.body.password,userR.password)
    if(!validP) return res.status(400).send("Password is incorrect")

    //now we will  check the status of the account
    if(userR.status ==="Unverified")
    return res.status(400).send("please verify your account first")

    //creating the token
    const token = jwt.sign({_id: userR._id},process.env.tokenSecret) //second parameter is taking any secret number
    res.header('auth',token)//.send(token)
    res.send("Token added")
})


//send the emial using node mailer in nodejs 
//depending upon requrement we can make it as a post request , when we have to pass something in it.

router.get('/send',async (req,res)=>
{

var mailOptions = {
  from: 'vishuchhabraabohariya@gmail.com',
  to: 'vishuchhabra1016@gmail.com,vishuintern@gmail.com',
  subject: 'This Email is generated for the Testing Purpose',
  text: `Hii this is vishu chhabra form IT industry and learning about the Nodemailer`,
  html : "<p>Click <a href='https://www.google.com/'>here</a> to go google </p>"
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    res.send(400).json(
        {
           type: "failure",
           err: error
        }
    )
  } else {
    console.log('Email sent: ' + info.response);
    res.send("Gmail Sent Successfully")
  }
});
})


//for verify the account 
router.get('/verify/:token',async(req, res)=>
{
    const verified = await jwt.verify(req.params.token,process.env.tokenSecret) //for verifiy the token
    req.user = verified;
    const state  = await User.findOne({email: req.user.email})
    if(state.status =='Verified')
      return res.status(400).redirect('http://localhost:4000//already.html') 
    User.updateOne({email: req.user.email}, { $set: {status:'Verified'}})
    .then(result=>
    {
       res.status(202).redirect('http://localhost:4000//verify.html')
    })
    .catch(err=>
    {
       res.status(200).send(err)
    })
})


//exporting the router
module.exports = router
