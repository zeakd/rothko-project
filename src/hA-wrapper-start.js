// Rothko Project
//
// histogram-analyze
//
// zeakd

(function(factory){
    'use strict'
    var root = (typeof self == 'object' && self.self == self && self) ||
            (typeof global == 'object' && global.global == global && global);
    
    var isNodeModule = typeof module !== 'undefined' && module.exports;
    var isRequirejs = typeof define === 'function' && define.amd;
    /* Export and Constructor Setting */
    
    if(isRequirejs){
        define(function(){ 
            //export requirejs Module
            return factory(root); 
        });
    }else if(isNodeModule){
        module.exports = factory(root);
        //Node module dependency
    }else {
        //export normal browser module.
        root.HistogramAnalyze = factory(root);    
    }    
}(function(root){