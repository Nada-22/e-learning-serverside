const jwt=require('jsonwebtoken')
const User=require('../model/user')


const auth=async (req,res,next)=>{
   try{
    const token=req.header('Authorization').replace('Bearer ','')
    const decode=jwt.verify(token,"PROJECT")
    const user=await User.findOne({_id:decode._id,tokens:token})
   
    if(!user)
       throw new Error('NOT AUTHORIZED !!')
    req.user=user
    req.token=token
    next()
   }
   catch(e){
       res.status(401).send("Please Authenticate !!")
   }
}

module.exports=auth