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
    });
    // ---------------------- END OF ZACH'S COMMENTS, BEGINNING OF HUY'S COMMENTS -----------------------//
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