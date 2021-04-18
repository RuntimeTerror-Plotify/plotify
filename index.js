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
let section = "home";
let currentPage = 0;
let tutorialFile = false;

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

app.get("/", function (req, res) {
  console.log(fs.existsSync(folderPath));
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
                tutorialFile: false,
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

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

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

  py.stdout.on("data", function (output) {});

  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

app.post("/drop_columns", function (req, res) {
  if (section == "tutorial") {
    currentPage = 1;
  }
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
  if (section == "tutorial") {
    currentPage = 2;
  }
  handleFiles();
  var py = spawn("python", ["pyScript/drop_row.py"]),
    data = [filePath, req.body.subset];

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

  py.stdout.on("data", function (output) {});

  py.stdout.on("end", function () {
    res.redirect("/data_analysis");
  });

  py.stdin.write(JSON.stringify(data));

  py.stdin.end();
});

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
  if (section == "tutorial") {
    currentPage = 4;
  }
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
  if (section == "tutorial") {
    currentPage = 4;
  }
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
