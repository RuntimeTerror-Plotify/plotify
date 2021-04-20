// Importing
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

// Multer configuration
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

// Global variables
let filePath = "";
let fileExt = "";
let fileName = "";
let basic = [];
let fileNo = 0;
let folderPath = "./public/csv/";
let section = "home";
let currentPage = 0;
let tutorialFile = false;

// File handling for Undo
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

// Csv folder handling
const removeDir = function (path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          removeDir(path + "/" + filename);
        } else {
          fs.unlinkSync(path + "/" + filename);
        }
      });
      fs.rmdirSync(path);
    } else {
      fs.rmdirSync(path);
    }
  } else {
    console.log("Directory path not found.");
  }
};

// Home route
app.get("/", function (req, res) {
  if (fs.existsSync(folderPath)) {
    removeDir(folderPath);
  }
  fs.mkdirSync(folderPath, function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.render("home_page", { section: "home" });
});

// Tutorial route
app.get("/tutorial", function (req, res) {
  if (tutorialFile == false) {
    section = "tutorial";
    res.render("tutorial", {
      currentPage: currentPage,
      section: section,
      tutorialFile: tutorialFile,
    });
  } else {
    section = tutorial;
    res.redirect("/data_analysis");
  }
});

// Undo route
app.get("/revert", function (req, res) {
  if (fileNo > 0) {
    fs.unlink(filePath, (err) => {
      fileNo -= 1;
      fileName = "file" + fileNo + "." + fileExt;
      filePath = folderPath + fileName;
      res.redirect("/data_analysis");
    });
  } else {
    res.redirect("/data_analysis");
  }
});

// File upload route
app.post("/file_upload", uploadDisk.single("file"), function (req, res) {
  fileNo = 0;
  section = req.body.section;
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
  if (section == "tutorial") {
    currentPage = 1;
    tutorialFile = true;
  }
  res.redirect("/data_analysis");
});

// Download File
app.get("/download", function (req, res) {
  res.download(filePath);
});

// Basic page route
app.get("/data_analysis", function (req, res) {
  basic = [];
  var py = spawn("python", ["pyScript/basic.py"]),
    data = filePath;

  // Python output
  py.stdout.on("data", function (output) {
    basic.push(output.toString());
  });

  // Python Output display
  py.stdout.on("end", function () {
    try {
      basic = JSON.parse(basic[0]);
      if (!(basic.error === "No Data Parsed")) {
        var head;
        fs.readFile(filePath, "UTF-8", function (err, csv) {
          $.csv.toArrays(csv, {}, function (err, data) {
            head = data.shift();

            if (section == "home") {
              res.render("basic_info", {
                list: basic,
                fileName: fileName,
                filePath: filePath,
                fileNo: fileNo,
                head: head,
                data: data.slice(0, 20),
                section: section,
                tutorialFile: false,
              });
            } else {
              res.render("tutorial", {
                currentPage: currentPage,
                section: section,
                list: basic,
                fileName: fileName,
                filePath: filePath,
                fileNo: fileNo,
                head: head,
                data: data.slice(0, 20),
                tutorialFile: tutorialFile,
              });
            }
          });
        });
      } else {
        res.render("error404");
      }
    } catch (err) {
      res.send("Can't Parse to JSON");
    }
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

// Labelling route
app.post("/categorical_labelling", function (req, res) {
  if (section == "tutorial") {
    currentPage = 7;
  }
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

  // Python output  // Python output
  py.stdout.on("data", function (output) {});

  // Python Output display
  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

// Drop column route
app.post("/drop_columns", function (req, res) {
  if (section == "tutorial") {
    currentPage = 1;
  }
  handleFiles();
  let out = [];
  var py = spawn("python", ["pyScript/drop_col.py"]),
    data = [req.body.drop_col, filePath];

  // Python output
  py.stdout.on("data", function (output) {});

  // Python Output display
  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

// Drop rows route
app.post("/drop_rows", function (req, res) {
  if (section == "tutorial") {
    currentPage = 2;
  }
  handleFiles();

  var x = req.body;
  var column = [];
  column = column.concat(Object.values(x)[0]);

  var py = spawn("python", ["pyScript/drop_row.py"]),
    data = [filePath, column];

  // Python output
  py.stdout.on("data", function (output) {});

  // Python Output display
  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

// Correaltion matrix route
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

  // Python output
  py.stdout.on("data", function (output) {
    out += output.toString();
  });

  // Python Output display
  py.stdout.on("end", function () {
    out = JSON.parse(out);
    res.send(out);
    // res.redirect("/data_analysis");
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

// Normalisation and skewness remoaval route
app.post("/data_transform", function (req, res) {
  if (section == "tutorial") {
    currentPage = 10;
  }
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

  // Python output
  py.stdout.on("data", function (output) {});

  // Python Output display
  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

// Principal component analysis route
app.post("/pca", function (req, res) {
  if (section == "tutorial") {
    currentPage = 12;
  }
  handleFiles();
  var out = "";
  var py = spawn("python", ["pyScript/pca.py"]),
    data = {
      filePath: filePath,
    };

  // Python output
  py.stdout.on("data", function (output) {
    out += output;
  });

  // Python Output display
  py.stdout.on("end", function () {
    out = JSON.parse(out);
    res.send(out);
    // res.redirect("/data_analysis");
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

//Fill NAN values route
app.post("/fill_nan", function (req, res) {
  if (section == "tutorial") {
    currentPage = 3;
  }
  handleFiles();
  dataArr = [];
  if (req.body.col_type == "num") {
    dataArr = [
      filePath,
      req.body.col_type,
      req.body.column[1],
      req.body.method[1],
    ];
  } else {
    dataArr = [
      filePath,
      req.body.col_type,
      req.body.column[0],
      req.body.method[0],
    ];
  }
  let out = [];
  var py = spawn("python", ["pyScript/fill_nan.py"]),
    data = dataArr;

  // Python output
  py.stdout.on("data", function (output) {});

  // Python Output display
  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

// Remove outliers route
app.post("/remove_outlier", function (req, res) {
  if (section == "tutorial") {
    currentPage = 4;
  }
  handleFiles();
  let out = [];
  var py = spawn("python", ["pyScript/remove_outlier.py"]),
    data = [filePath, req.body.thresh];

  // Python output
  py.stdout.on("data", function (output) {
    out.push(output.toString());
  });

  // Python Output display
  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

// Clip values route
app.post("/clip_values", function (req, res) {
  if (section == "tutorial") {
    currentPage = 4;
  }
  handleFiles();
  let out = [];
  var py = spawn("python", ["pyScript/clip_values.py"]),
    data = [filePath, req.body.minthresh, req.body.maxthresh, req.body.col];

  // Python output
  py.stdout.on("data", function (output) {
    out.push(output.toString());
  });

  // Python Output display
  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  // Python data input
  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

// Server start
app.listen(3000, function () {
  console.log("server started");
});
