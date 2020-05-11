const express = require('express')
const router = express.Router()

//for registering the user
router.post('/register',(req,res)=>
{
    res.send("this isa")
})


//exporting the router
module.exports = router
