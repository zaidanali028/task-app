require('dotenv').config()
const mongoose=require('mongoose')
const dbUrI=process.env.BD_URI
const express=require('express')
const app=express()


app.use(express.urlencoded({extended:true}))
app.use(express.json())
const userRoute=require('./routes/task-routes/users/home')
const taskRoute=require('./routes/task-routes/tasks/home')

app.use('/user',userRoute)
app.use('/task',taskRoute)
const port=process.env.PORT

const User=require('./models/User')
const Taskdb=require('./models/task')
const { getMaxListeners } = require('./models/User')
//console.log(dbUrI)
//db connection
mongoose
  .connect(dbUrI, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true })
  .then((connected) => {
    console.log("db connected.....");
  })
  .catch((err) => {
    console.log(err);
  });



app.listen(port,()=>{
    console.log(`App listening on port ${port}...`)
})
