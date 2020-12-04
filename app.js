require('dotenv').config()
const mongoose=require('mongoose')

const express=require('express')
const app=express()
const db=require('./config/db')
const dbURI=db.dbUrI
const port=process.env.PORT||5151


app.use(express.urlencoded({extended:true}))
app.use(express.json())
const userRoute=require('./routes/task-routes/users/home')
const taskRoute=require('./routes/task-routes/tasks/home')






app.use('/user',userRoute)
app.use('/task',taskRoute)

const User=require('./models/User')
const Taskdb=require('./models/task')
//console.log(dbUrI)
//db connection
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true })
  .then((connected) => {
    console.log("db connected.....");
  })
  .catch((err) => {
    console.log(err);
  });



app.listen(port,()=>{
    console.log(`App listening on port ${port}...`)
})

//#############################============TESTINGS====================############################

 
//Finding Users From Tasks
// const main=async ()=>{
//    const task= await Taskdb.findById('5fc55115edbdf407fc447566')
//    //console.log(task)
//     await task.populate('worker').execPopulate()
//    // console.log(task.worker)

// }
// main()

//Finding Tasks For A User
// const mainTwo=async ()=>{
//   const taskAuthor=await User.findById('5fc5277ad5284c1ef4c24fa1')
//  // console.log(taskAuthor)
// await taskAuthor.populate('Tasks').execPopulate()
// //console.log(taskAuthor.Tasks)


// }
// mainTwo()

const match={}
match.completed=true
//console.log(match)
//{ completed: true } This will be logged in the console