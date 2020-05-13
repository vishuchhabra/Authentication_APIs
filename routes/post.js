//for testing the private route 

const express = require('express')
const router = express.Router()
const auth = require('./verifyToken')

//making the private route for login users only  
router.get('/check',auth,(req,res)=>
{
   res.send(req.user._id)
})
module.exports = router