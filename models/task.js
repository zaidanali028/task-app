const mongoose=require('mongoose')
const task=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    worker:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
        
    }    
},{timestamps:true})


const taskMOdel=mongoose.model('tasks',task)
module.exports=taskMOdel