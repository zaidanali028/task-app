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
    }    
},{timestamps:true})


const taskMOdel=mongoose.model('tasks',task)
module.exports=taskMOdel