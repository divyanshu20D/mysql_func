const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const Routes = require("./routes/index");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.static("public"));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", Routes);
app.listen(3000, () => {
  console.log("Server connected");
});
