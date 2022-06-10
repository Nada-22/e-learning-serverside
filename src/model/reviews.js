//course id - userid - comment -rate/10 .

const mongoose=require('mongoose')
//const Courses=require('./courses')
const Courses=require('./courses')

const Users=require('./user')

const reviewsSchems=mongoose.Schema({
    
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Courses'
    },
    UserID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        //ref:Users
    },
    UserName:{
        type:mongoose.Schema.Types.String,
      require:true

    },
    UserImage:{
        type:mongoose.Schema.Types.String,
      require:true
    },
    comment:{
        type:String,
        required:true,
        maxLength:500
    }
})




// reporter -- > news


const Reviews=mongoose.model("Reviews",reviewsSchems)

module.exports=Reviews