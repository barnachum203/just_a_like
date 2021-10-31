import express, { Application } from "express";
const app: Application = express();

require("dotenv").config();
require("./startup/db").connect();
require("./startup/routes")(app);
// require("./startup/seed")();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Connect succesfully on port: " + port);
});