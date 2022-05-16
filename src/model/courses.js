const mongoose=require('mongoose')
const Reviews=require('./reviews')

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
    playlist:[
        {
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
    }
})

CoursesSchema.virtual('Reviews',{
    ref:'Reviews',
    localField:'_id',
    foreignField:'courseID'

})

const Courses=mongoose.model('Courses',CoursesSchema)

module.exports=Courses