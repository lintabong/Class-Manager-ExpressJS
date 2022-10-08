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
const { randomStr }      = require('./get_random_str')
const { getTeacherName } = require('./get_teacher_name')
const { teacherAuth }    = require('../../middleware/jwt_oauth')


// MAIN
var manageClass = express()


// ADD NEW CLASS
manageClass.post('/api/teacher/addclass', teacherAuth, async function(req, res){

    // get variables
    const title      = req.body.title
    const students   = req.body.students
    const createdAt  = new Date().toString()
    const teacher    = getTeacherName(req.cookies.jwt)


    // check duplicate title
    var duplicate_title = false

    await get(ref(db, 'class')).then((snap) => {

        const class_list = snap.val()

        for (const address in class_list){

            const db_title   = eval('class_list.' + address + '.title') 
            const db_teacher = eval('class_list.' + address + '.teacher') 

            if (db_title == title && db_teacher == teacher){

                duplicate_title = true

            }
        }
    })

    if (duplicate_title){
        res.status(400).send({
            "code"   : 400,
            "status" : "bad request",
            "data"   : {
                "message" : [
                    "same title"
                ]
            }
        })

        return
    }
    

    // add new class
    value = {
        "createdAt" : createdAt,
        "students"  : students,
        "teacher"   : teacher,
        "title"     : title
    }

    var newclass = set(ref(db, 'class/' + randomStr(30)), value)

    if (!newclass){
        res.status(500).send({
            "code"   : 500,
            "status" : "Internal Server Error",
            "data"   : {
                "message" : [
                    "cant add new class",
                    "not connected to database"
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
                "message" : value
            }
        })

        return
    }
})


// LIST CLASSES
manageClass.get('/api/teacher/listclass', teacherAuth, async function(req, res){ 

    // get variables
    const teacher    = getTeacherName(req.cookies.jwt)
    const listClass  = {}


    // scanning database
    await get(ref(db, 'class')).then((snap) => {

        const class_list = snap.val()

        for (const address in class_list){

            if (eval('class_list.' + address + '.teacher') == teacher){

                eval('listClass.' + address + '=' + 'class_list.' + address)

            }
        }
    })

    if (!listClass){
        res.status(404).send({
            "code"   : 404,
            "status" : "Not Found",
            "data"   : {
                "message" : [
                    "teacher doesnt have class"
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
                "message" : listClass
            }
        })
    
        return
    }
})


// UPDATE CLASS
manageClass.post('/api/teacher/updateclass/:title', teacherAuth, async function(req, res){

    // get variables
    const title            = req.params.title
    const students_update  = req.body.students
    const title_update     = req.body.title
    const teacher          = getTeacherName(req.cookies.jwt)
    var found_title        = false


    // check duplicate title
    var duplicate_title    = false
    await get(ref(db, 'class')).then((snap) => {
    
        const class_list = snap.val()
    
        for (const address in class_list){

            const db_title   = eval('class_list.' + address + '.title') 
            const db_teacher = eval('class_list.' + address + '.teacher') 
    
            if (db_title == title_update && db_teacher == teacher){

                duplicate_title = true

            }
        }
    })
    
    if (duplicate_title){
        res.status(400).send({
            "code"   : 400,
            "status" : "Bad Request",
            "data"   : {
                "message" : [
                    "find same title",
                    "title must unique"
                ]
            }
        })
    
        return
    }


    // find and update a class
    await get(ref(db, 'class')).then((snap) => {

        const class_list = snap.val()

        for (const address in class_list){

            const db_teacher = eval('class_list.' + address + '.teacher')
            const db_title   = eval('class_list.' + address + '.title')

            if (db_title == title && db_teacher == teacher){

                found_title = true

                const value = {
                    "createdAt" : eval('class_list.' + address + '.createdAt'),
                    "students"  : students_update,
                    "teacher"   : teacher,
                    "title"     : title_update
                }
            
                var updateclass = set(ref(db, 'class/' + address), value)

                if (!updateclass){
                    res.status(500).send({
                        "code"   : 500,
                        "status" : "Internal Server Error",
                        "data"   : {
                            "message" : [
                                "wait a few second",
                                "reload page"
                            ]
                        }
                    })

                    return
                }
                else{
                    res.status(200).send({
                        "code"   : 200,
                        "status" : "OK",
                        "data"   : {
                            "message" : "class updated",
                            "value" : eval('class_list.' + address)
                        }
                    })

                    return
                }
            }
        }
    })
    
    if (!found_title){
        res.status(404).send({
            "code"   : 404,
            "status" : "Not Found",
            "data"   : {
                "message" : [
                    "title not found",
                    "change title"
                ]
            }
        })

        return
    }
})


// GET A SINGLE CLASS
manageClass.get('/api/teacher/class/:title', teacherAuth, async function(req, res){

    // get variables
    const title     = req.params.title
    const teacher   = getTeacherName(req.cookies.jwt)


    // finding title
    var found_title = false
    await get(ref(db, 'class')).then((snap) => {

        const class_list = snap.val()

        for (const address in class_list){

            const db_teacher = eval('class_list.' + address + '.teacher')
            const db_title   = eval('class_list.' + address + '.title')

            if (db_title == title && db_teacher == teacher){

                found_title = true

                res.status(200).send({
                    "code"   : 200,
                    "status" : "OK",
                    "data"   : {
                        "message" : eval('class_list.' + address)
                    }
                })

                return
            }
        }
    })

    if (!found_title){
        res.status(404).send({
            "code"   : 404,
            "status" : "NOT FOUND",
            "data"   : {
                "message" : [
                    "cant find title"
                ]
            }
        })

        return
    }
})


// DELETE A CLASS
manageClass.post('/api/teacher/deleteclass/:title', teacherAuth, async function(req, res){

    // get variables
    const teacher    = getTeacherName(req.cookies.jwt)
    const title      = req.params.title.toString()
    var found_title  = false
    
    await get(ref(db, 'class')).then((snap) => {

        const class_list = snap.val()
    
        for (const address in class_list){

            const db_teacher = eval('class_list.' + address + '.teacher')
            const db_title   = eval('class_list.' + address + '.title')

            if (db_title == title && db_teacher == teacher){
                
                found_title = true

                const delete_class = set(ref(db, 'class/' + address), null)

                if(!delete_class){
                    res.status(500).send({
                        "code"   : 500,
                        "status" : "Internal Server Error",
                        "data"   : {
                            "message" : [
                                "server not connect to database"
                            ]
                        }
                    })

                    return
                }
                else {
                    res.status(201).send({
                        "code"   : 201,
                        "status" : "Created",
                        "data"   : {
                            "message" : [
                                "success delete a class"
                            ]
                        }
                    })

                    return
                }
            }
        }
    })

    if (!found_title){
        res.status(404).send({
            "code"   : 404,
            "status" : "Not Found",
            "data"   : {
                "message" : [
                    "cant find title",
                    "check parameters"
                ]
            }
        })
        
        return
    }
})


module.exports = manageClass
