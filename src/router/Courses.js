const express=require('express')
const multer=require('multer')
const router=express.Router()

const Courses=require('../model/courses')



const uploads=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/))
            return cb(new Error('please upload image !'))
        cb(null,true)
    }
})
router.get('/getAllCategoreies',async(req,res)=>{
    try{
        const arr=[];
        const courses=await Courses.find({});
        courses.forEach(course=>{
            console.log(arr.includes(course.category))
            if(!arr.includes(course.category))
                arr.push(course.category)
        })
        res.status(200).send(arr);
    }
    catch(e){
        res.status(500).send(e);
    }
})

router.post('/courses/Add',uploads.single("image"),async (req,res)=>{
    try{
        const course=new Courses(req.body)
        if(req.file){
            course.image=req.file.buffer
        }
        await course.save()
        res.status(200).send(course)
    }
    catch(e){
        res.status(500).send(e)
    }
})





module.exports=router