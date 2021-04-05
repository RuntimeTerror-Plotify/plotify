$(document).ready(function () {
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
       isClosed = false;
  
      trigger.click(function () {
        hamburger_cross();      
      });
  
      function hamburger_cross() {
  
        if (isClosed == true) {          
          overlay.hide();
          trigger.removeClass('is-open');
          trigger.addClass('is-closed');
          isClosed = false;
        } else {   
          overlay.show();
          trigger.removeClass('is-closed');
          trigger.addClass('is-open');
          isClosed = true;
        }
    }
    
    $('[data-toggle="offcanvas"]').click(function () {
          $('#wrapper').toggleClass('toggled');
    });  
  });
  
  
  
  
      $('#catLabels input[type=radio]').change(function () {
          // When any radio button on the page is selected,
          // then deselect all other radio buttons.
          $('#catLabels input[type=radio]:checked').not(this).prop('checked', false);
      });
  
  
      function corrSub(event) {
          event.preventDefault();
          console.log("here");
          var column = [];
          $('#corrMat input[type=checkbox]:checked').each(function (col) {
              column.push($(this).val());
          });
          console.log(column);
  
          $.ajax({
              url: '/corr_matrix',
              type: 'post',
              data: {
                  column: column,
              },
              success: function (response) {
                  var data = [{
                      z: response.reverse(),
                      x: column,
                      y: column.slice().reverse(),
                      type: 'heatmap'
                  }];
  
                  Plotly.newPlot('myDiv', data);
              }
          });
  
      }