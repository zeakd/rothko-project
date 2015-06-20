// Rothko Project
//
// Rothko.js 
//
// zeakd

(function(factory){
    'use strict'
    var root = (typeof self == 'object' && self.self == self && self) ||
            (typeof global == 'object' && global.global == global && global);
    
    var isNodeModule = typeof module !== 'undefined' && module.exports;
    var isRequirejs = typeof define === 'function' && define.amd;
    /* Export and Constructor Setting */
    
    if(isNodeModule){
        var Canvas = require('canvas');
        var Image = Canvas.Image;
        var tc = require('tinycolor2');
        var kit = require('./dep/drawing-kit');
        var HA = require('./dep/histogram-analyze');
        module.exports = factory(Canvas, Image, tc, kit, HA);
        //Node module dependency
    }else {
        Canvas = function(width, height){
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        }   
        if(isRequirejs){
            define(['tinycolor', 'drawing-kit', 'histogram-analyze'], function(tc, kit, HA){ 
            //export requirejs Module
                return factory(Canvas, Image, tc, kit, HA); 
            });
        } else {
            kit = window.drawingKit;
            tc = window.tinycolor;
            HA = window.HistogramAnalyze;
            root.Rothko = factory(Canvas, Image, tc, kit, HA);        
        }
        //export normal browser module.
        
    }    
}(function(Canvas, Image, tc, kit, HA){
    /* setting */
    var h1D = HA.histogram1D;
    var cH1D = HA.circularHistogram1D;
    var h2D = HA.histogram2D;