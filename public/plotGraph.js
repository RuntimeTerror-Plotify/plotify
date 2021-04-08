let graphType;
let columnName;
let typeOfData;

fileName = fileName;
shape = shape.split(",").map((value) => {
  return parseInt(value);
});
let no_of_columns = shape[1];
let no_of_rows = shape[0];
let columns;
let data;

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "csv/"+fileName,
    dataType: "text",
    success: function (data) {
      processData(data);
    },
  });

  function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    columns = allTextLines[0].split(",");
    console.log(columns);
    data = [];
    let i = 0;
    for (var j = 1; j <= no_of_rows; j++) {
      allTextLines[j] = allTextLines[j].split(",");
    }
    columns.forEach(function (item) {
      var temp = [];
      for (var j = 1; j <= no_of_rows; j++) {
        temp.push(allTextLines[j][i]);
      }
      i++;
      data.push(temp);
    });

    $("#dataForm input").first().attr("checked", "checked");
    dataClick();
  }
});

function dataClick() {
  typeOfData = $("#topPanel input:checked").val();

  // console.log(typeOfData);
  if (typeOfData == "Numerical") {
    $("#numGraphForm").css("display", "block");
    $("#numColumnForm").css("display", "block");
    $("#catGraphForm").css("display", "none");
    $("#catColumnForm").css("display", "none");
    // graphType = "histogram";
    // columnName = $("#numColumnForm input").first()[0].value;
    $("#numColumnForm input").first().prop("checked", true);
    $("#numGraphForm input").first().prop("checked", true);
    makeGraph();
  } else if (typeOfData == "Categorical") {
    $("#numGraphForm").css("display", "none");
    $("#numColumnForm").css("display", "none");
    $("#catGraphForm").css("display", "block");
    $("#catColumnForm").css("display", "block");
    // graphType = "bar";
    // columnName = $("#catColumnForm input").first()[0].value;
    $("#catColumnForm input").first().prop("checked", true);
    $("#catGraphForm input").first().prop("checked", true);
    makeGraph();
  }
}

function columnClick(value) {
  makeGraph();
}

function typeClick(value) {
  makeGraph();
}

function getMap(arr) {
  const map = {};
  arr.forEach((item) => {
    if (map[item]) {
      map[item]++;
    } else {
      map[item] = 1;
    }
  });
  return map;
}

function makeGraph() {
  //Make Graph
  // console.log($("#rightPanel input"));
  graphType = $("#rightPanel input:checked").val();
  columnName = $("#leftPanel input:checked").val();
  typeOfData = $("#topPanel input:checked").val();

  console.log(columnName + " " + graphType);
  var index = columns.indexOf(columnName);
  // console.log(index);
  var x = data[index];
  // console.log(x);
  if (typeOfData == "Numerical") {
    var trace = {
      x: x,
      type: graphType,
      name: columnName,
    };
  } else if (typeOfData == "Categorical") {
    x = getMap(x);
    switch (graphType) {
      case "bar": {
        var trace = {
          x: Object.keys(x),
          y: Object.values(x),
          type: graphType,
          name: columnName,
        };
        break;
      }
      case "pie": {
        var trace = {
          labels: Object.keys(x),
          values: Object.values(x),
          type: graphType,
          name: columnName,
        };
        break;
      }
    }
  }

  var config = {
    scrollZoom: true,
    displayModBar: true,
    modBarButtonsToAdd: [],
    displaylogo: false,
  };

  var layout = {
    showlegend: true,
  };

  var temp = [trace];

  Plotly.newPlot("myDiv", temp, layout);
}
