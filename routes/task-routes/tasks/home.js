const express=require('express')

const User = require('../../../models/User')
const Task=require('../../../models/task')
const {userAuth}=require('../../../middlewares/auth')
const router=express.Router()

//Status Codes
//200=Ok!
//201=Something has been Created!
//400=Bad Request!
//500=INTERNAL server error
//404=When something is not found








//Creating a new task
router.post('/', async (req,res)=>{
    const {description,completed}=req.body
    await new Task({
        description,
        completed
    }).save()
    .then(task=>{
        res.status(200)
        .send(task)
    })
    .catch(err=>{
        res.send(err)
    })
    
})




//Getting all tasks
router.get('/',userAuth, async (req,res)=>{
   await Task.find({})
    .then(tasks=>{
     return res.status(200)
        .send(tasks)
    })
    .catch(err=>res.status(400).send(err))
})

//Deleting a task by ID
// router.delete('/task/:id', async (req,res)=>{
//     const {id}=req.params
//   await  Task.findById(id)
//     .then(async (task)=>{
//       await  task.remove()
//         .then( async ()=>{
//            await  Task.countDocuments({completed:false})
//             .then(incompleteTasks=>{
//                 console.log(incompleteTasks)
//                 //res.status(200).send(incompleteTasks)
//             })
//         })
//     })
// })


//A single task
router.get('/:id', async (req,res)=>{
    const {id}=req.params
   await Task.findOne({_id:id})
    .then(task=>{
        if(!task){
            return res.status(404).send('task not found!')
        }
        res.status(200)
        .send(task)
    })
    .catch(err=>res.status(400).send(err))
})




router.patch('/:id',async (req,res)=>{
    const {id}=req.params
    const {body}=req

    const userUpdate=Object.keys(body)
    //userUpdate returns an array with keys
    const allowedUpdates=['description','completed']
    let canUpdate=userUpdate.every(update=>{
       return allowedUpdates.includes(update)

    })
    if(!canUpdate){
        return res.status(400).send('Cannot Update This Resource!')
    }
    await  Task.findById(id).then( async task=>{
        if(!task){
            return    res.status(404).send({error:'RESOURCE NOT FOUND!'})
        }
        await Task.findByIdAndUpdate(id,body,{
        runValidators:true,
        new:true
    })
    .then(update=>{
        res.status(200).send(update)
    })
    .catch(err=>res.status(500).send('Poor Connection'))

    })
    
    
    
})



router.delete('/:id',async (req,res)=>{
    const {id} =req.params
    await Task.findByIdAndUpdate(id)
    .then(task=>{
        if(!task){
            return res.status(404).send({error:'Task Not Found'})
        }
        task.remove()
        return res.status(200).send({success:`Task with id ${id} is succesfully removed`})
    })
    .catch(err=>{
        res.status(500).send({connErr:`Internal Server Error`})
        })
})

module.exports=router