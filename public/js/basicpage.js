$(document).ready(function () {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  var trigger = $(".hamburger"),
    overlay = $(".overlay"),
    isClosed = false;

  trigger.click(function () {
    hamburger_cross();
  });

  function hamburger_cross() {
    if (isClosed == true) {
      overlay.hide();
      trigger.removeClass("is-open");
      trigger.addClass("is-closed");
      isClosed = false;
    } else {
      overlay.show();
      trigger.removeClass("is-closed");
      trigger.addClass("is-open");
      isClosed = true;
    }
  }

  $('[data-toggle="offcanvas"]').click(function () {
    $("#wrapper").toggleClass("toggled");
  });

  $(".modal#fill_na #categorical").css("display", "none");
  $(".modal#fill_na #numerical").css("display", "none");

  $("#fill_na .modal-body input[type=radio][name=col_type]").change(
    function () {
      if (this.value === "cat") {
        $(".modal#fill_na #form")[0].reset();
        $(this).prop("checked", true);
        $(".modal#fill_na #modenum").prop("checked", false);
        $(".modal#fill_na #numerical").css("display", "none");
        $(".modal#fill_na #categorical").css("display", "block");
      } else if (this.value === "num") {
        $(".modal#fill_na #form")[0].reset();
        $(this).prop("checked", true);
        $(".modal#fill_na #modecat").prop("checked", false);
        $(".modal#fill_na #categorical").css("display", "none");
        $(".modal#fill_na #numerical").css("display", "block");
      }
    }
  );

  $(".modal-search-Input").keyup(function () {
    var $input = $(this);
    filter = $input.val().toUpperCase();
    var ul = $(this).next(".modal-ul");
    var li = ul.find("li");

    for (i = 0; i < li.length; i++) {
      la = li[i].getElementsByTagName("label")[0];
      txtValue = la.textContent || la.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  });
});

function corrSub(event) {
  $("#loaderCorr").css("display", "block");
  event.preventDefault();
  var column = [];

  $("#corrMat input[name=corrColumn]:checked").each(function (col) {
    column.push($(this).val());
  });
  $.ajax({
    url: "/corr_matrix",
    type: "post",
    data: {
      column: column,
    },
    success: function (response) {
      var layout = {
        title: {
          text: "CORRELATION GRAPH",
          font: {
            size: 22,
          },
        },
        showlegend: true,
        legend: {
          bgcolor: "#ededed",
        },
      };

      var config = {
        scrollZoom: true,
        displayModBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: [
          "lasso2d",
          "zoomIn2d",
          "zoomOut2d",
          "pan3d",
          "select2d",
          "orbitRotation",
          " tableRotation",
          "handleDrag3d",
          "resetCameraDefault3d",
          "resetCameraLastSave3d",
          "hoverClosest3d",
          "zoomInGeo",
          "zoomOutGeo",
          "resetGeo",
          "hoverClosestGeo",
          "sendDataToCloud",
          "toggleSpikelines",
          "resetViewMapbox",
          "hoverClosestGl2d",
          "hoverClosestPie",
          "toggleHover",
          "resetViews",
        ],
      };

      var data = [
        {
          z: response.reverse(),
          x: column,
          y: column.slice().reverse(),
          type: "heatmap",
        },
      ];
      $("#corrIcon").css("display", "none");

      Plotly.newPlot("corrGraph", data, layout, config);
      $("#loaderCorr").css("display", "none");
    },
  });
}

function selectall(input, name) {
  var checked = input.checked;

  var classname = "input[name=" + name + "]";

  $(classname).each(function () {
    this.checked = checked;
  });
}

function run() {
  $("#iconPca").css("display", "none");
  $("#loaderPca").css("display", "block");

  $.ajax({
    url: "/pca",
    type: "post",
    success: function (response) {
      var data = [
        {
          x: response.columnNames,
          y: response.values,
          type: "bar",
        },
      ];

      Plotly.newPlot("pcaGraph", data);
      $(".pcaRec").html("Keep First " + response.keep + " Columns");
      $("#pcaDiv").css("display", "block");
      $("#pcaGraph").css("display", "block");

      $("#loaderPca").css("display", "none");

      $("#pca").on("hidden.bs.modal", function () {
        location.reload();
      });
    },
  });
}

function getFileContent() {
  var x = document.getElementById("file");
  document.getElementById("contentName").innerHTML = x.value.split("\\").pop();
}
