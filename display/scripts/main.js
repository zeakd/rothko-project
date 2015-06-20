console.log('hello');

var img = new Image()
var c;
img.src = 'images/DanielGarber_StudentsPainting.jpg';
img.onload = function(){
    c = drawingKit.createCanvasByImage(img);
    var shell = document.getElementById('shell');
    shell.appendChild(c);
};
