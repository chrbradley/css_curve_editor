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
    
    renderWrap(ctx);
    setTransitionFn();
    setDemoValue();
    
    $(".knob").draggable({
        containment: '.coordinate-plane',
        drag: function(event, ui) {
            renderWrap(ctx);
            setDemoValue();
        },
        stop: function(){
            renderWrap(ctx);
            setTransitionFn();
            setDemoValue();
        }
    });
    
    $(".canned-function").click(function(e) {
        e.preventDefault();
        var vals = $(this).attr("-data-easing").split(",");
        $p1.css("left", vals[0] * 400);
        $p1.css("top",  (1 - vals[1]) * 400);
        $p2.css("left", vals[2] * 400);
        $p2.css("top",  (1 - vals[3]) * 400);
        renderWrap(ctx);
        setTransitionFn();
        setDemoValue();
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
});

function setDemoValue() { 
    $customBezier.html($cubicBezier.text());
}

function setTransitionFn() {
    box.style.webkitTransition = "left 1s cubic-bezier(" + $("#p1X").html() + "," + $("#p1Y").html() + ","+$("#p2X").html() + "," + $("#p2Y").html() + ")";
    box.style.MozTransition = "left 1s cubic-bezier(" + $("#p1X").html() + "," + $("#p1Y").html() + ","+$("#p2X").html() + "," + $("#p2Y").html() + ")";
}

// this just removes leading 0 and truncates values
function adjustValue(val) {
    val = val.toFixed(2);
    val = val.toString().replace("0.", ".").replace("1.00", "1").replace(".00", "0");
    return val;
}

function renderWrap(ctx) {
    // var p0 = $p0.position(), // endpoint 1
    //     p1 = $p1.position(),  // midpoint
    //     p2 = $p2.position(),  // midpoint
    //     p3 = $p3.position(); // endpoint 2
    render(ctx, $start,[], $end);
};

function render(ctx, start, midpoints, end) {
    var ctx = ctx;
    ctx.clearRect(0,0,400,400);
    
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#333";

    $endpoints.each(function(index, point){
      if ($endpoints[index + 1]){

        $point = $(point);
        $next = $($endpoints[index + 1]);

        ctx.moveTo($point.position().left + 5,$point.position().top + 5);

        ctx.bezierCurveTo($point.children('.right').position().left + $point.position().left,
                          $point.children('.right').position().top + $point.position().top,
                          $next.children('.left').position().left + $next.position().left,
                          $next.children('.left').position().top + $next.position().top,
                          $next.position().left + 5,
                          $next.position().top + 5);
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

        ctx.moveTo($point.position().left + 5,$point.position().top + 5);

        ctx.lineTo($child.position().left +5 + $point.position().left,
                   $child.position().top +5 + $point.position().top);

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
