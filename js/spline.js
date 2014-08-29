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
  //create a path from the current point back to the starting point
  ctx.closePath();
  //if handle bars are visible
  if(toggled) {
    //begin drawing the path
    ctx.beginPath();
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    //draw line from node to handles
    $endpoints.each(function(index, point){
      $point = $(point);
      $point.children().each(function(index, child){
        $child = $(child);
        //move to the node
        ctx.moveTo($point.position().left + 5,$point.position().top - 4);
        //creates a line from the node to the handles
        ctx.lineTo($child.position().left  + $point.position().left + 5,
                   $child.position().top  + $point.position().top - 13);
        //draws the path
        ctx.stroke();
      });
    });
    //create a path from the current point back to the starting point
    ctx.closePath();
  }
  //calls keyframes ( our bezier curve function )
  keyframes();
  //remove the old ball to get rid of animation
  $('#ball').remove();
  //create new ball with new animation
  $('<div id="ball"></div>').css({
    '-webkit-animation-duration': '3s',
    '-webkit-animation-iteration-count': 'infinite',
    '-webkit-animation-name': 'bounce'
  }).prependTo('#ballWrapper');
}

function keyframes() {
  //setting up our html element to display our CSS keyframes
  var html = [ "@-webkit-keyframes bounce {" ];
  //setting the range Y, defining first and last node to find distance
  //thus making it dynamic so the user does not have to be bounded
  var first = $($endpoints[0]).position().left;
  var last = $($endpoints[$endpoints.length-1]).position().left;
  var total = last - first;

  //bezierCurve formula
  $endpoints.each(function(index, point){
    //if the node has a next node
    if ($endpoints[index + 1]){

      //defining current and next node
      var $point = $(point);
      var $next = $($endpoints[index + 1]);
      //distance from current node and next node
      var diffonX = $next.position().left - $point.position().left;
      var diffonY = $next.position().top - $point.position().top;
      //setting coef to account for varying Y differences
      var coef = 1;
      if(diffonY < 0){
        coef = -1;
        diffonY = Math.abs( diffonY );
      }

      //defining Y position relative to bottom; bottom most is equal to 0, top being 100
      var positionY = Math.abs( ($point.position().top - 4) / 4 - 100);
      //defining X position in percentage relative to the range (from first node to last node)
      var pointPositionX = $point.position().left - first;
      var percentage = Math.round( (pointPositionX / total) * 100 );

      //storage for our cubic bezier curve parameters
      var cubic = [];
      //parameters: pointRightX and pointRightY are the right knob of the point node
      var pointRightX = $point.children('.right').position().left;
          pointRightX = parseFloat( (pointRightX + 4) / diffonX ).toFixed(2);

      var pointRightY = $point.children('.right').position().top * coef;
          pointRightY = parseFloat( (pointRightY + 9) / diffonY ).toFixed(2);
      //parameters: nextLeftX and nextLeftY are the left knob of the next node
      var nextLeftX = diffonX + $next.children('.left').position().left;
          nextLeftX = parseFloat( (nextLeftX + 1) / diffonX ).toFixed(2);

      var nextLeftY = diffonY + $next.children('.left').position().top * coef;
          nextLeftY = parseFloat( (nextLeftY + 9) / diffonY ).toFixed(2);
      //pushing our parameters into our storage to be used later
      cubic.push(pointRightX, pointRightY, nextLeftX, nextLeftY);
      //add to html element to display CSS key frames
      html.push(percentage + "%  {");
      html.push("bottom: " + positionY + "%;");
      html.push("-webkit-animation-timing-function: cubic-bezier(" + cubic.join(",") + ");");
      html.push("-moz-animation-timing-function: cubic-bezier(" + cubic.join(",") + ");");
      html.push("animation-timing-function: cubic-bezier" + cubic.join(",") + ");");
      html.push("}");
    //if it is the last node
    } else {
      var $point = $(point);
      var positionY = Math.abs( ($point.position().top - 4) / 4 - 100);
      //add to html element with no animation
      html.push("100%  {");
      html.push("bottom: " + positionY + "%;");
      html.push("}");
    }
  });
  //add closing brackets
  html.push("}");
  //set value of #cssData to our html (animation keyframes)
  $("#cssData").html( html.join( "<br>" ) );
  //change our animation to our animation keyframes
  $('#keyFrames').text(html.join(" "));
}