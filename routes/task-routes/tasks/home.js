const express = require("express");

const User = require("../../../models/User");
const Task = require("../../../models/task");
const auth = require("../../../middlewares/auth");
const router = express.Router();

//Status Codes
//200=Ok!
//201=Something has been Created!
//400=Bad Request!
//500=INTERNAL server error
//404=When something is not found

//Creating a new task
router.post("/", auth, async (req, res) => {
  const { description, completed } = req.body;
  const user = req.user;
  const newTask = new Task({
    description,
    completed,
    worker: user._id,
  });
  try {
    await newTask.save();
    res.status(200).send(newTask);
  } catch (e) {
    res.status(400).send({ errror: e });
  }
});

//Getting all tasks Or
// /tasks?completed=true or
// /tasks?limit=1&skip=10
// /task?sortBy=createdAt_desc
//skip==the amount of res to skip
//limit==the amount of res to send
//first page== {{url}}/task?&limit=3&skip=0(skip none,send first 3)
//Second page== {{url}}/task?&limit=3&skip=3(skip 3,send second 3)
//Third page== {{url}}/task?&limit=3&skip=6(skip 6,next first 3)

router.get("/", auth, async (req, res) => {
  const user = req.user;
  const match = {};
  const sort = {};
  //if a user provides a true or false value for completed,
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
    //if completed is true,match.complete==> match:{completed:true} should be true or false if otherwise
    //If true or false is not provided,all tasks will be sent as res
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split("_");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    //sort.createdAt
   //if parts[1]===desc sort.createdAt=-1 or 1 if otherwise
   //-1=descending(newest to oldest)
   //1=ascending (oldest to newest)
  }

  try {
    await user
      .populate({
        path: "Tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        },
      })
      .execPopulate();
    userTasks = user.Tasks;
    return res.status(200).send({ userTasks });
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

//A single task
router.get("/:id", auth, async (req, res) => {
  const user = req.user;
  try {
    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId, worker: user._id });
    //Here,findOne  takes,the task's id and the user so that the system can check
    //whether the task is for the user,if its not for the user,The user will get a task not found res
    if (!task) {
      return res.status(404).send("task not found!");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(err);
  }
});

router.patch("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const { body } = req;

  const userUpdate = Object.keys(body);
  //userUpdate returns an array with keys
  const allowedUpdates = ["description", "completed"];
  let canUpdate = userUpdate.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!canUpdate) {
    return res.status(400).send("Cannot Update This Resource!");
  }
  await Task.findOne({ _id: id, worker: user._id }).then(async (task) => {
    if (!task) {
      return res.status(404).send({ error: "RESOURCE NOT FOUND!" });
    }
    await Task.findByIdAndUpdate(id, body, {
      runValidators: true,
      new: true,
    })
      .then((update) => {
        res.status(200).send(update);
      })
      .catch((err) => res.status(500).send("Poor Connection"));
  });
});

//Deleting a specific task by user
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  //console.log(user)
  try {
    const task = await Task.findOne({ _id: id, worker: user._id });
    console.log(task);
    if (!task) {
      return res.status(404).send({ error: "Task Not Found" });
    }
    task.remove();
    return res
      .status(200)
      .send({ success: `Task with id ${id} is succesfully removed` });
  } catch (e) {
    res.status(500).send({ connErr: `Internal Server Error` });
  }
});

//Deleting all user tasks
router.delete("/alltasks", auth, async (req, res) => {
  const { user } = req;
  //  console.log(user)
  try {
    const virtualTasks = await user.populate("Tasks").execPopulate();
    const tasks = virtualTasks.Tasks;
    // console.log(tasks)
    for (task of tasks) {
      const aTask = await Task.findOne({ _id: task._id });
      await aTask.remove();
    }
    res.status(200).send({ tasks });
  } catch (e) {}
});

module.exports = router;
