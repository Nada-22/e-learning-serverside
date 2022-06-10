const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Courses=require('./courses')

//name - mail - password(encrypt) - age - phone number(validation) - country - token - array of courses.
const userSchema=mongoose.Schema({
    name:{
        type:String,
        requied:true,
        trim:true
    },
    mail:{
        type:String,
        requied:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Please enter validate email !!')
        }
    },
    birthdate:{
       type:Date,
       trim:true
    },
    socialLinks:[
        {
            Twitter:{
                type:String,
                trim:true
            },
            Facebook: {
                type:String,
                trim:true
            },
            Google: {
                type: String,
                trim:true
            },
            LinkedIn: {
                type: String,
                trim:true
            },
            GitHub: {
                type: String,
                trim:true
            }
            
        }
    ],
    password:{
        type:String,
        required:true,
        minLength:8,
        validate(value){
            let strongPass=new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
            if(!strongPass.test(value))
                throw new Error("Paasword must contain at least one capital/small letter & specail charcater and number")
        }

    },
  
    phone:{
        type:String,
        
      
    },
    country:{
        type:String,
       
        trim:true,
        minLength:3
    },
    avatar:{
        type:Buffer
    },
    tokens:[{
        type:String,
        requied:true
    }],
    Courses:[{ 
          courserObj:{
          type:mongoose.Schema.Types.ObjectId,
          ref:Courses
        },
          playlistIDs:[{  
              link:{
                type:mongoose.Schema.Types.ObjectId
            },
            watched:{
                type:Boolean
            }
        }],
          rate:{
          type:Number,
         //default:0,
          validate(value){
            if( !(value>=1 && value<=5) ){
                throw new Error("value must be betweeen 1-4") }
        }
        }
      }]
})

userSchema.pre('save',async function(){
    const user=this
    if(user.isModified('password'))
    {
        user.password=await bcryptjs.hash(user.password,8)
    }
})

userSchema.methods.generateToken=async function(){
    const user=this
    const token = jwt.sign({_id:user._id},'PROJECT')
    user.tokens=user.tokens.concat(token)
    await user.save()
    return token
}

userSchema.statics.Login=async function(mail,password){
    const user=await User.findOne({mail:mail})
    if(!user)
        throw new Error('password or email is wrong!')
    
    const isMatch=await bcryptjs.compare(password,user.password)
    if(!isMatch)
        throw new Error('password or email is wrong!')
    
    return user
}

userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
 //   delete userObject.tokens
    return userObject
}

const User=mongoose.model('User',userSchema)



module.exports=User