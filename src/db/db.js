 const mongoose=require('mongoose')
const { db } = require('../model/reviews')

// mongoose.connect('mongodb://127.0.0.1:27017/E_Learning')
mongoose.set('strictQuery', true)
mongoose.connect('mongodb+srv://reemabdulnaby00:Reem0191827712@cluster0.7lmwikk.mongodb.net/?retryWrites=true&w=majority')

