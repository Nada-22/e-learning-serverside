const express=require('express')
const cors = require('cors')
const app=express()
const mongoose=require('mongoose')
const PORT=process.PORT || 3000
app.use(cors())
require('./src/db/db')
app.use(express.json())
const userRouter=require('./src/router/user.js')
app.use(userRouter)

const CoursesRouter=require('./src/router/Courses.js')
app.use(CoursesRouter)

//const ReviewsRouter=require('./src/router/reviews.js')
//app.use(ReviewsRouter)
const db=mongoose.connection
db.on('error',console.error.bind(console,'connection error: '))
db.once("open",()=>{console.log('db successfully connected')})
app.listen(PORT,()=>console.log('RUNNING ... '))

