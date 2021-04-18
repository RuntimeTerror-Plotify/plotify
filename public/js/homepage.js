// rgba(245, 192, 192, 0.2) rgba(38, 160, 218, 0.5)

y1 = new Array(10)
  .fill(0)
  .map((d, i) => Math.random() * 10 + Math.random() * 20 + 5);
y2 = new Array(20).fill(0).map((d, i) => Math.random() * 15);

var y = y1.concat(y2);
y = y.concat(y1);

var trace = {
  y: y,
  line: { dash: "0px 5200px", width: 3, color: "rgba(245, 192, 192, 0.5)" },
};

var trace2 = {
  x: [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
  ],
  y: y,
  type: "bar",
  marker: {
    color: "rgba(38, 160, 218, 0.5)",
  },
};

var layout = {
  autosize: true,
  showlegend: false,
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0,
    pad: 40,
  },
  xaxis: {
    range: [0, 40],
    zeroline: false,
    visible: false,
  },
  yaxis: {
    range: [0, 50],
    zeroline: false,
    visible: false,
  },
  plot_bgcolor: "#0A0C5F",
  paper_bgcolor: "#0A0C5F",
};

var data = [trace, trace2];

Plotly.plot("graph", data, layout, { staticPlot: true, responsive: true }).then(
  function () {
    return Plotly.animate(
      "graph",
      {
        data: [{ "line.dash": "5200px 0px" }, { "line.dash": "5200px 0px" }],
        traces: [0, 1],
      },
      {
        frame: { duration: 5000, redraw: true },
        transition: { duration: 5000 },
      }
    );
  }
);

var $animation_elements = $(".animation-element");
var $window = $(window);

function check_if_in_view() {
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = window_top_position + window_height;

  $.each($animation_elements, function () {
    var $element = $(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = element_top_position + element_height;

    //check to see if this current container is within viewport
    if (
      element_bottom_position >= window_top_position &&
      element_top_position <= window_bottom_position
    ) {
      $element.addClass("in-view");
    } else {
      $element.removeClass("in-view");
    }
  });
}

$window.on("scroll resize", check_if_in_view);
$window.trigger("scroll");
