    /* add utility method */
    Math.mod = function(a, n){
        if( a < 0 ){
            return this.mod(a + n, n);   
        }else{
            return a%n;
        }
    }