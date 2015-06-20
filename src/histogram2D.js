    /* 2Dhistogram */
    function histogram2D(width, height, init){
        init = typeof init !== 'undefined' ? init : 0;
        this.width = width;
        this.height = height;
        for(var x = 0; x < width; ++x){
            this[x] = [];
            for(var y = 0; y <height; ++y){
                this[x][y] = init;    
            }
        }
    };
    histogram2D.prototype.max = function(cmp){
        var max = 0;
        for(var i = 0; i < this.width; ++i){
            var iMax = Math.max.apply(null, this[i]);
            if(max < iMax) max = iMax;
        }
        return max;
    };
    histogram2D.prototype.min = function(cmp){
        var min = 0;
        for(var i = 0; i < this.width; ++i){
            var iMin = Math.min.apply(null, this[i]);
            if(min < iMin) min = iMin;
        }
        return min;
    };
    histogram2D.prototype.loop = function(doing){
        for(var x =0; x< this.width; ++x){
            for(var y =0; y< this.height; ++y){
                doing.call(this,x,y);   
            }
        }
    };
    histogram2D.prototype.cv = function(mat, saturate){
        saturate = typeof saturate !== "undefined" ? saturate : 1;
        var resultHist = new histogram2D(this.width, this.height);
        var matSize = parseInt(Math.sqrt(mat.length));
        var cvRange = parseInt(matSize/2);
        for(var x =0; x< this.width; ++x){
            for(var y =0; y< this.height; ++y){
                if( x >= cvRange && y >= cvRange && 
                   x < this.width - cvRange && y < this.height - cvRange ){
                    for(var i = -cvRange; i <= cvRange; ++i ){
                        for(var j = -cvRange; j<= cvRange; ++j ){
                            var matIndex = (i+cvRange)*matSize + j + cvRange;
                            resultHist[x][y] += this[x+i][y+j] * mat[matIndex];
                        }
                    }
                }
                //소수점 6번째 자리까지.
                resultHist[x][y] = Math.round(resultHist[x][y]*1000000)/1000000;
            }      
        }
        return resultHist;
    };
    histogram2D.prototype.medianSmoothing = function(repeat){
        repeat = typeof repeat !== "undefined"? repeat : 1;
        var resultHist = this;
        var mat = [1,1,1,1,1,
                   1,1,1,1,1,
                   1,1,1,1,1,
                   1,1,1,1,1,
                   1,1,1,1,1];
        var matSum = mat.reduce(function(p, c){ return p+c; }); 
        for(var i=0; i< mat.length; ++i){
            mat[i] = mat[i]/matSum;
        }
        for(var i=0; i< repeat; ++i){
            resultHist = resultHist.cv(mat);    
        }
        return resultHist;
    };
    histogram2D.prototype.flatten = function(saturate){
        var resultHist = new histogram2D(this.width, this.height);
        saturate = saturate * this.max();
        for( var x = 0; x< this.width; ++x){
            for( var y =0; y< this.height; ++y){
                if( this[x][y] > saturate ) resultHist[x][y] = this[x][y];
            }
        }
        return resultHist;   
    };
    histogram2D.prototype.binary = function toBinary2DHist(saturate){
        var resultHist = new histogram2D(this.width, this.height);
        saturate = saturate * this.max();
        for( var x = 0; x< this.width; ++x){
            for( var y =0; y< this.height; ++y){
                if( this[x][y] > saturate ) resultHist[x][y] = 1;
            }
        }
        return resultHist;
    };
    histogram2D.prototype.findPeaks = function(){
        var peaks = [];
        var total = 0;
        for(var x = 0; x < this.width; ++x){
            for(var y =0; y< this.height; ++y){
                total += this[x][y];
                var r,l,u,d;

                if(isPeak.call(this,x,y)){
                    var size = this[x][y];
                    for(r = x+1; r < this.width && this[r][y] > this[r+1][y] ; ++r){
                        for(u = y+1; u < this.height && this[r][u] > this[r][u+1]; ++u){
                            size += this[r][u];   
                        }
                        for(d = y-1; 0 <= d && this[r][d] > this[r][d-1]; --d){
                            size += this[r][d];   
                        }
                    }
                    for(l = x-1; 0 <= l && this[l] > this[l-1] ; --l){
                        for(u = y+1; u < this.height && this[l][u] > this[l][u+1]; ++u){
                            size += this[l][u];   
                        }
                        for(d = y-1; 0 <= d && this[l][d] > this[l][d-1]; --d){
                            size += this[l][d];   
                        }
                    }
                    peaks[peaks.length] = {x: x, y: y, height: this[x][y], size: size};
                }
            }
        }

        peaks.sort(function(f,b){ return b.size - f.size });
        for(var i = 0; i<peaks.length; ++i){
            peaks[i].rate = peaks[i].size/total;   
        }
        return peaks;
        function isPeak(x,y){        
            var ul = 
                (x<=0|| y>=this.height-1) || 
                (this[x][y] > this[x-1][y+1]) ? true : false;
            var uu = 
                (y>=this.height-1) || 
                (this[x][y] > this[x][y+1])? true : false;
            var ur = 
                (x >= this.width-1 || y>=this.height-1) || 
                (this[x][y] > this[x+1][y+1])? true : false;
            var ll = 
                (x<=0) || 
                (this[x][y] > this[x-1][y])? true : false;
            var rr = 
                (x >= this.width-1) ||
                (this[x][y] > this[x+1][y])? true : false;
            var dl = 
                (x<=0 || y<=0) || 
                (this[x][y] > this[x-1][y-1])? true : false;
            var dd = 
                (y<=0) ||
                (this[x][y] > this[x][y-1])? true : false;
            var dr = 
                (x >= this.width-1 || y<=0) ||
                (this[x][y] > this[x+1][y-1])? true : false;
    //        if( x <= 0 ){
    //            
    //        }
    //        if( x >= this.length-1 ){
    //            
    //        }
    //        if( y <= 0){
    //            
    //        }
    //        if( y >= this[0].length-1 ){
    //            
    //        }
            return ul && uu && ur && ll && rr && dl && dd && dr;
        }
    };   