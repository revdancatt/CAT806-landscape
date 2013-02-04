control = {
    
    pause: false,
    deg: 0,
    grid: [],
    width: 320,
    height: 240,
    maxX: 26,
    maxY: 18,
    hue: 1,

    init: function() {

        utils.log('here');

    },

    //  this is going to make us a nice grid of x,y,z co-ords
    makegrid: function() {

        control.grid = [];
        var row = [];

        var zMod = control.height*0.0833;

        for (var y = 0; y <= this.maxY; y++) {
            row = [];
            for (var x = 0; x <= this.maxX; x++) {
                row.push(Math.floor(Math.random()*zMod*2) - zMod);
            }
            control.grid.push(row);
        }
    },

    movegrid: function() {

        var zMod = control.height*0.0833;
        var oldRow = this.grid.pop();
        this.grid.unshift(oldRow);

        /*
        var newRow = [];

        for (var x = 0; x <= this.maxX; x++) {
            newRow.push(Math.floor(Math.random()*zMod*2) - zMod);
        }

        this.grid.unshift(newRow);
        */

    },

    blur: function() {
        //stackBlurCanvasRGB( 'processing_target', 0, 0, this.width, this.height, 1 );
    }

};

utils = {
    
    log: function(msg) {

        try {
            console.log(msg);
        } catch(er) {
            //  DO NOWT
        }
    }

};