// init express.js
const express       = require('express')
const dotenv        = require('dotenv')

dotenv.config()

// init db
const { initializeApp }              = require('firebase/app')
const { getDatabase, ref, set, get } = require('firebase/database')
const firebase_config                = require('../../firebaseConfig/config')

initializeApp(firebase_config)
const db = getDatabase()

// include functions
const { adminAuth } = require('../../middleware/jwt_oauth')

// MAIN
const authorizeUser = express()

// LIST UNAUTHORIZE USERS
authorizeUser.get('/api/admin/unauthuser/', adminAuth, async function(req, res){

    await get(ref(db, 'unauth_user')).then((snap) => {

        if (!snap.exists()){
            res.status(404).send({
                "code"   : 404,
                "status" : "Not Found",
                "data"   : {
                    "message" : [
                        "none unaothorized users"
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
                    "message" : snap.val()
                }
            })
        
            return
        }
    })
})


// AUTH USER
authorizeUser.post('/api/admin/unauthuser/:username', adminAuth, async function(req, res){

    // initial variabels
    const username = req.params.username
    var found_user = false
    var value      = {}


    // scanning database
    await get(ref(db, 'unauth_user')).then((snap) => {

        if (!snap.exists()){
            res.status(404).send({
                "code"   : 404,
                "status" : "Not Found",
                "data"   : {
                    "message" : [
                        "unauth user are empty"
                    ]
                }
            })
        
            return
        }
        else {
            for (const address in snap.val()){
                const db_username = eval('snap.val().' + address + '.username')
                
                if (db_username == username){

                    found_user      = true
                    value.address   = address
                    value.email     = eval('snap.val().' + address + '.email')
                    value.password  = eval('snap.val().' + address + '.password')
                    value.type      = eval('snap.val().' + address + '.type')
                    value.username  = eval('snap.val().' + address + '.username')

                }
            }
        }
    })


    if (!found_user){
        res.status(404).send({
            "code"   : 404,
            "status" : "Not Found",
            "data"   : {
                "message" : [
                    "user not found"
                ]
            }
        })
    
        return
    }
    else {
        const authUser = set(ref(db, 'user/' + value.type + '/' + value.address), {
                "username"  : value.username,
                "email"     : value.email,
                "password"  : value.password        
            })

        const deleteUnauthUser = set(ref(db, 'unauth_user/' + value.address), null)
        
        if (!authUser){
            res.status(500).send({
                "code"   : 500,
                "status" : "Internal Server Error",
                "data"   : {
                    "message" : [
                        "error connection to database"
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
                        "added " + value.username + " to database"
                    ]
                }
            })
    
            return
        }   
    }
})

module.exports = authorizeUser
