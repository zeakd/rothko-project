    /* Circular1D Histogram */
    function circularHistogram1D(length, init){
        var circularHist1D; 
        if(length instanceof Array){
            circularHist1D = length;
        }else {
            init = typeof init !== 'undefined' ? init : 0;
            circularHist1D = [];
            for(var x = 0; x< length; ++x){
                circularHist1D[x] = init;   
            }
        }
        circularHist1D.circularIndex = circularHistogram1DFunctions.circularIndex;
        circularHist1D.max = circularHistogram1DFunctions.max;
        circularHist1D.min = circularHistogram1DFunctions.min;
        circularHist1D.cv = circularHistogram1DFunctions.cv;
        circularHist1D.medianSmoothing = circularHistogram1DFunctions.medianSmoothing;
        circularHist1D.gaussianSmoothing = circularHistogram1DFunctions.gaussianSmoothing;
        circularHist1D.flatten = circularHistogram1DFunctions.flatten;
        circularHist1D.findPeaks = circularHistogram1DFunctions.findPeaks;
        circularHist1D.normalize = circularHistogram1DFunctions.normalize;
        return circularHist1D;
    }
    
    var circularHistogram1DFunctions = {
        circularIndex: function(idx, assign){
            if( idx >= 0 && idx < this.length){
                if(assign){ 
                    this[idx] = assign;
                } 
                return this[idx];
            }else if(idx < 0){
                return this.circularIndex(idx + this.length);
            }else{
                return this.circularIndex(idx - this.length);
            }    
        },
        max: function(cmp){
            return Math.max.apply(null, this);
        },
        min: function(cmp){
            return Math.min.apply(null, this);
        },
        cv: function(kernel){
            console.log("cv start");
            var _length = this.length;
            var resultHist = new circularHistogram1D(_length);
            var half_kLength = kernel.length/2;
            var kRange = parseInt(half_kLength);
            for( var _Idx = 0; _Idx< _length; ++_Idx){
                for( var k_Idx = -kRange; k_Idx < half_kLength; ++k_Idx){
                    var _value; 
                    _value = this.circularIndex(_Idx + k_Idx);   
//                    if( _Idx + k_Idx < 0 ){
//                        _value = this[0];
//                    } else if( _Idx + k_Idx > _length -1) {
//                        _value = this[_length-1];
//                    } else {
//                        _value = this[_Idx + k_Idx];   
//                    }
//                    console.log(resultHist.circularIndex(_Idx))
                    resultHist.circularIndex(_Idx, (resultHist.circularIndex(_Idx) + _value * kernel[k_Idx + kRange]));
//                    console.log("first");
                }
                resultHist.circularIndex(_Idx, Math.round(resultHist.circularIndex(_Idx) * 1000)/1000);
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
        flatten: function(saturate){
            var resultHist = new circularHistogram1D(this.length);
            saturate = saturate * this.max();
            for( var i = 0; i< this.length; ++i){
                if( this[i] > saturate ) resultHist[i] = this[i];
            }
            return resultHist;  
        },
        findPeaks: function(count){
            var self = this;
            var peaks = [];
            var total = 0;
            var state = 0; //0 normal // 1 increase // 2 decrease
            
            //    var minDataIndex = this.indexOf(this.min()); // min is zero, ordinally.
            var min = this.min();
            var minDataIndex;
            for(var i=0; i< self.length; ++i){
                if(this[i] === min){
                    minDataIndex = i;
                    break;
                }
            }
            
            var x;
            var peak = {}; console.log(self.join());
            for(x = minDataIndex; x< self.length + minDataIndex; ++x){
                total+= self.circularIndex(x);
                //피크의 시작은 넣되 끝은 넣지않는다.
                switch(state){
                    case 0:
                        if(self.circularIndex(x) < self.circularIndex(x+1)) {
                            peak.start = x;
                            peak.size = self.circularIndex(x);
                            state = 1;
                            console.log( "0->1");
                        }
                        break;
                    case 1: // was increased
                        if(self.circularIndex(x) !== self.circularIndex(x+1)){
                            peak.size += self.circularIndex(x);   
                            if(self.circularIndex(x) > self.circularIndex(x+1)){
                                peak.x = x;
                                state = 2;   
                                console.log( "1->2");
                            } else {
                                console.log( "1->1");   
                            }
                        } else {
                            state = 0;
                            peak = {};
                            console.log( "1->0");
                        }
                        break;
                    case 2: // was decreased
                        if(self.circularIndex(x) > self.circularIndex(x+1)) { //still Decrease 
                            peak.size += self.circularIndex(x);
                            console.log( "2->2");
                        } else {
                            peak.end = x;
                            peaks[peaks.length] = peak;
                            peak = {}
                            
                            if(self.circularIndex(x) < self.circularIndex(x+1)) {
                                peak.start = x;
                                peak.size = self.circularIndex(x);
                                state = 1;
                                console.log( "2->1");
                            } 
                            else {
                                state = 0;
                                console.log( "2->0");
                            }
                        }
                        break;
                    default:
                        throw new Error("findpeak : unknown state");
                }
            }  
//            for(var i= 0; i< peaks.length; ++i){
//                console.log(peaks[i].x);   
//            }
            if('start' in peak) {
                peak.end = x;
                if(!('x' in peak)){
                    peak.x = x-1;   
                }
                peaks[peaks.length] = peak;
            }
            peaks.sort(function(f,b){ return b.size - f.size });
            for(var i = 0; i<peaks.length; ++i){
                peaks[i].rate = peaks[i].size/total;   
            }
            return peaks;
            function isPeak(x){
                return self.circularIndex(x-1) < self.circularIndex(x) && 
                    self.circularIndex(x) > self.circularIndex(x+1);
            }
        },
        normalize: function(idx){
            if( idx < 0 ){
                return this.normalize(idx + this.length)
            }else if( idx > this.length ){
                return this.normalize(idx - this.length);   
            }else{
                return idx;
            }
        } 
    }
//    function circularHistogram1D(width, init){
//        init = typeof init !== 'undefined' ? init : 0;
//        this.width = width;
//        for(var x = 0; x< width; ++x){
//            this[x] = init;   
//        }
//    }
//    circularHistogram1D.prototype.circleIndex = function(idx){
//        if( idx >= 0 && idx < this.width){
//            return this[idx];
//        }else if(idx < 0){
//            return this.circleIndex(idx + this.width);
//        }else{
//            return this.circleIndex(idx - this.width);
//        }    
//    };
//    circularHistogram1D.prototype.max = function(cmp){
//        var arr = [];
//        for( var i =0; i< this.width; ++i){
//            arr[i] = this[i];   
//        }
//        return Math.max.apply(null, arr);   
//    };
//    circularHistogram1D.prototype.min = function(cmp){
//        var arr = [];
//        for( var i =0; i< this.width; ++i){
//            arr[i] = this[i];   
//        }
//        return Math.min.apply(null, arr);   
//    };
//    circularHistogram1D.prototype.cv = function(coeff){
//        var resultHist = new circularHistogram1D(this.width);  
//        var coeffRange = parseInt(coeff.length / 2);
//        for( var i = 0; i< this.width; ++i){
//            for( var cvIdx = -coeffRange; cvIdx <= coeffRange; ++cvIdx){
//                resultHist[i] += this.circleIndex(i + cvIdx) * coeff[cvIdx + coeffRange];
//            }
//            resultHist[i] = Math.round(resultHist[i] * 100)/100;
//        }
//        return resultHist;
//    };
//    circularHistogram1D.prototype.medianSmoothing = function(repeat){
//        repeat = typeof repeat !== "undefined"? repeat : 1;
//        var resultHist = this;
//        var cvCoeff = [1,1,1,1,1];
//        var cvCoeffSum = cvCoeff.reduce(function(p, c){ return p+c; }); 
//        for(var i=0; i< cvCoeff.length; ++i){
//            cvCoeff[i] = cvCoeff[i]/cvCoeffSum;
//        }
//        for(var i=0; i< repeat; ++i){
//            resultHist = resultHist.cv(cvCoeff);    
//        }
//        return resultHist;
//    };    
//    circularHistogram1D.prototype.flatten = function(saturate){
//        var resultHist = new circularHistogram1D(this.width);
//        saturate = saturate * this.max();
//        for( var i = 0; i< this.width; ++i){
//            if( this[i] > saturate ) resultHist[i] = this[i];
//        }
//        return resultHist;  
//    };
//    circularHistogram1D.prototype.findPeaks = function(count){
//        var peaks = [];
//    //    var minDataIndex = this.indexOf(this.min()); // min is zero, ordinally.
//        var min = this.min();
//        var minDataIndex;
//        for(var i=0; i< this.width; ++i){
//            if(this[i] === min){
//                minDataIndex = i;
//                break;
//            }
//        }
//
//        //idx can be <0, or >histLength because loop is started from minDataIndex.
//        //it must be normalized.
//        var total = 0;
//        for(var x = minDataIndex; x< this.width + minDataIndex; ++x){
//            //wow. this is peak.
//            total+= this.circleIndex(x);
//            if(isPeak.call(this,x)){
//                var r, l;
//                //let's find left and right end.
//                var size = this.circleIndex(x);
//                for(r = x+1; this.circleIndex(r) > this.circleIndex(r+1) ; ++r){
//                    size += this.circleIndex(r);   
//                }
//                for(l = x-1; this.circleIndex(l) > this.circleIndex(l-1) ; --l){
//                    size += this.circleIndex(l);
//                }
//                //push to peaks array.
//                peaks.push({ x : this.normalize(x), size : size, 
//                     start : this.normalize(l), end :this.normalize(r) });   
//            }
//        }
//        peaks.sort(function(f,b){ return b.size - f.size });
//        for(var i = 0; i<peaks.length; ++i){
//            peaks[i].rate = peaks[i].size/total;   
//        }
//        return peaks;
//        function isPeak(x){
//            return this.circleIndex(x-1) < this.circleIndex(x) && 
//                this.circleIndex(x) > this.circleIndex(x+1);
//        }
//    }    
//    circularHistogram1D.prototype.normalize = function(idx){
//        if( idx < 0 ){
//            return this.normalize(idx + this.width)
//        }else if( idx > this.width ){
//            return this.normalize(idx - this.width);   
//        }else{
//            return idx;
//        }
//    }