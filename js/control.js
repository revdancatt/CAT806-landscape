control = {
    
    pause: false,
    deg: 0,
    grid: [],
    width: 640,
    height: 480,
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
        this.grid.pop();

        var newRow = [];

        for (var x = 0; x <= this.maxX; x++) {
            newRow.push(Math.floor(Math.random()*zMod*2) - zMod);
        }

        this.grid.unshift(newRow);

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