const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const fcsv = require("fast-csv");
const spawn = require("child_process").spawn;
const { resolveSoa } = require("dns");
const app = express();
var $ = (jQuery = require("jquery"));
$.csv = require("jquery-csv");

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
    cb(null, "./public/csv/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var uploadDisk = multer({
  storage: storage,
});

let filePath = "";
let fileExt = "";
let fileName = "";
let basic = [];
let fileNo = 0;
let folderPath = "./public/csv/";

function handleFiles() {
  if (fileNo < 3) {
    let oldPath = filePath;
    fileNo += 1;
    fileName = "file" + fileNo + "." + fileExt;
    filePath = folderPath + fileName;
    fs.copyFile(oldPath, filePath, function (err) {
      if (err) {
        console.log(err);
      }
    });
  } else {
    fs.copyFile(
      folderPath + "file1." + fileExt,
      folderPath + "file0." + fileExt,
      function (err) {
        if (err) {
          console.log(err);
        }
        fs.copyFile(
          folderPath + "file2." + fileExt,
          folderPath + "file1." + fileExt,
          function (err) {
            if (err) {
              console.log(err);
            }
            fs.copyFile(
              folderPath + "file3." + fileExt,
              folderPath + "file2." + fileExt,
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
        );
      }
    );
  }
}

app.get("/", function (req, res) {
  res.render("home_page");
});

app.get("/revert", function (req, res) {
  if (fileNo > 0) {
    fs.unlink(filePath, (err) => {
      console.log("File deleted ...");
      fileNo -= 1;
      fileName = "file" + fileNo + "." + fileExt;
      filePath = folderPath + fileName;
      res.redirect("/data_analysis");
    });
  } else {
    res.redirect("/data_analysis");
  }
});

app.post("/file_upload", uploadDisk.single("file"), function (req, res) {
  fileNo = 0;
  fileExt = req.file.originalname.split(".").pop();
  fs.rename(
    req.file.destination + req.file.originalname,
    req.file.destination + "file" + fileNo + "." + fileExt,
    function (err) {
      console.log(err);
    }
  );
  filePath = req.file.destination + "file" + fileNo + "." + fileExt;
  fileName = "file" + fileNo + "." + fileExt;
  res.redirect("/data_analysis");
});

app.get("/download", function (req, res) {
  res.download(filePath);
});

app.get("/data_analysis", function (req, res) {
  basic = [];
  var py = spawn("python", ["pyScript/basic.py"]),
    data = filePath;

  py.stdout.on("data", function (output) {
    // console.log(output.toString());
    basic.push(output.toString());
  });

  py.stdout.on("end", function () {
    try {
      basic = JSON.parse(basic[0]);
      if (!(basic.error === "No Data Parsed")) {
        var head;
        fs.readFile(filePath, "UTF-8", function (err, csv) {
          $.csv.toArrays(csv, {}, function (err, data) {
            head = data.shift();
            res.render("basic_info", {
              list: basic,
              fileName: fileName,
              filePath: filePath,
              fileNo: fileNo,
              head: head,
              data: data.slice(0, 20),
            });
          });
        });
      } else {
        res.render("error404");
      }
    } catch (err) {
      res.send("Can't Parse to JSON");
    }
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.post("/categorical_labelling", function (req, res) {
  handleFiles();
  var x = req.body;
  var column = [];
  var type = Object.keys(x)[0];
  column = column.concat(Object.values(x)[0]);

  var py = spawn("python", ["pyScript/labelling.py"]),
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
  handleFiles();
  let out = [];
  var py = spawn("python", ["pyScript/drop_col.py"]),
    data = [req.body.drop_col, filePath];

  py.stdout.on("data", function (output) {});

  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.post("/drop_rows", function (req, res) {
  handleFiles();
  var py = spawn("python", ["pyScript/drop_row.py"]),
    data = [
      filePath,
      req.body.mode,
      req.body.subset,
      fileNo,
      fileExt,
      folderPath,
      fileName,
    ];

  py.stdout.on("data", function (output) {});

  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.post("/corr_matrix", function (req, res) {
  var x = req.body;
  var column = [];
  column = column.concat(Object.values(x)[0]);

  var out = "";
  var py = spawn("python", ["pyScript/corr_matrix.py"]),
    data = {
      filePath: filePath,
      column: column,
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

app.post("/data_transform", function (req, res) {
  handleFiles();
  var x = req.body;
  var column = [];
  var type = Object.keys(x)[0];
  column = column.concat(Object.values(x)[0]);

  var py = spawn("python", ["pyScript/data_transform.py"]),
    data = {
      filePath: filePath,
      type: type,
      column: column,
    };

  py.stdout.on("data", function (output) {});

  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.post("/pca", function (req, res) {
  handleFiles();
  var out = "";
  var py = spawn("python", ["pyScript/pca.py"]),
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
  handleFiles();
  console.log(filePath);
  let out = [];
  var py = spawn("python", ["pyScript/fill_nan.py"]),
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

app.post("/remove_outlier", function (req, res) {
  handleFiles();
  let out = [];
  var py = spawn("python", ["pyScript/remove_outlier.py"]),
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
  handleFiles();
  let out = [];
  var py = spawn("python", ["pyScript/clip_values.py"]),
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
