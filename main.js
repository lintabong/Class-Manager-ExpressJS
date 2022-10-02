const express      = require('express')
const cookieParser = require('cookie-parser')
const dotenv       = require('dotenv')

dotenv.config()

const port = process.env.PORT
const app  = express()

app.use(cookieParser())

// PAGES
app.get('/',  function(req, res){
  res.send({
    "message":"index"
  })
})

// CONTROLLERS
app.use('/', require('./controllers/login'))
app.use('/', require('./controllers/register'))

// ADMIN ROUTE
app.use('/', require('./route/admin/all_user'))

// TEACHER ROUTE
app.use('/', require('./route/teacher/manage_class'))

// START PROGRAM
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
});
