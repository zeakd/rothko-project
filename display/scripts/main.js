//console.log('hello');
//
//var img = new Image()
//var c;
//img.src = 'images/DanielGarber_StudentsPainting.jpg';
//img.onload = function(){
//    c = drawingKit.createCanvasByImage(img);
//    var shell = document.getElementById('shell');
//    shell.appendChild(c);
//};
var colors = new Colorlist();
//colors
var PI = Math.PI
var RAD2DEG = 180 / PI;
var DEG2RAD = PI / 180;

var pow = Math.pow;
var round = Math.round;
var cos = Math.cos;
var sin = Math.sin;
function roundDecimal(num,count){
    var dec = pow(10, count);
    return round(num*dec)/dec;
}

function isObject(obj) {
    return typeof obj === 'object';   
}

function hsv2rgb(h, s, v) {
    var r, g, b;
    if(typeof h === 'object') {
        hsv = h;
        h = hsv.h;
        s = hsv.s;
        v = hsv.v;
    }
    if( s === 0 ) {
		r = g = b = v;
	} else {
        h /= 60;
        var i,
            f, 
            p, 
            q, 
            t;    
        i = h | 0           // Math.floor(h);
        f = h - i;			// factorial part of h
        p = v * ( 1 - s );
        q = v * ( 1 - s * f );
        t = v * ( 1 - s * ( 1 - f ) );
        switch( i ) {
            case 6:
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:		// case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
    }
    return {
        r: r * 255,
        g: g * 255,
        b: b * 255,
    }
}

function rgb2xyz(r,g,b) {
    if( isObject(r) ){
        g = r.g;
        b = r.b;
        r = r.r;
    }
    function linear(t) {
        if ((t /=255) <= 0.04045) {
            return t / 12.92;
        } else {
            return pow((t + 0.055) / 1.055, 2.4);   
        }
    }
    r = linear(r);
    g = linear(g);
    b = linear(b);
    return {
        x: roundDecimal(0.412456*r + 0.357576*g + 0.180438*b, 6),
        y: roundDecimal(0.212673*r + 0.715152*g + 0.072175*b, 6),
        z: roundDecimal(0.019334*r + 0.119192*g + 0.950304*b, 6)
    }
}
function xyz2rgb(x,y,z){
    if( isObject(x) ) {
        y = x.y;
        z = x.z;
        x = x.x;
    }
    return {
        r:  roundDecimal(( 3.240454*x + -1.537139*y + -0.498531*z), 6) * 255,
        g:  roundDecimal((-0.969266*x +  1.876011*y +  0.041556*z), 6) * 255,
        b:  roundDecimal(( 0.055643*x + -0.204026*y +  1.057225*z), 6) * 255
    }
}
var CONSTANTS = {
    LAB : {
        Xn: 0.950470,
        Yn: 1,
        Zn: 1.088830,
        t0: 0.008856,
        d: 0.206896,
        k: 903.30
    }
}   
function xyz2lab(x,y,z) {
     if( isObject(x) ) {
        y = x.y;
        z = x.z;
        x = x.x;
    }
    function f(t) {
        return t > CONSTANTS.LAB.t0 ? pow(t, 1/3) : (CONSTANTS.LAB.k*t + 16) / 116;
    }
    var fx = f(x/CONSTANTS.LAB.Xn);
    var fy = f(y/CONSTANTS.LAB.Yn);
    var fz = f(z/CONSTANTS.LAB.Zn);
    return {
        l: roundDecimal(116 * fy - 16,   6),
        a: roundDecimal(500 * (fx - fy), 6),
        b: roundDecimal(200 * (fy - fz), 6)
    }
}
function lab2xyz(l,a,b) {
    if( isObject(l) ) {
        a = l.a;
        b = l.b;
        l = l.l;
    }
    function r(t) {
        var ttt = t*t*t;
        return ttt > CONSTANTS.LAB.t0 ? ttt : (116 * t - 16) / CONSTANTS.LAB.k;
    }
    var fy = (l+16)/116;
    var fx = fy + (a/500);
    var fz = fy - (b/200);
    
    return {
        x: roundDecimal(r(fx) * CONSTANTS.LAB.Xn, 6),
        y: roundDecimal(r(fy) * CONSTANTS.LAB.Yn, 6),
        z: roundDecimal(r(fz) * CONSTANTS.LAB.Zn, 6)
    }
}
function lab2lch(l,a,b) {
    if( isObject(l) ) {
        a = l.a;
        b = l.b;
        l = l.l;
    }
    var sqrt = Math.sqrt;
    var atan2 = Math.atan2;
    return {
        l: l,
        c: sqrt(a*a + b*b),
        h: (atan2(b,a)*RAD2DEG + 360) % 360
    }
}
function lch2lab(l,c,h) {
    if( isObject(l) ) {
        c = l.c;
        h = l.h;
        l = l.l;
    }
    return {
        l: l,
        a: c * cos(h * DEG2RAD),
        b: c * sin(h * DEG2RAD)
    }
}
var Canvas = drawingKit.Canvas;
var isCanvas = drawingKit.isCanvas;
//var isCtx = drawingKit.isCtx;
function Wheel(colors){
    
    var CANVAS_WIDTH = this.CANVAS_WIDTH = 500;
    var CANVAS_HEIGHT = this.CANVAS_HEIGHT = 500;
    this.RADIUS = CANVAS_WIDTH/2;
    
    var wheel = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    wheel.className = "wheel"
    this.canvas = function() {
        return wheel;
    }
    return this;
}
Wheel.prototype.setPixel = function(x,y,r,g,b,a){
    var dkSetPixel = drawingKit.setPixel;
    var sqrt = Math.sqrt;
    var pow = Math.pow;
    var asin = Math.asin;
    var radius = sqrt(pow(x-this.RADIUS,2) + pow(y-this.RADIUS,2));
    if(radius <= this.RADIUS) { 
        drawingKit.setPixel(this.canvas(), x, y, r, g, b, a);   
    }
    
}
Wheel.prototype.setPixelLooper = function(controller) {
    for( var x = this.CANVAS_WIDTH; x >= 0; x--) {
        for (var y = this.CANVAS_HEIGHT; y >= 0; y--) {
            controller(x,y);    
        }
    }
}


var hsvWheel = new Wheel();
var lchWheel = new Wheel();
var dCompareWheel = document.getElementById('compare-wheel');
dCompareWheel.appendChild(hsvWheel.canvas());
dCompareWheel.appendChild(lchWheel.canvas());
//hsvWheel.setPixelLooper(function(x,y){
//    var PI = Math.PI;
//    var sqrt = Math.sqrt;
//    var pow = Math.pow;
//    var radius = sqrt(pow(x-this.RADIUS,2) + pow(y-this.RADIUS,2));
//    var rad = Math.atan2(y-this.RADIUS, x-this.RADIUS),
//        h = rad * 180 / PI + 180,
//        s = radius/this.RADIUS,
//        v = 1;
//    var rgb = hsv2rgb(h, s, v);
//    this.setPixel(x, y, rgb);
//}.bind(hsvWheel));
var l = 0;
fillBackground(hsvWheel.canvas(), '#ffffff');
fillBackground(lchWheel.canvas(), '#ffffff');
hsvWheel.setPixelLooper(testHsv(l/100).bind(hsvWheel));
lchWheel.setPixelLooper(testLch(l).bind(lchWheel));
//var id = setInterval(function(){
//    if( l > 100){ clearInterval(id); }
//    fillBackground(hsvWheel.canvas(), '#ffffff');
//    fillBackground(lchWheel.canvas(), '#ffffff');
//    hsvWheel.setPixelLooper(testHsv(l/100).bind(hsvWheel));
//    lchWheel.setPixelLooper(testLch(l).bind(lchWheel));
//    l+= 5;
//}, 2000);
//setTimeout( function (){
//    var run = false;
//    for( var l = 0; l<= 100; ){
//        if( run ){
//            continue;
//        } else {
//            run = true;
//            setInterval( function(){
//        //            setTimeout(function(){
//
//                        lchWheel.setPixelLooper(testLch(l).bind(lchWheel));
//                        run = false;
//                        l+= 10;
//        //            }, 5000);
//            }, 5)    
//        }
//    }
//}, 50);
//lchWheel.setPixelLooper(function(x,y){
//    var PI = Math.PI;
//    var sqrt = Math.sqrt;
//    var pow = Math.pow;
//    var radius = sqrt(pow(x-this.RADIUS,2) + pow(y-this.RADIUS,2));
//    var rad = Math.atan2(y-this.RADIUS, x-this.RADIUS),
//        h = rad * 180 / PI + 180,
//        c = Math.round(radius/this.RADIUS * 100),
//        l = 50;
//    if( c > 100 ) { c = 100 };
//    var lab = lch2lab(l, c, h);
//    var xyz = lab2xyz(lab);
//    var rgb = xyz2rgb(xyz);
//    this.setPixel(x, y, rgb);
//}.bind(lchWheel));


function testLch(l){
    return function(x,y) {
        var PI = Math.PI;
        var sqrt = Math.sqrt;
        var pow = Math.pow;
        var radius = sqrt(pow(x-this.RADIUS,2) + pow(y-this.RADIUS,2));
        var rad = Math.atan2(y-this.RADIUS, x-this.RADIUS),
            h = rad * 180 / PI + 180,
            c = Math.round(radius/this.RADIUS * 100);
        if( c > 100 ) { c = 100 };
        var lab = lch2lab(l, c, h);
        var xyz = lab2xyz(lab);
        var rgb = xyz2rgb(xyz);
        this.setPixel(x, y, rgb);
    }
}
function testHsv(v){
    return function(x,y){
        var PI = Math.PI;
        var sqrt = Math.sqrt;
        var pow = Math.pow;
        var radius = sqrt(pow(x-this.RADIUS,2) + pow(y-this.RADIUS,2));
        var rad = Math.atan2(y-this.RADIUS, x-this.RADIUS),
            h = rad * 180 / PI + 180,
            s = radius/this.RADIUS;
//            v = 1;
        var rgb = hsv2rgb(h, s, v);
        this.setPixel(x, y, rgb);
    }
}

function fillBackground(canvas, color){
    if(!isCanvas(canvas)) {
        console.error("fillBackground: not Canvas");
    }
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0,0,canvas.width, canvas.height);
}
