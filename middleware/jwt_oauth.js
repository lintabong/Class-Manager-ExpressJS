const { verify }    = require('jsonwebtoken')
const dotenv        = require('dotenv')

dotenv.config()


function adminAuth(req, res, next){

    // get jwt token from cookie
    const jwt_token    = req.cookies.jwt

    if (!jwt_token){
        res.status(400).send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "cant get jwt token from cookie",
                    "need to log in"
                ]
            }
        })

        return
    }


    // verify the jwt token
    const verify_token = verify(jwt_token, process.env.JWT_SECRET_KEY)


    // jwt token validation
    if (verify_token){

        // intialize current date
        const date       = new Date()
        const now        = date.setDate(date.getDate())  
        
        const diff_time  = (verify_token.time - now)

        if (diff_time >= 0){

            // check admin
            const account_type = verify_token.account_type
            if (account_type == 'admin'){

                next()

            } else {
                res.status(400).send({
                    "code"   : 400,
                    "status" : "bad request",
                    "data"   : {
                        "message" : [
                            "logged in as " + verify_token.username + " and account type " + verify_token.account_type,
                            "log in must as an admin"
                        ]
                    }
                })
        
                return
            }            
        } 
        else {
            res.status(400).send({
                "code"   : 400,
                "status" : "bad request",
                "data"   : {
                    "message" : [
                        "log in session is out",
                        "need to log in"
                    ]
                }
            })
    
            return
        }
    } 
    else {
        res.status(400).send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "cant verify token",
                    "need to log in"
                ]
            }
        })

        return
    }
}


function teacherAuth(req, res, next){

    // get jwt token from cookie
    const jwt_token    = req.cookies.jwt

    if (!jwt_token){
        res.send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "cant get jwt token from cookie",
                    "need to log in"
                ]
            }
        })
    
        return
    }
    
    
    // verify the jwt token
    const verify_token = verify(jwt_token, process.env.JWT_SECRET_KEY)
    
    
    // jwt token validation
    if (verify_token){
    
        // intialize current date
        const date       = new Date()
        const now        = date.setDate(date.getDate())  
            
        const diff_time  = (verify_token.time - now)
    
        if (diff_time >= 0){
    
            // check teacher
            const account_type = verify_token.account_type
            if (account_type == 'teacher'){
    
                next()
    
            } else {
                res.status(400).send({
                    "code"   : 400,
                    "status" : "bad request",
                    "data"   : {
                        "message" : [
                            "logged in as " + verify_token.username + " and account type " + verify_token.account_type,
                            "log in must as a teacher"
                        ]
                    }
                })
            
                return
            }            
        } 
        else {
            res.status(400).send({
                "code"   : 400,
                "status" : "bad request",
                "data"   : {
                    "message" : [
                        "log in session is out",
                        "need to log in"
                    ]
                }
            })
        
            return
        }
    } 
    else {
        res.status(400).send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "cant verify token",
                    "need to log in"
                ]
            }
        })
    
        return
    }
}

function studentAuth(req, res, next) {

    // get jwt token from cookie
    const jwt_token    = req.cookies.jwt

    if (!jwt_token){
        res.send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "cant get jwt token from cookie",
                    "need to log in"
                ]
            }
        })
    
        return
    }
    
    
    // verify the jwt token
    const verify_token = verify(jwt_token, process.env.JWT_SECRET_KEY)
    
    
    // jwt token validation
    if (verify_token){
    
        // intialize current date
        const date       = new Date()
        const now        = date.setDate(date.getDate())  
            
        const diff_time  = (verify_token.time - now)
    
        if (diff_time >= 0){
    
            // check student
            const account_type = verify_token.account_type
            if (account_type == 'student'){
    
                next()
    
            } else {
                res.status(400).send({
                    "code"   : 400,
                    "status" : "bad request",
                    "data"   : {
                        "message" : [
                            "logged in as " + verify_token.username + " and account type " + verify_token.account_type,
                            "log in must as a student"
                        ]
                    }
                })
            
                return
            }            
        } 
        else {
            res.status(400).send({
                "code"   : 400,
                "status" : "bad request",
                "data"   : {
                    "message" : [
                        "log in session is out",
                        "need to log in"
                    ]
                }
            })
        
            return
        }
    } 
    else {
        res.status(400).send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "cant verify token",
                    "need to log in"
                ]
            }
        })
    
        return
    }
}

module.exports =  { adminAuth , teacherAuth , studentAuth} 
