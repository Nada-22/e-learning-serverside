const mongoose=require('mongoose')
const Reviews=require('./reviews')
const timestamps = require('mongoose-timestamp');

const CoursesSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    instructor:{
        type:String,
        require:true,
        trim:true
    },
    outline:{
       type:String,
       require:true,
       trim:true
    },

    playlist:[
        {
            linkName:{
            type:String,
            require:true,
            trim:true
            },
            link:{
                type:String,
                trim:true
            }
        }
    ],
    noStudents:{
        type:Number,
        default:0
    },
    image:{
        type:Buffer
    },
    noRates:{
        type:Number,
        default:0
    },
    courseRate:{
        type:Number,
        default:0
    },
  

})

CoursesSchema.virtual('Reviews',{
    ref:'Reviews',
    localField:'_id',
    foreignField:'courseID'

})
CoursesSchema.methods.toJSON=function(){
    const course=this
    const courseObject=course.toObject()

   
    return courseObject
}
CoursesSchema.plugin(timestamps)

const Courses=mongoose.model('Courses',CoursesSchema)
module.exports=Courses