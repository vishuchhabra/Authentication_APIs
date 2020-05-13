const Joi  =  require('@hapi/joi')//joi for applying the validations 

//registeration vallidation
const registerValidation =  (data)=>
{
    //schema for just checking the working of the joi module
    const schema =Joi.object( 
    {
        name :  Joi.string().min(6).required(),
        email :  Joi.string().min(6).required().email(),
        password:  Joi.string().min(6).required()
    })
    const {error}= schema.validate(data)
    return error

}

//login validation 
const loginValidation  = (data)=>
{
    //schema for just checking the working of the joi module
    const schema =Joi.object( 
    {
        email :  Joi.string().min(6).required().email(),//string for requrement of string 
        password:  Joi.string().min(6).required()
    })
    const {error}= schema.validate(data)
    return error
}

//exporting the functions
module.exports.loginValidation = loginValidation
module.exports.registerValidation = registerValidation