var $endpoints, toggled;

$(function() {
    toggled = true;
    var ctx = $("#bezierCurve").get(0).getContext("2d");
    $endpoints = $(".knob.endpoint");
    render(ctx);
    var winwidth = window.innerWidth;
    var conwidth = $('.container').innerWidth();
    var contain = (winwidth - conwidth) / 2 + 10;
    $(".knob").draggable({
        containment: [contain, 190, contain + 800, 590],
        drag: function(event, ui) {
            render(ctx);
        },
        stop: function(){
            render(ctx);
        }
    });
//----------------------add-----------------------------*
    $('.coordinate-plane').on('click', function(event){
      //added alt key event
      if (event.altKey) {

        var element = $('<div class="knob endpoint"><span class="knob handle left"></span><span class="knob handle right"></span></div>');
        //counted for offset
        if(!toggled) {
          element.addClass('hide-handle');
        }
        var offSet = $(this).offset();
        var relX = event.pageX - offSet.left;
        var relY = event.pageY - offSet.top;
        //finding the one to the right
        var theOne;
        //goes through and find the one to the right
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

        if( $endpoints.length === 0){
          element.appendTo($('.coordinate-plane')).css({"left": relX, "top": relY});
        }
        //these needs to be copy here
        $endpoints = $(".knob.endpoint");
        render(ctx);

        //this needs to be copy here
        
        $(".knob").draggable({
            containment: '.coordinate-plane',
            drag: function(event, ui) {
                render(ctx);
                // setDemoValue();
            },
            stop: function(){
                render(ctx);
                // setTransitionFn();
                // setDemoValue();
            }
        });
      }

    });
//------------------delete--------------------------------*
    $('body').on('click', '.knob.endpoint', function() {
      if (event.shiftKey) {
        $(this).remove();
        //this needs to be copy here
        $endpoints = $(".knob.endpoint");
        render(ctx);
      }
    });
//----------------button click-----------------------------------*
  $('#button').on('click', function(){
    toggled = !toggled;
    $endpoints.toggleClass('hide-handle');
    render(ctx);
  });
});

function adjustValue(val) {
    val = val.toFixed(2);
    val = val.toString().replace("0.", ".").replace("1.00", "1").replace(".00", "0");
    return val;
}

function render(ctx) {
    ctx.clearRect(0,0,800,400);
    
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#4682B4";

    $endpoints.each(function(index, point){
      if ($endpoints[index + 1]){

        $point = $(point);
        $next = $($endpoints[index + 1]);

        ctx.moveTo($point.position().left + 5,$point.position().top -4);

        ctx.bezierCurveTo($point.children('.right').position().left + $point.position().left,
                          $point.children('.right').position().top + $point.position().top - 9,
                          $next.children('.left').position().left + $next.position().left,
                          $next.children('.left').position().top + $next.position().top - 9,
                          $next.position().left + 5,
                          $next.position().top - 4);
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
    //if not the first node
    if ($endpoints[index - 1]){

      //defining current and prev node
      var $point = $(point);
      var $prev = $($endpoints[index - 1]);
      //distance from current node and prev node
      var diffonX = $point.position().left - $prev.position().left;
      var diffonY = $point.position().top - $prev.position().top;
      //setting coef to account for varying Y differences
      var coef = 1;
      if(diffonY < 0){
        coef = -1;
        diffonY = Math.abs( diffonY );
      }

      //defining Y position relative to bottom; bottom most is equal to 0, top being 100
      var positionY = Math.abs( ($point.position().top - 4) / 4 - 100);
      //defining X position in percentage relative to the range (from first node to last node)
      var currentPositionX = $point.position().left - first;
      var percentage = Math.round( (currentPositionX / total) * 100 );

      //storage for our cubic bezier curve parameters
      var cubic = [];
      //parameters: prevRightX and prevRightY are the right knob from the prev node
      var prevRightX = $prev.children('.right').position().left;
          prevRightX = parseFloat( (prevRightX + 4) / diffonX ).toFixed(2);

      var prevRightY = $prev.children('.right').position().top * coef;
          prevRightY = parseFloat( (prevRightY + 9) / diffonY ).toFixed(2);
      //parameters: currentLeftX and currentLeftY are the right knob from the prev node
      var currentLeftX = diffonX + $point.children('.left').position().left;
          currentLeftX = parseFloat( (currentLeftX + 1) / diffonX ).toFixed(2);

      var currentLeftY = diffonY + $point.children('.left').position().top * coef;
          currentLeftY = parseFloat( (currentLeftY + 9) / diffonY ).toFixed(2);
      //pushing our parameters into our storage to be used later
      cubic.push(prevRightX, prevRightY, currentLeftX, currentLeftY);
      //add to html element to display CSS key frames
      html.push(percentage + "%  {");
      html.push("bottom: " + positionY + "%;");
      html.push("-webkit-animation-timing-function: cubic-bezier(" + cubic.join(",") + ");");
      html.push("}");
    //if it is the first node
    } else {
      var $point = $(point);
      var positionY = Math.abs( ($point.position().top - 4) / 4 - 100); //400 - 
      //add to html element with no animation
      html.push("0%  {");
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