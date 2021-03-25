const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const fcsv = require("fast-csv");
const spawn = require("child_process").spawn;
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var uploadDisk = multer({
  storage: storage,
});

let filePath = "";

app.get("/", function (req, res) {
  res.render("home_page");
});

app.post("/file_upload", uploadDisk.single("file"), function (req, res) {
  filePath = req.file.destination + req.file.originalname;
  res.redirect("/data_analysis");
});

app.get("/data_analysis", function (res, res) {
  //Python Script Code
  var py = spawn("python", ["basic.py"]),
    data = filePath,
    basic = [];

  py.stdout.on("data", function (output) {
    basic.push(output.toString());
  });

  py.stdout.on("end", function () {
    basic = JSON.parse(basic[0]);
    res.render("response", { list: basic });
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.listen(3000, function () {
  console.log("server started");
});
