// init express.js
const express       = require('express')
const dotenv        = require('dotenv')

dotenv.config()

// init db
const { initializeApp }               = require('firebase/app')
const { getDatabase, ref , set, get } = require('firebase/database')
const firebase_config                 = require('../firebaseConfig/config')

initializeApp(firebase_config)
const db = getDatabase()

// include functions
const { hash }      = require("bcrypt")

// MAIN
var Register = express.Router()

function randomStr(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
    
  }

// register root
Register.post('/register', async function(req, res){

    // get data from body
    const email     = req.body.email
    const password  = req.body.password
    const type      = req.body.type
    const username  = req.body.username


    // check payload
    if (!username || !email || !password || !type){
        res.status(400).send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "all field must not null"
                ]
            }
        })

        return 
    } 


    // check duplicate email
    var duplicated_email = false

    await get(ref(db, 'user/' + type.toString() + '/')).then((snap) => {

        for (const address in snap.val()){
      
            if (eval('snap.val().' + address + '.email') == email){

                duplicated_email = true

            }
        }
    })

    if (duplicated_email){
        res.status(400).send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "duplicate email"
                ]
            }
        })

        return 
    }


    // construct value
    value = {
        "username"  : username,
        "password"  : await hash(password, 10),
        "email"     : email,
        "type"      : type
    }


    // set value to database
    const register = set(ref(db, 'unauth_user/' + randomStr(30)), value)
  
    if (!register){
        res.status(500).send({
            "code"   : 500,
            "status" : "Internal Server Error",
            "data"   : {
                "message" : [
                    "not connect to database"
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
                "message" : {
                    "value" : value
                }
            }
        })

        return 
    }
})

module.exports = Register
