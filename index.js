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
let fileName = "";
let basic = [];

app.get("/", function (req, res) {
  res.render("home_page");
});

app.post("/file_upload", uploadDisk.single("file"), function (req, res) {
  filePath = req.file.destination + req.file.originalname;
  fileName = req.file.originalname;
  res.redirect("/data_analysis");
});

app.get("/data_analysis", function (req, res) {
  //Python Script Code
  var py = spawn("python", ["basic.py"]),
    data = filePath;

  py.stdout.on("data", function (output) {
    basic.push(output.toString());
  });

  py.stdout.on("end", function () {
    basic = JSON.parse(basic[0]);
    res.render("basic_info", { list: basic });
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.get("/plot_graph", function (req, res) {
  res.render("plot_graph", {
    numericalData: basic.numerical,
    categoricalData: basic.categorical,
    shape: basic.shape,
    fileName: fileName,
  });
});

app.get("/categorical_labeling", function (req, res) {
  res.render("cat_label", { categoricalData: basic.categorical });
});

app.post("/categorical_labeling", function (req, res) {
  // var columnName = req.body.column;
  // var type = req.body.type;
  var x = [];

  var py = spawn("python", ["labelling.py"]),
    data = {
      filePath: filePath,
      column: req.body.column,
      type: req.body.type,
    };

  py.stdout.on("data", function (output) {
    x.push(output.toString());
  });

  py.stdout.on("end", function () {
    x = JSON.parse(x[0]);
    res.send(x);
    // res.render("basic_info", { list: basic });
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();

  // res.redirect("/categorical_labeling", { categoricalData: basic.categorical });
});

app.listen(3000, function () {
  console.log("server started");
});
