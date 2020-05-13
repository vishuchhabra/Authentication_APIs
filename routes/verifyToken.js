const jwt = require('jsonwebtoken')

//for verify the token
//making the middleware auth to verify login process

module.exports = function(req,res,next)
{
    const token =  req.header('auth')
    if(!token) return  res.status(401).send("User is not logged IN") //401 for unauthorized 

    try {
        const verified = jwt.verify(token,process.env.tokenSecret)
         req.user = verified // here user is the proery in jwt //by using that we can get access of logged user infirmation
        next()
    }
    catch(err)
    {
        res.status(400).send("Invalid Token")
    }
}