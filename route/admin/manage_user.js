// init express.js
const express       = require('express')
const dotenv        = require('dotenv')

dotenv.config()

// init db
const { initializeApp } = require('firebase/app')
const { getDatabase, ref, get} = require('firebase/database')

const firebase_config = require('../../firebaseConfig/config')

initializeApp(firebase_config)
const db = getDatabase()

// include functions
const { adminAuth }   = require('../../middleware/jwt_oauth')

// MAIN
var manageUser = express.Router()

manageUser.get('/api/admin/userlist/:type', adminAuth, function(req, res){

    // get variables
    const type = req.params.type

    get(ref(db, 'user/' + type)).then((snap) => {

        if (snap.exists()){
            res.status(200).send({
                "code"   : 200,
                "status" : "OK",
                "data"   : {
                    "message" : snap
                }
            })
        
            return
        }
        else {
            res.status(404).send({
                "code"   : 404,
                "status" : "Not Found",
                "data"   : {
                    "message" : [
                        "parameters must be teacher or student"
                    ]
                }
            })
            
            return
        }
    })
})

module.exports = manageUser
