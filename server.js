require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
var passport = require('passport');
var flash = require('connect-flash');
const session = require('express-session')
const cookieParser = require('cookie-parser')

//Passport config


const app = express()
app.use(express.json({limit: '8000mb'}))
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );  
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

require('./middleware/configPassport')(passport)


app.use('/user', require('./routes/userRouter'))


mongoose.connect('mongodb://127.0.0.1:27017/task5', {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log("Connected to mongodb")
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})