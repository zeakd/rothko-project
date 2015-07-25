if(typeof Canvas === 'undefined') {
    var Canvas = function(width, height){
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}

function isCanvas(elem) {
    return elem instanceof Canvas || elem instanceof HTMLCanvasElement;
}

var drawingKit = {
    Canvas : Canvas,
//    isCanvas : isNodeModule ? function(imageObj){
//        return imageObj instanceof Canvas;} 
//        : function(imageObj){cnv
//        return imageObj instanceof HTMLCanvasElement;
//    },
    isCanvas : isCanvas,
    isImage : function(imageObj){
        return imageObj instanceof Image || 
            imageObj.toString() === "[object HTMLImageElement]";   
    },
    
    setPixel : function(target, x, y, r, g, b, a){
        
        color = typeof r === 'object' ? r : {r: r, g: g, b: b, a: a};
        function makeNumber(raw) {
            var rounded = Math.round(raw);
//            if( rounded > 255 ) { rounded = 255; }
//            if( rounded < 0 ) { rounded = 0; }
            return rounded;
        }
        if( color.r > 255 || color.r < 0 ) return;
        if( color.g > 255 || color.g < 0 ) return;
        if( color.b > 255 || color.b < 0 ) return;
        color.r = makeNumber(color.r);
        color.g = makeNumber(color.g);
        color.b = makeNumber(color.b);

        color.a = typeof color.a === 'undefined' ? 255 : color.a;
        for(i in color){
            color[i] = color[i] | 0;   
        }
        if(target.constructor.name === "ImageData"){
            if(a < 1) parseInt( a * 255 );
            var index = (y * target.width + x) * 4;
            target.data[index + 0] = color.r;
            target.data[index + 1] = color.g;
            target.data[index + 2] = color.b;
            target.data[index + 3] = color.a;
        } else {
            if (isCanvas(target)) {
                target = target.getContext('2d');
            } 
            if(target.constructor.name === "CanvasRenderingContext2D") {
                target.fillStyle = 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';
                target.fillRect(x,y,1,1);
            } else {
                throw target;
            }
        }
    },
    /**
    * Add two numbers.
    * @param {object} target
    * @param {function} callback
    */
    pixelLooper: function(target, pixelController){
        imageData = isCanvas(target) ? 
            target
            .getContext('2d')
            .getImageData(0,0,target.width, target.height) : target;
        for(var x = 0; x < imageData.width; ++x){
            for(var y = 0; y < imageData.height; ++y){
                var index = (x + y * imageData.width) * 4;
                var r = imageData.data[index + 0];
                var g = imageData.data[index + 1];
                var b = imageData.data[index + 2];
                var a = imageData.data[index + 3];
                pixelController(x,y,r,g,b,a);
            }
        }
    },
    createCanvasByImage : function(img, pixelSaturate){
    //    console.log(__basename + " - function() createCanvasByImage start ...");
    //    console.log(img);
        var imgWidth = typeof img.naturalWidth !== "undefined" ? img.naturalWidth : img.width;
        var imgHeight = typeof img.naturalHeight !== "undefined" ? img.naturalHeight : img.height;
        var pixelNum = imgWidth * imgHeight;
        pixelSaturate = typeof pixelSaturate !== "undefined" ? pixelSaturate : pixelNum;    
        var pixelNumRate = pixelNum / pixelSaturate;

        var canvasWidth = imgWidth;
        var canvasHeight = imgHeight;

        if(pixelNumRate > 1){
//            console.log("resizing... pixcoelNumRate : " + pixelNumRate);
            var lengthRate =  Math.sqrt(pixelNumRate);
            canvasWidth = parseInt(canvasWidth/lengthRate);
            canvasHeight = parseInt(canvasHeight / lengthRate);
//            console.log("resizing result - canvasWidth : " + canvasWidth + ", canvasHeight : " + canvasHeight);
        }

        var rCanvas = new this.Canvas(canvasWidth, canvasHeight);
        var rCanvasCtx = rCanvas.getContext("2d");
        rCanvasCtx.drawImage(img, 0,0, imgWidth, imgHeight, 0,0, canvasWidth, canvasHeight);
    //    console.log(__basename + " - function() createCanvasByImage end");
        return rCanvas;
    },
    
    
    
    hex2Rgb : function(hex){    //#ff1234
        var r = parseInt(hex.slice(1,3),16);
        var g = parseInt(hex.slice(3,5),16);
        var b = parseInt(hex.slice(5,7),16);
        return {r: r, g: g, b: b, a: 255};
    },
    rgb2Hex : function(r,g,b){
        if(typeof r === 'object'){
            g = r.g;
            b = r.b;
            r = r.r;
        }
        function dec2HexStr(d){   
            var hStr = d.toString(16);
            return hStr.length === 1? "0" + hStr : hStr;
        }
        return "#"+dec2HexStr(r)+dec2HexStr(g)+dec2HexStr(b);
    }
};