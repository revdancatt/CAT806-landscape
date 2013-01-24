control = {
    
    pause: false,
    deg: 0,
    grid: [],
    width: 640,
    height: 480,
    maxX: 26,
    maxY: 18,

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

        for (var y = this.maxY; y > 0; y--) {
            for (var x = 0; x <= this.maxX; x++) {
                this.grid[y][x] = this.grid[y-1][x];
            }
        }

        var zMod = control.height*0.0833;

        for (var x = 0; x <= this.maxX; x++) {
            this.grid[0][x] = Math.floor(Math.random()*zMod*2) - zMod;
        }

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