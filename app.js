const express=require('express')
const cors = require('cors')
const app=express()
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

app.listen(PORT,()=>console.log('RUNNING ... '))

