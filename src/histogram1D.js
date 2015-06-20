    /* Histogram */    
    
    function histogram1D(length, init){
        var hist1D; 
        if(length instanceof Array){
            hist1D = length;
        }else {
            init = typeof init !== 'undefined' ? init : 0;
            hist1D = [];
            for(var x = 0; x< length; ++x){
                hist1D[x] = init;   
            }
        }
        hist1D.max = histogram1DFunctions.max;
        hist1D.min = histogram1DFunctions.min;
        hist1D.cv = histogram1DFunctions.cv;
        hist1D.medianSmoothing = histogram1DFunctions.medianSmoothing;
        hist1D.gaussianSmoothing = histogram1DFunctions.gaussianSmoothing;
        hist1D.flatten = histogram1DFunctions.flatten;
        hist1D.findPeaks = histogram1DFunctions.findPeaks;
        return hist1D;
    }
    
    var histogram1DFunctions = {
        max : function(cmp){
            return Math.max.apply(null, this);   
        },
        min : function(cmp){
            return Math.min.apply(null, this);   
        },
        cv : function(kernel){
            var _length = this.length;
            var resultHist = new histogram1D(_length);
            var half_kLength = kernel.length/2;
            var kRange = parseInt(half_kLength);
            for( var _Idx = 0; _Idx< _length; ++_Idx){
                for( var k_Idx = -kRange; k_Idx < half_kLength; ++k_Idx){
                    var _value; 
                    if( _Idx + k_Idx < 0 ){
                        _value = this[0];
                    } else if( _Idx + k_Idx > _length -1) {
                        _value = this[_length-1];
                    } else {
                        _value = this[_Idx + k_Idx];   
                    }
                    resultHist[_Idx] += _value * kernel[k_Idx + kRange];    
                }
                resultHist[_Idx] = Math.round(resultHist[_Idx] * 1000)/1000;
            }
            return resultHist;
        },
        medianSmoothing : function(kSize, repeat){
            repeat = typeof repeat !== "undefined"? repeat : 1;
            var resultHist = this;
            var kernel = [];
            for( var idx = 0; idx < kSize; ++idx ){
                kernel[idx] = 1/kSize;
            }
            for(var i=0; i< repeat; ++i){
                resultHist = resultHist.cv(kernel);    
            }
            return resultHist;
        },
        gaussianSmoothing : function(kSize, repeat){
            repeat = typeof repeat !== "undefined"? repeat : 1;
            var resultHist = this;
            var kernel;
            switch(kSize) {
                case 1 : 
                    kernel = [1];
                    break;
                case 3 :
                    kernel = [1,2,1];
                    break;
                case 5 :
                    kernel = [1,4,6,4,1];
                    break;
                case 7 : 
                    kernel = [1,6,15,20,15,6,1];
                    break;
                default : 
                    throw new Error("HAHAHA kSize should be 1,3,5, or 7");
            }
            var kernelSum = kernel.reduce(function(p, c){ return p+c; }); 
            for(var i=0; i< kernel.length; ++i){
                kernel[i] = kernel[i]/kernelSum;
            }
            for(var i=0; i< repeat; ++i){
                resultHist = resultHist.cv(kernel);    
            }
            return resultHist;
        },
        flatten : function(saturate){
            var resultHist = new histogram1D(this.length);
            saturate = saturate * this.max();

            for( var i = 0; i< this.length; ++i){
                if( this[i] > saturate ) resultHist[i] = this[i];
            }
            return resultHist;  
        },
        findPeaks : function(count){
            var self = this;
            var peaks = [];
            var total = 0;
            var state = 0; //0 normal // 1 increase // 2 decrease
            
            var x;
            var peak = {};
            for(x = 0; x< self.length ; ++x){
                total+= self[x];
                //피크의 시작은 넣되 끝은 넣지않는다.
                switch(state){
                    case 0:
                        if(self[x] < self[x+1]) {
                            peak.start = x;
                            peak.size = self[x];
                            state = 1;
                        }else if( x === 0 && self[x] > self[x+1] ) { // first and Decrease
                            peak.start = x;
                            peak.size = self[x];
                            peak.x = x;
                            state = 2;
                        } 
                        break;
                    case 1: // was increased
                        if(self[x] !== self[x+1]){
                            peak.size += self[x];   
                            if(self[x] > self[x+1]){
                                peak.x = x;
                                state = 2;     
                            } 
                        } else {
                            state = 0;
                            peak = {};
                        }
                        break;
                    case 2: // was decreased
                        if(self[x] > self[x+1]) { //still Decrease 
                            peak.size += self[x];
                        } else {
                            peak.end = x;
                            peaks[peaks.length] = peak;
                            peak = {}
                            
                            if(self[x] < self[x+1]) {
                                peak.start = x;
                                peak.size = self[x];
                                state = 1;
                            } else {
                                state = 0;
                            }
                        }
                        break;
                    default:
                        throw new Error("findpeak : unknown state");
                }
            }
            if('start' in peak) {
                peak.end = x;
                if(!('x' in peak)){
                    peak.x = x-1;   
                }
                peaks[peaks.length] = peak;
            }
//                switch(state){
//                    case 0:
//                        if( self[x] < self[x+1] ){ //is Inscreasing
//                            size = self[x];
//                            peak = { start : x };
//                            state = 1;
//                        } else if ( x === 0 && self[x] > self[x+1] ){
//                            size = self[x];
//                            peak = { start : x, x : x };
//                            state = 2;
//                        }
//                        break;
//                    case 1:
//                        size += self[x];
//                        if( self[x] > self[x+1] ){ //is Decreasing 
//                            peak.x = x;
//                            state = 2;
//                        } else if( self[x] === self[x+1] ){ // is normal. this is not peak;
//                            state = 0;
//                        } else if( x + 1 === self.length ){
//                            peak.x = x;
//                            peak.end = x;
//                            peak.size = size;
//                            peaks[peaks.length] = peak;  
//                        }
//                        break;
//                    case 2:
//                        size += self[x];
//                        if( self[x] === self[x+1] ){ //is Normal
//                            peak.end = x;
//                            peak.size = size;
//                            peaks[peaks.length] = peak;  
//                            
//                            state = 0;
//                        } else if ( self[x] < self[x+1] ){
//                            peak.end = x;
//                            peak.size = size;
//                            peaks[peaks.length] = peak;  
//                            
//                            size = self[x];
//                            peak = { start : x };   
//                            state = 1;
//                        }
//                        break;
//                    default:
//                        throw new Error("findpeak _ unknown state");
//                }
                
                
                
                //wow. this is peak.
                
//                if(isPeak.call(this,x)){
//                    var r, l;
//                    //let's find left and right end.
//                    var size = this[x];
//                    for(r = x+1; r < this.length && this[r] > this[r+1] ; ++r){
//                        size += this[r];   
//                    }
//                    for(l = x-1; 0 <= l && this[l] > this[l-1] ; --l){
//                        size += this[l];
//                    }
//                    //push to peaks array.
//                    peaks[peaks.length] = { x : x, size : size, start : l, end :r };   
//                }
                
        
            peaks.sort(function(f,b){ return b.size - f.size });
            for(var i = 0; i<peaks.length; ++i){
                peaks[i].rate = Math.round(peaks[i].size/total * 1000)/1000;   
            }
            return peaks;
            function isPeak(x){
                return (x-1 < 0 || this[x-1] < this[x]) && 
                    (x+1 > this.length || this[x] > this[x+1]);
            }
        }
    } 
