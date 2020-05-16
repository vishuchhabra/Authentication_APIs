const mongoose  = require('mongoose')

const dataS  =new mongoose.Schema(
{
   name:
   {
      type:String,
      min : 6,
      max : 255,
      required: true
      
   },
   email:
   {
      type: String,
      requried: true,
      min : 6,
      max : 255
   },
   status:
   {
      type:String,
      default : "Unverified"
   },
   password:
   {
      type:String,
      required: true,
      max: 1024,
      min : 6
   },
   date:
   {
      type:Date,
      default :  Date.now
   }

})
module.exports = mongoose.model('Users',dataS) 