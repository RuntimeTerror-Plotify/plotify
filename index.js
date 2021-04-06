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
  basic = [];
  var py = spawn("python", ["basic.py"]),
    data = filePath;

  py.stdout.on("data", function (output) {
    // console.log(output.toString());
    basic.push(output.toString());
  });

  py.stdout.on("end", function () {
    try {
      basic = JSON.parse(basic[0]);
      if (basic.shape) {
        res.render("basic_info", { list: basic });
      } else {
        res.send("No Data is Parsed , Your data may be Empty");
      }
    } catch (err) {
      res.send("Can't Parse to JSON");
    }
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.get("/plot_graph", function (req, res) {
  res.render("plot_graph", {
    columns: basic.columns,
    numericalData: basic.numerical,
    categoricalData: basic.categorical,
    shape: basic.shape,
    fileName: fileName,
  });
});

app.get("/categorical_labelling", function (req, res) {
  res.render("cat_label", { categoricalData: basic.categorical });
});

app.post("/categorical_labelling", function (req, res) {
  // var columnName = req.body.column;
  // var type = req.body.type;
  var x = req.body;
  var column = [];
  var type = Object.keys(x)[0];
  column = column.concat(Object.values(x)[0]);

  var py = spawn("python", ["labelling.py"]),
    data = {
      filePath: filePath,
      column: column,
      type: type,
    };

  py.stdout.on("data", function (output) {});

  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.post("/drop_columns", function (req, res) {
  let out = [];
  var py = spawn("python", ["drop_col.py"]),
    data = [req.body.drop_col, filePath];

  py.stdout.on("data", function (output) {
    cons;
    out.push(output.toString());
  });

  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.post("/drop_rows", function (req, res) {
  let out = [];
  var py = spawn("python", ["drop_row.py"]),
    data = [filePath, req.body.mode, req.body.subset];

  py.stdout.on("data", function (output) {
    out.push(output.toString());
  });

  py.stdout.on("end", function () {
    // console.log(out);
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.get("/corr_matrix", function (req, res) {
  res.render("corr_matrix", { numericalData: basic.numerical });
});

app.post("/corr_matrix", function (req, res) {
  var out = "";
  var py = spawn("python", ["corr_matrix.py"]),
    data = {
      filePath: filePath,
      column: req.body.column,
    };

  py.stdout.on("data", function (output) {
    // console.log(output.toString());
    out += output.toString();
  });

  py.stdout.on("end", function () {
    out = JSON.parse(out);
    // console.log(out);
    res.send(out);
    // res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.get("/data_transform", function (req, res) {
  res.render("data_transformation", { numericalData: basic.numerical });
});

app.post("/data_transform", function (req, res) {
  var x = req.body;
  var column = [];
  var type = Object.keys(x)[0];
  column = column.concat(Object.values(x)[0]);
  console.log(column);

  var py = spawn("python", ["data_transform.py"]),
    data = {
      filePath: filePath,
      type: type,
      column: column,
    };

  py.stdout.on("data", function (output) {});

  py.stdout.on("end", function () {
    // out = JSON.parse(out);
    // console.log(out);
    // res.send(out);
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.get("/pca", function (req, res) {
  res.render("pca", { numericalData: basic.numerical });
});

app.post("/pca", function (req, res) {
  var out = "";
  var py = spawn("python", ["pca.py"]),
    data = {
      filePath: filePath,
    };

  py.stdout.on("data", function (output) {
    out += output;
  });

  py.stdout.on("end", function () {
    out = JSON.parse(out);
    // console.log(out);
    res.send(out);
    // res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.post("/fill_nan", function (req, res) {
  console.log(filePath);
  let out = [];
  var py = spawn("python", ["fill_nan.py"]),
    data = [filePath, req.body.col_type, req.body.column, req.body.method];

  py.stdout.on("data", function (output) {
    out.push(output.toString());
  });

  py.stdout.on("end", function () {
    console.log(out);
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.get("/remove_outlier", function (req, res) {
  res.render("outlier", { numerical: basic.numerical });
});

app.post("/remove_outlier", function (req, res) {
  let out = [];
  var py = spawn("python", ["remove_outlier.py"]),
    data = [filePath, req.body.thresh];

  py.stdout.on("data", function (output) {
    out.push(output.toString());
  });

  py.stdout.on("end", function () {
    console.log(out);
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.post("/clip_values", function (req, res) {
  let out = [];
  var py = spawn("python", ["clip_values.py"]),
    data = [filePath, req.body.minthresh, req.body.maxthresh, req.body.col];

  py.stdout.on("data", function (output) {
    out.push(output.toString());
  });

  py.stdout.on("end", function () {
    console.log(out);
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.listen(3000, function () {
  console.log("server started");
});
