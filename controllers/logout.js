// init express.js
const express      = require('express')
const cookieParser = require('cookie-parser')
const dotenv       = require('dotenv')

dotenv.config()

// MAIN
const Logout = express()

Logout.use(cookieParser())

// logout user
Logout.get('/logout', function(req, res){
    
    const clear_cookie = res.clearCookie('jwt')

    if (!clear_cookie){
        res.status(400).send({
            "code"   : 404,
            "status" : "Bad Request",
            "data"   : {
            "message" : [
                    "already logged out"
                ]
            }
        })
  
        return
    } 
    else {
        res.status(200).send({
            "code"   : 200,
            "status" : "OK",
            "data"   : {
            "message" : [
                    "logout success"
                ]
            }
        })
  
        return
    }
})

module.exports = Logout
