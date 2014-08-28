var $p0, $p1, $p2, $p3, box, $customBezier, $cubicBezier;



// point = {
//   leftHandle = 'node';
//   rightHandle = node;
// };








$(function() {

    var ctx = $("#bezierCurve").get(0).getContext("2d");
    
    box = $(".box").get(0);
    var endpoints = $(".knob.endpoint");
    $p0 = $(endpoints[0]);
    $p1 = $p0.children('.right');
    $p3 = $(endpoints[1]);
    $p2 = $p3.children('.left');
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
    var p0 = $p0.position(), // endpoint 1
        p1 = $p1.position(),  // midpoint
        p2 = $p2.position(),  // midpoint
        p3 = $p3.position(); // endpoint 2
    render(ctx, {                                   // function render(ctx, start, [midpoints], end)
        x: p0.left,
        y: p0.top
    },{
        x: p0.left + p1.left,
        y: p0.top + p1.top
    }, {
        x: p2.left + p3.left,
        y: p2.top + p3.top
    }, {
        x: p3.left,
        y: p3.top
    });
};

function render(ctx, p0, p1, p2, p3) {
    var ctx = ctx;
    ctx.clearRect(0,0,400,400);
    
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#333";
    ctx.moveTo(p0.x + 5,p0.y + 5);
    // p1 (x,y) p2 (x,y)
    ctx.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,p3.x+5,p3.y+5);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.moveTo(p0.x + 5, p0.y + 5);
    // p1 (x,y)
    ctx.lineTo(p1.x + 5, p1.y + 5);
    ctx.stroke();
    
    ctx.moveTo(p3.x + 5, p3.y + 5);
    // p2 (x,y)
    ctx.lineTo(p2.x + 5, p2.y + 5 );
    ctx.stroke();
    ctx.closePath();
        
    // if($.browser.mozilla) {
    //     $(".p1X").html( adjustValue( (p1.x) / 400) );
    //     $(".p1Y").html( adjustValue( 1 - (p1.y) / 400) );
    //     $(".p2X").html( adjustValue( (p2.x) / 400) );
    //     $(".p2Y").html( adjustValue( 1 - (p2.y) / 400) );
    // } else {
        $(".p1X").html( adjustValue( (p1.x + 5) / 400) );
        $(".p1Y").html( adjustValue( 1 - (p1.y + 4) / 400) );
        $(".p2X").html( adjustValue( (p2.x + 5) / 400) );
        $(".p2Y").html( adjustValue( 1 - (p2.y + 4) / 400) );
    // }
    
}
