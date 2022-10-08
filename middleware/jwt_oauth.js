const { verify }    = require('jsonwebtoken')
const dotenv        = require('dotenv')

dotenv.config()


function checkAuth(req, res, next, name){

    // get jwt token from cookie
    const jwt_token = req.cookies.jwt

    if (!jwt_token){
        res.status(400).send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "cookie not found",
                    "need to log in"
                ]
            }
        })

        return
    }

    
    // jwt token validation
    const verify_token = verify(jwt_token, process.env.JWT_SECRET_KEY)

    if (!verify_token){
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
    else {
        // init current date
        const date       = new Date()
        const now        = date.setDate(date.getDate())  
        const delta_time = (verify_token.time - now)
    
        if (delta_time <= 0){
            // check session time
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
        else {
            // check account type
            const account_type = verify_token.account_type
            if (account_type != name){
    
                res.status(400).send({
                    "code"   : 400,
                    "status" : "bad request",
                    "data"   : {
                        "message" : [
                            "logged in as " + verify_token.username + " and account type " + verify_token.account_type,
                            "log in must as a " + name
                        ]
                    }
                })
            
                return
            } 
            else {
                // if all OK
                next()
            }  
        }
    }
}

function adminAuth(req, res, next){
    return checkAuth(req, res, next, "admin")
}


function teacherAuth(req, res, next){
    return checkAuth(req, res, next, "teacher")
}   

function studentAuth(req, res, next) {
    return checkAuth(req, res, next, "student")
}

module.exports =  { adminAuth , teacherAuth , studentAuth} 
