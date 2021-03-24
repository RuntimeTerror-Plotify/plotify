const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const fcsv = require('fast-csv'); 

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/"); 
    },
    filename: function (req, file, cb) {
        console.log(file); 
        cb(null, file.originalname); 
    }
});

var uploadDisk = multer({
    storage: storage
});

app.post("/file_upload",uploadDisk.single("file"),function(req,res){
    console.log(req.file);
    // houses = []
    // fs.createReadStream('public/Housing.csv')
    //     .pipe(csv())
    //     .on('data', function (row) {
        
    //     //   const house = {
    //     //       price: row.price,
    //     //       firstname: row.Firstname,
    //     //       surname: row.Surname,
    //     //       roles: row.Roles,
    //     //       password
    //     //    }
    //       houses.push(row)
    //     })
    //     .on('end', function () {
    //         console.log(houses[0])
    //         console.log(Object.keys(houses[0]).length)
    //         console.log(typeof(houses[1]))
    //     })
      
})

app.get("/",function(req,res){
    res.render("home_page");
})

app.listen(3000, function () {
    console.log("server started");
})

