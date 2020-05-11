const express = require('express')
const  app = express()
const bodyParser = require('body-parser')
const auth = require('./routes/auth')
const mongoose = require('mongoose')
const dotenv = require('dotenv')//for saving the password

dotenv.config();

//body-parser
app.use(bodyParser.urlencoded({ extended: false }))

//for the json data
app.use(bodyParser.json())


//middlware for the routes
app.use('/user',auth)


//connecting to the data base
mongoose.connect(process.env.db,
     { useUnifiedTopology: true ,useNewUrlParser: true },()=>
{
    console.log("connected to the data base")
})

 

module.exports = app;