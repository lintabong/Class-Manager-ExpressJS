// init express.js
const express      = require('express')
const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const dotenv       = require('dotenv')

dotenv.config()

// init db
const { initializeApp }         = require('firebase/app')
const { getDatabase, ref , get} = require('firebase/database')
const firebase_config           = require('../firebaseConfig/config')

initializeApp(firebase_config)
const db = getDatabase();

// import functions
const { compare }   = require('bcrypt')
const { sign }      = require('jsonwebtoken')

// MAIN
var Login = express()
Login.use(bodyParser.json())
Login.use(cookieParser())

Login.post('/login', async(req, res) =>{

    // build array of users type
    const type = ['admin', 'student', 'teacher']


    // get payload
    var username = req.body.username
    var password = req.body.password


    // check null username and password
    if (!username || !password){
        res.status(400).send({
            "code"   : 400,
            "status" : "Bad Request",
            "data"   : {
                "message" : [
                    "username and/or password maybe null"
                ]
            }
        })

        return
    }


    // check availability username 
    var user
    var hashed
    var num

    for (let i = 0; i < type.length; i++){
        await get(ref(db, 'user/' + type[i])).then((snap) => {

            var users = snap.val()
            
            for (const address in users){

                if (eval('users.' + address + '.username') == username){
                    user    = eval('users.' + address + '.username')
                    hashed  = eval('users.' + address + '.password')
                    num     = i
                }

            }
        })
    }

    if (!user){
        res.status(404).send({
            "code"   : 404,
            "status" : "Not Found",
            "data"   : {
            "message" : [
                    "username is not exist"
                ]
            }
        })
  
        return
    } 
  

    // password validation
    var login = compare(password, hashed)
    if (!login){
        res.status(404).send({
            "code"   : 404,
            "status" : "Not Found",
            "data"   : {
            "message" : [
                    "Wrong Password"
                ]
            }
        })
  
        return
    }

    
    // generate jwt with expired date after 1 day and cookie after 3 days
    const date = new Date()
  
    let data = {
        'time'         : date.setDate(date.getDate() + 1),
        'username'     : username,
        'account_type' : type[num]
    }
  
    let generate_token = sign(data, process.env.JWT_SECRET_KEY)
  
    res.cookie('jwt', generate_token, { 
        expires   : new Date(Date.now() + 1000*60*60*24 * 3), 
        httpOnly  : true,
        sameSite  : 'lax' 
    })
  

    // login successfull
    res.status(200).send({
        "code"   : 200,
        "status" : "OK",
        "data"   : {
            "message" : {
                "username"      : username,
                "account_type"  : type[num],
                "password"      : hashed,
                "json_web_token": generate_token
            }
        }
    })
})

module.exports = Login
