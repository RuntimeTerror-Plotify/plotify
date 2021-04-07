$(document).ready(function () {
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
});

function corrSub(event) {
  event.preventDefault();
  var column = [];
  $("#corrMat input[type=checkbox]:checked").each(function (col) {
    column.push($(this).val());
  });
  console.log(column);
  $.ajax({
    url: "/corr_matrix",
    type: "post",
    data: {
      column: column,
    },
    success: function (response) {
      var data = [
        {
          z: response.reverse(),
          x: column,
          y: column.slice().reverse(),
          type: "heatmap",
        },
      ];

      Plotly.newPlot("corrGraph", data);
    },
  });
}

// $(".selectall").click(function () {
//   var checked = this.checked;
//   var classname = "input[name=" + this.value + "]";
//   $(classname).each(function () {
//     this.checked = checked;
//   });
// });

function selectall(input, name) {
  var checked = input.checked;

  var classname = "input[name=" + name + "]";

  $(classname).each(function () {
    this.checked = checked;
  });
}

// function searchFunction() {
//   var input, filter, ul, li, la, i, txtValue;
//   input = document.getElementById("modal-search-Input");
//   filter = input.value.toUpperCase();
//   ul = document.getElementById("modal-ul");
//   li = ul.getElementsByTagName("li");

// for (i = 0; i < li.length; i++) {
//   la = li[i].getElementsByTagName("label")[0];
//   txtValue = la.textContent || la.innerText;
//   if (txtValue.toUpperCase().indexOf(filter) > -1) {
//     li[i].style.display = "";
//   } else {
//     li[i].style.display = "none";
//   }
// }
// }

$("#modal-search-Input").keyup(function () {
  var $input = $("#modal-search-Input");
  filter = $input.val().toUpperCase();
  console.log(filter);
  var ul = $("#modal-ul");
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

function run() {
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

      $("#pcaDiv").css("display", "block");
    },
  });
}
