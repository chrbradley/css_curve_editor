// let the endpoints and toggle status be accessed outside of their own scope
var $endpoints, toggled, draggable;
// PAGE LOAD
$(function() {
  // Show handles at the beginning
  toggled = true;
  // set the context to canvas
  var ctx = $("#bezierCurve").get(0).getContext("2d");
  // find initial endpoints
  $endpoints = $(".knob.endpoint");
  // find the point at which the canvas starts
  var winwidth = window.innerWidth;
  var conwidth = $('.container').innerWidth();
  var contain = (winwidth - conwidth) / 2 + 10;
  
  // allow all knobs to be dragged
  draggable = function() {
    $(".knob").draggable({
        // do not let knobs be dragged outside of the canvas
        containment: [contain, 190, contain + 800, 590],
        // on drag, render the canvas
        drag: function(event, ui) {
            render(ctx);
        },
        // on stop, render the canvas
        stop: function(){
            render(ctx);
        }
    });
  };
  // render the canvas with the endpoints 
  render(ctx);
  draggable();

// --------------------- CLICK EVENTS --------------------------//

  // ------ CANVAS CLICK -------//
  $('.coordinate-plane').on('click', function(event){
    // if the alt key was pressed on click, create node at correct spot
    if (event.altKey) {
      // create dom element
      var element = $('<div class="knob endpoint"><span class="knob handle left"></span><span class="knob handle right"></span></div>');
      // if the handles are set to hidden
      if(!toggled) {
        // add appropriate class to element
        element.addClass('hide-handle');
      }
      // find the position of the click, relative to the canvas
      var offSet = $(this).offset();
      var relX = event.pageX - offSet.left;
      var relY = event.pageY - offSet.top;
      //finding the one to the right
      var theOne;
      //goes through and find the one to the right
        // if found, inserts before, if not adds to the end of endpoints
      $endpoints.each(function(index){
        if( $($endpoints[index]).position().left > relX ){
          theOne = $($endpoints[index]);
          element.insertBefore(theOne).css({"left": relX, "top": relY});
          return false;
        } else {
          theOne = $($endpoints[index]);
          element.insertAfter(theOne).css({"left": relX, "top": relY});
        }
      });
      // if no endpoints in the array
      if( $endpoints.length === 0){
        // add endpoint
        element.appendTo($('.coordinate-plane')).css({"left": relX, "top": relY});
      }
      // find updated list of endpoints, render
      $endpoints = $(".knob.endpoint");
      render(ctx);
      // allow to be dragged
      draggable();
    }

  });

  // -------- ENDPOINT CLICK --------- //
  $('body').on('click', '.knob.endpoint', function() {
    // if shift key is pressed, delete node
    if (event.shiftKey) {
      // delete node
      $(this).remove();
      // find endpoints and rerender
      $endpoints = $(".knob.endpoint");
      render(ctx);
    }
  });

  // -------- BUTTON CLICK --------- //
  $('#button').on('click', function(){
    // toggle handles on and off
    toggled = !toggled;
    $endpoints.toggleClass('hide-handle');
    // rerender with no handles
    render(ctx);
  });
});

// --------------------------- FUNCTIONS --------------------------- //
function render(ctx) {
  // clear canvas
  ctx.clearRect(0,0,800,400);
  // start line
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#4682B4";
  // for each endpoint in list
  $endpoints.each(function(index, point){
    // if there is an endpoint after it
    if ($endpoints[index + 1]){
      // jQuery select current and next points
      $point = $(point);
      $next = $($endpoints[index + 1]);
      // move to the current point's position on the canvas
      ctx.moveTo($point.position().left + 5,$point.position().top -4);
      // make a curve using the point's right handle's position
      ctx.bezierCurveTo($point.children('.right').position().left + $point.position().left,
                        $point.children('.right').position().top + $point.position().top - 9,
                        // the next point's left handle's position
                        $next.children('.left').position().left + $next.position().left,
                        $next.children('.left').position().top + $next.position().top - 9,
                        // and the next point's position on the canvas
                        $next.position().left + 5,
                        $next.position().top - 4);

      // draw the curve from point to next point
      ctx.stroke();
    }
  });    // ---------------------- END OF ZACH'S COMMENTS, BEGINNING OF HUY'S COMMENTS -----------------------//

    ctx.closePath();
    if(toggled) {
      ctx.beginPath();
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;

      $endpoints.each(function(index, point){
        $point = $(point);
        $point.children().each(function(index, child){
          $child = $(child);

          ctx.moveTo($point.position().left + 5,$point.position().top - 4);

          ctx.lineTo($child.position().left  + $point.position().left + 5,
                     $child.position().top  + $point.position().top - 13);

          ctx.stroke();
        });
      });

      ctx.closePath();
    }

    keyframes();
    $('#ball').remove();
    $('<div id="ball"></div>').css({
      '-webkit-animation-duration': '3s',
      '-webkit-animation-iteration-count': 'infinite',
      '-webkit-animation-name': 'bounce'
    }).prependTo('#ballWrapper');
}

function keyframes() {
  var html = [ "@-webkit-keyframes bounce {" ];
  var first = $($endpoints[0]).position().left;
  var last = $($endpoints[$endpoints.length-1]).position().left;
  var total = last - first;

  $endpoints.each(function(index, point){
    if ($endpoints[index - 1]){

      var $point = $(point);
      var $prev = $($endpoints[index - 1]);
      //distance from this node to the next
      var diffonX = $point.position().left - $prev.position().left;
      var diffonY = $point.position().top - $prev.position().top;
      var coef = 1;
      if(diffonY < 0){
        coef = -1;
        diffonY = Math.abs( diffonY );
      }

      //older equation
      var positionY = Math.abs( ($point.position().top - 4) / 4 - 100); //400 - 
      var currentPositionX = $point.position().left - first;
      var percentage = Math.round( (currentPositionX / total) * 100 );

      var cubic = [];
      var prevRightX = $prev.children('.right').position().left;
          prevRightX = parseFloat( (prevRightX + 4) / diffonX ).toFixed(2);

      var prevRightY = $prev.children('.right').position().top * coef;
          prevRightY = parseFloat( (prevRightY + 9) / diffonY ).toFixed(2);

      var currentLeftX = diffonX + $point.children('.left').position().left;
          currentLeftX = parseFloat( (currentLeftX + 1) / diffonX ).toFixed(2);

      var currentRightY = diffonY + $point.children('.left').position().top * coef;
          currentRightY = parseFloat( (currentRightY + 9) / diffonY ).toFixed(2);
      cubic.push(prevRightX, prevRightY, currentLeftX, currentRightY);

      html.push(percentage + "%  {");
      html.push("bottom: " + positionY + "%;");
      html.push("-webkit-animation-timing-function: cubic-bezier(" + cubic.join(",") + ");");
      html.push("}");
    } else {
      var $point = $(point);
      var positionY = Math.abs( ($point.position().top - 4) / 4 - 100); //400 - 

      html.push("0%  {");
      html.push("bottom: " + positionY + "%;");
      html.push("}");
    }
  });
  html.push("}");

  $("#cssData").html( html.join( "<br>" ) );
  $('#keyFrames').text(html.join(" "));
}