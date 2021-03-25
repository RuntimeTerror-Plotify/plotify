const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const fcsv = require("fast-csv");

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

app.post("/file_upload", uploadDisk.single("file"), function (req, res) {
  console.log(req.file);
  var spawn = require("child_process").spawn,
    py = spawn("python", ["test.py"]),
    data = req.file.destination + req.file.originalname,
    dataString = [];

  py.stdout.on("data", function (data) {
    dataString.push(data.toString());
    console.log("DATA");
  });
  py.stdout.on("end", function () {
    console.log(dataString[0]);
    var resp = dataString[0].split("\r\n");
    console.log(resp);

    res.render("response", { list: resp });
  });
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
});

app.get("/", function (req, res) {
  res.render("home_page");
});

app.listen(3000, function () {
  console.log("server started");
});
