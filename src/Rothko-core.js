    var Rothko = function Rothko (imageObj){
        var RESIZING_PIXEL = 100000;
        if(!(this instanceof Rothko)){
           return new Rothko(imageObj);
        }
        if (kit.isImage(imageObj) || kit.isCanvas(imageObj)){
            var _image = kit.createCanvasByImage(imageObj, RESIZING_PIXEL);
            
        }
    };