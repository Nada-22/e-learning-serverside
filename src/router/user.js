const express=require('express')
const router=express.Router()
const User=require('../model/user')
const multer=require('multer')
const auth=require('../middleware/auth')

const mongoose=require('mongoose')

const Courses=require('../model/courses')
const Reviews=require('../model/reviews')


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


router.post('/user/signup',uploads.single("avatar"),async(req,res)=>{
    try{
        const user=new User(req.body)
        if(req.file)
        {
            user.avatar=req.file.buffer
        }
        const token=await user.generateToken()
        await user.save()
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.post('/user/login',async(req,res)=>{
    try{
        const user=await User.Login(req.body.mail,req.body.password)
        const token = await user.generateToken()
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.patch('/user/update',uploads.single('avatar'),auth,async(req,res)=>{
    try{
        const updates=Object.keys(req.body)
        updates.forEach(update=>{
            req.user[update]=req.body[update]
        })

        if(req.file)
        {
            req.user.avatar=req.file.buffer
        }
        await req.user.save()
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.get('/user/profile',auth,async(req,res)=>{
    try{
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.get('/user/getallcourses',auth,async(req,res)=>{
    try{
       // await User.populate("Courses") // 12316546546324684564  {key:v,key2:v2 }
       const array=await req.user.Courses.map(async (course) => 
          {return await Courses.findById(course.courserObj)}
        );
        res.status(200).send(await Promise.all(array))
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.delete('/user/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter(  t=>
            {
                return t!=req.token
            }
           )
        await req.user.save()
        res.status(200).send()
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/user/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send()
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/user/delete',auth,async(req,res)=>{
    try{
        req.user.remove();
        res.status(200).send()
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.get('/user/:id',auth,async(req,res)=>{              
    try{
        const id=req.params.id
        const user=await User.findById(id)
        if(!user){
            return res.status(404).send('unable to found this user')
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// COURSES

router.post('/user/AddCourse',auth,async(req,res)=>{
    try{
        const courserObj=mongoose.Types.ObjectId(req.body.CourseID);
        const v=req.user.Courses.find(el=> el.courserObj==req.body.CourseID)
        if(!v){
            Courses.findById(req.body.CourseID,async function (err, docs) {
                if (err){
                    throw Error()
                }
                else{
                     const cousre=docs
                     console.log(cousre)
                     cousre.noStudents++

                     await cousre.save()
                     const playlistIDs=[]
                     cousre.playlist?.forEach(link=>  {
                         const obj={linkID:link._id,watched:false}
                         playlistIDs.push(obj)
                     })
                     req.user.Courses=req.user.Courses.concat({courserObj,playlistIDs})
                     await req.user.save()
                     res.status(200).send(req.user)
                }
            });
        }
        else{
            res.status(200).send("COURSE ALREADY EXISTS !!")
        }    
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.delete('/user/deleteCourse',auth,async(req,res)=>{
    try{
        const courserObj=mongoose.Types.ObjectId(req.body.CourseID);
        const v=req.user.Courses.find(el=> el.courserObj==req.body.CourseID)
        if(v){
            Courses.findById(req.body.CourseID,async function (err, docs) {
                if (err){
                    throw Error()
                }
                else{
                     const cousre=docs
                     cousre.noStudents--
                     await cousre.save()
                }
            });
            req.user.Courses=req.user.Courses.filter(course=>{
                return course.courserObj.toString()!=req.body.CourseID
            })
            req.user.save()
            res.status(200).send("Done")
        }

        else{
            res.status(404).send("Course isnt exist!")
        }
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.get('/user/SearchByCourseName/:name',auth,async(req,res)=>{
    try{
        const courses= await Courses.find({name:req.params.name})
        if(!courses)
            return res.status(404).send("No Courses found !")
        res.send(courses)
    }
    catch(e){
        res.status(500).send(e)
    }

})
//search by course id
router.get('/user/SearchByCourseID/:id',async(req,res)=>{
    try{
        const _id=req.params.id
        const course= await Courses.findById(_id)
        console.log(course)
        if(!course)
            return res.status(404).send("No Courses found !")
        res.status(200).send(course)
       
    }
    catch(e){
        res.status(500).send(e.message)
    }

})
//return naame and playlist
router.get('/user/SearchByCourseplaylist/:id',async(req,res)=>{
    try{
        const _id=req.params.id
        const course= await Courses.findById(_id)
       
        if(!course)
            return res.status(404).send("No Courses found !")
        res.status(200).send({...course.playlist,instructorName:course.instructor,name:course.name,category:course.category ,time:course.createdAt})
       
    }
    catch(e){
        res.status(500).send(e.message)
    }

})
router.get('/courses/SearchByCourseCat/:Cat',async(req,res)=>{
    try{
        const courses= await Courses.find({category:req.params.Cat})
        if(!courses)
            return res.status(404).send("No Courses found !")
        res.send(courses)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// REVIEWS
router.post('/user/addReview/:CourseID',auth,async(req,res)=>{
    try{
        const UserID=req.user._id
        const courseID=req.params.CourseID

        const review=new Reviews({courseID,UserID,comment:req.body.comment})
        await review.save()
        res.status(200).send(review)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.get('/user/getCourseReviews/:courseID',auth,async(req,res)=>{
    try{
        const courseID=req.params.courseID
        const course=await Courses.findById({_id:courseID})

        await course.populate('Reviews')

        const reviewsIDs=course.Reviews

        const reviews=await reviewsIDs.map(async (id) => 
        {return await Reviews.findById(id)});
    
        res.status(200).send(await Promise.all(reviews))
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.post('/user/rateCourse/:id',auth,async (req,res)=>{
    try{
        const course_id=req.params.id
        const course=await Courses.findById(course_id)
        if(req.user.Courses.length==0) 
          return res.status(404).send("you must enroll to course berfore rating !!")

        const check=req.user.Courses.map(c=>{
            if(c.courserObj.toString()==course_id)
            {                
               return c
            }  
        })
        //console.log(check.length)
        if(check.length==0)
          return res.status(404).send("you must enroll to course berfore rating !!")

        req.user.Courses=req.user.Courses.map(c=>{
            if(c.courserObj.toString()==course_id)
            {                
                //update
               if(c.rate)
                {
                    let CourseRate=course.courseRate*course.noRates
                    console.log('CourseRate= ',CourseRate)

                    let userRate=c.rate
                    console.log('OldUserRate= ',userRate)

                    CourseRate=CourseRate-userRate
                    console.log('CourseRate= -() ',CourseRate)
                    c.rate=req.body.rate
                    CourseRate=(CourseRate+c.rate)/course.noRates
                    console.log('last CourseRate= ',CourseRate)

                    course.courseRate=CourseRate
                   // c.rate=req.body.rate
                    course.save()
                }
                
              else{ 
                   c.rate=req.body.rate
                   const n=course.courseRate*course.noRates
                   console.log(n)
                course.noRates++
               //const rateValue=course.courseRate*course.noRates
                course.courseRate=(n+c.rate)/course.noRates
               
                course.save()}
              }
            return c  
        })
       await req.user.save()
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})


module.exports=router

