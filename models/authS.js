const mongoose  = require('mongoose')

const dataS  = mongoose.Schema(
{
   _id  : mongoose.Schema.Types.ObjectId,
   name : String
})
module.exports = mongoose.model('Users',dataS)