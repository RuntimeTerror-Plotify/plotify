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

  $("#drop_row #modeofdroprow input[type=radio][name=mode]").change(function(){
    if(this.value === "specific"){
        $("#drop_row #specific").css("display","block");
    }else if(this.value === "all"){
        $("#drop_row #specific").css("display","none");
    }
  });
  
});

function corrSub(event) {
  event.preventDefault();
  var column = [];

  $("#corrMat input[name=corrColumn]:checked").each(function (col) {
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



    
    