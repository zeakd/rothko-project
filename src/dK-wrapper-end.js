if(isNodeModule){
    module.exports = drawingKit ;
}else if(isRequirejs){
    define(function(){ return drawingKit });
}else {
    window.drawingKit = drawingKit;
}
})();