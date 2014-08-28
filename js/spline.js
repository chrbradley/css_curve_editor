var $p0, $p1, $p2, $p3, box, $customBezier, $cubicBezier, $endpoints, $start, $end;



// point = {
//   leftHandle = 'node';
//   rightHandle = node;
// };








$(function() {

    var ctx = $("#bezierCurve").get(0).getContext("2d");
    
    box = $(".box").get(0);
    $endpoints = $(".knob.endpoint");
    $start = $($endpoints[0]);

    // somehow get midpoints

    $end = $($endpoints[$endpoints.length - 1]);
    // $p0 = $(endpoints[0]);
    // $p1 = $p0.children('.right');
    // $p3 = $(endpoints[1]);
    // $p2 = $p3.children('.left');
    $customBezier = $("#customBezier");
    $cubicBezier = $("#cubicBezier");
    
    render(ctx);
    // setTransitionFn();
    // setDemoValue();
    
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
    
    $(".canned-function").click(function(e) {
        e.preventDefault();
        var vals = $(this).attr("-data-easing").split(",");
        $p1.css("left", vals[0] * 400);
        $p1.css("top",  (1 - vals[1]) * 400);
        $p2.css("left", vals[2] * 400);
        $p2.css("top",  (1 - vals[3]) * 400);
        render(ctx);
        // setTransitionFn();
        // setDemoValue();
    });
    
    $("#animateBox").click(function(e){
        e.preventDefault();
        var $body = $("body");
        
        $body.addClass("moveBox");
        
        setTimeout(function() {
            $body.removeClass("moveBox");
            // console.log($(".box").get(1).style.webkitTransition)
        }, 2000);
    });
//----------------------add-----------------------------*
    $('.coordinate-plane').on('click', function(event){
      //added alt key event
      if (event.altKey) {

        var element = $('<div class="knob endpoint"><span class="knob left"></span><span class="knob right"></span></div>');
        //counted for offset
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
//---------------------------------------------------------*
});

// function setDemoValue() { 
//     $customBezier.html($cubicBezier.text());
// }

// function setTransitionFn() {
//     box.style.webkitTransition = "left 1s cubic-bezier(" + $("#p1X").html() + "," + $("#p1Y").html() + ","+$("#p2X").html() + "," + $("#p2Y").html() + ")";
//     box.style.MozTransition = "left 1s cubic-bezier(" + $("#p1X").html() + "," + $("#p1Y").html() + ","+$("#p2X").html() + "," + $("#p2Y").html() + ")";
// }

// this just removes leading 0 and truncates values
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




    ctx.closePath();
    
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
        
    // if($.browser.mozilla) {
    //     $(".p1X").html( adjustValue( (p1.x) / 400) );
    //     $(".p1Y").html( adjustValue( 1 - (p1.y) / 400) );
    //     $(".p2X").html( adjustValue( (p2.x) / 400) );
    //     $(".p2Y").html( adjustValue( 1 - (p2.y) / 400) );
    // } else {
        // $(".p1X").html( adjustValue( (p1.x + 5) / 400) );
        // $(".p1Y").html( adjustValue( 1 - (p1.y + 4) / 400) );
        // $(".p2X").html( adjustValue( (p2.x + 5) / 400) );
        // $(".p2Y").html( adjustValue( 1 - (p2.y + 4) / 400) );
    // }
    
}



function keyframes(ctx) {
  
}

// @keyframes CUSTOMIZABLE {
//     0% { // position of endpoint on x
//         top: //position of endpoint on y;
//         animation-timing-function: cubic-bezier(
//             x1, // current right nob x
//             y1, // current right nob y
//             x2, // next left nob x
//             y2  // next right nob y
//         );
//     }
//     50% {
//         top: 140px;
//         animation-timing-function: cubic-bezier(x1,y1, x2,y2);
//     }
//     55% {
//         top: 160px; 
//         animation-timing-function: cubic-bezier(x1,y1, x2,y2);
//     }
//     65% {
//         top: 120px; 
//         animation-timing-function: cubic-bezier(x1,y1, x2,y2);
//     }
//     95% {
//         top: 0;
//         animation-timing-function: cubic-bezier(x1,y1, x2,y2);
//     }
//     100% {
//         top: 0;
//         animation-timing-function: cubic-bezier(x1,y1, x2,y2);
//     }
// }