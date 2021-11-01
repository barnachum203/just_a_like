import express, { Application } from 'express';
const mongoose = require("mongoose");
const cors = require('cors');
const app: Application = express();

app.use(cors({ 
  credentials: true
})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const projectRoutes = require('./routes/project');
// const userRoutes = require('./routes/user');
const tasksRoutes = require('./routes/task');
require("dotenv").config();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/seed")();
const seeds = require("./startup/seed");

//Uncomment to seed db
// seeds.seedTasks();
// seeds.seedUsers();

// app.use('/project', projectRoutes);
// app.use('/user', userRoutes);
app.use('/task', tasksRoutes);
    
const port = process.env.PORT|| 8000;
app.listen(port, () => {
  console.log("Connect succesfully on port: " + port);
});


    
