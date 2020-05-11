const express = require('express')
const router = express.Router()
const mongoose  = require('mongoose')
const user  = require('../models/authS')


//for registering the user
router.post('/register',(req,res)=>
{
    
    
    const data  = new user(
    {
        _id :  new mongoose.Types.ObjectId(),
        name : req.body.age
    })
    data.save().then(result=>
        {
            res.send("data has saved")
        })
        .catch(err=>
            {
                res.send(err)
            })
})


//exporting the router
module.exports = router
