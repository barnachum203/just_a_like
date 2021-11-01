import { Response, Request } from "express";
const catchAsync = require("../utillities/catchAsync");
// const dbService = require("../startup/db");
const Task = require("../models/task.model");

/*************************************************************
 ** All Routes taken from "requirments" doc. *****************
 ** If you didn't understand something please check the doc. *
 ** UML also associated within the project files *************
 *************************************************************/

/**
 * Get all tasks:
 * Any user from level 1-4
 * can get all tasks
 * */
module.exports.allTasks = catchAsync(async (req: Request, res: Response) => {
  const tasks = await Task.find();
  console.log(`[TASK-GET] - send ${tasks.length} tasks`);
  res.send(tasks);
});

/**
 * Create tasks:
 * Require user level 1 (-Admin)
 * to create new task
 * */
module.exports.createTask = catchAsync(async (req: Request, res: Response) => {
  const newTask = req.body;

  try {
    // const result = await Task.create(newTask);
    const result = await new Task({newTask});

    console.log(result);
    result.save();
    console.log(`[TASK-CREATE]: added new task to DB`);

    res.send("Added new task: " + newTask);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to add new task: " + newTask);
  }
});

/**
 * Delete tasks:
 * Require user level 1 (-Admin)
 * to delete existing task
 *
 * @param:
 * tid - task id
 * */
module.exports.deleteTask = catchAsync(async (req: Request, res: Response) => {
  //TODO: Add permission control
  const tid = req.params.tid;
  const result = await Task.findByIdAndDelete(tid);
  console.log(`[TASK-REMOVE] - removed task_id: ${tid}`);
  console.log(result);
  if (result) res.send("Deleted task: " + tid);
  res.status(500).send("Task not found: " + tid);
});

/**
 * Update tasks:
 * Require user level 3 or 1 (Volunteer / Admin)
 * to update existing task.
 *
 * Level 3 - can update task only if he is associated with the project.
 * Level 1 - can update any task in any project.
 *
 * @param:
 * tid - task id
 * */
module.exports.updateTask = catchAsync(async (req: Request, res: Response) => {
  //TODO: Add permission control
  const tid = req.params.tid;
  const updatedTask = req.body;
  const filter = { _id: req.params.tid };
  //Fins task by id and update entire object
  const doc = await Task.findByIdAndUpdate(filter, updatedTask);
  console.log(
    `[TASK-UPDATE] - update task_id: ${tid}, ${JSON.stringify(updatedTask)} `
  );
  res.send(`Task updated: \n${JSON.stringify(updatedTask)}`);
});

/**
 * Get all Associated tasks for user:
 * Require user level 3-1
 * to get associated tasks.
 *
 * Level 3 - get he's associated tasks in associated project.
 * Level 2 - get he's associated tasks in associated project.
 * Level 1 - get all the tasks in the project.
 *
 * @param:
 * uid - user id
 * */
module.exports.getAssociatedTasks = catchAsync(
  async (req: Request, res: Response) => {
    //TODO: Add permission control
    const uid = req.params.uid;
    const result = await Task.find({ users: { $in: uid } });
    console.log(`[ASSOCIATE-TASK] found ${result.length} tasks for id: ${uid}`);
    res.send(result);
  }
);
