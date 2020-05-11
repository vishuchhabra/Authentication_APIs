const http = require('http')
const port = 4000
const app  = require('./app')


//creating the server

const server = http.createServer(app)

server.listen(port,()=>
{
    console.log("server is listening on port 4000")
})