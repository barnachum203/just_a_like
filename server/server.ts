import express, { Application } from 'express';
const mongoose = require("mongoose");
const cors = require('cors');
const app: Application = express();

app.use(cors({ 
  credentials: true
})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
require("./startup/db")();

const seeds = require("./startup/seed");

//Uncomment to seed db
// seeds.seedTasks();
// seeds.seedUsers();


// const projectRoutes = require('./routes/project');
// const userRoutes = require('./routes/user');
const tasksRoutes = require('./routes/task');

// app.use('/project', projectRoutes);
// app.use('/user', userRoutes);
app.use('/task', tasksRoutes);
    
const port = process.env.PORT|| 8000;
app.listen(port, () => {
  console.log("Connect succesfully on port: " + port);
});