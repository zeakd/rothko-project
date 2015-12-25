(function(){
    var $test = $('#test');
    
    var CANVAS_WIDTH = 200;
    var CANVAS_HEIGHT = 200;
    var cvsBW = Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    var $cvsBW = $(cvsBW);
    $cvsBW.addClass('figure');
    $test.append($cvsBW);
//    $test.append(cvsBW);
    var ctxBW = cvsBW.getContext('2d');
    var imgdatBW = ctxBW.getImageData(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for(var y = CANVAS_HEIGHT-1; y>= 0; y--){
        for(var x = CANVAS_WIDTH-1; x >= 0; x--){
            var i = (x + CANVAS_WIDTH * y) * 4;
            var grey = parseInt(x / CANVAS_WIDTH * 255);
            imgdatBW.data[i + 0] = grey;
            imgdatBW.data[i + 1] = grey;
            imgdatBW.data[i + 2] = grey;
            imgdatBW.data[i + 3] = 255;
        }
    }
    ctxBW.putImageData(imgdatBW,0,0);
    
    var imgBW = document.createElement('img');
    imgBW.src = cvsBW.toDataURL();
    $(imgBW).load(function(){
        $(this).addClass('figure').addClass('data-url-image');
        $test.append(this);  
        
        //drawimage
        var cvsDI = Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        var $cvsDI = $(cvsDI);
        $cvsDI.addClass('figure');
        $test.append($cvsDI)
        var ctxDI = cvsDI.getContext('2d');
        var targetImg = document.getElementsByClassName('data-url-image')[0];
        ctxDI.drawImage(targetImg,0,0);
    })

    function Canvas(w, h){
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }
}())