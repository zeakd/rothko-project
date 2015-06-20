//Rothko Project
//
//drawingKit
//
//zeakd

(function(){
var isNodeModule = typeof module !== 'undefined' && module.exports;
var isRequirejs = typeof define === 'function' && define.amd;
    
var Canvas;
    
/* Constructor Setting */
if(isNodeModule){
    var Canvas = require("canvas");   
    Image = Canvas.Image;
}else {
    var Canvas = function(width, height){
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}
    
    
