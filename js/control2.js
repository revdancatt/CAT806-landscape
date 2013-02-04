control = {
	
	tick: 0,
	rows: [],
	pointBasePosition: [-310, -290, -270, -250, -230, -210, -190, -170, -150, -130, -110, -90, -70, -50, -30, -10, 10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310],
	hue: 0,

	init: function() {

		utils.log('hello world');
		this.canvas = document.getElementById('landscape');
		this.ctx = this.canvas.getContext('2d');
		setInterval(function() {control.drawFrame();}, 40);

	},

	drawFrame: function() {

		//	if we have reset the tick then we need to add a new row
		var zMod = this.canvas.height*0.03;
		var ctx = this.ctx;

		if (this.tick === 0) {

			//	Make the row object
			var newRow = {
				position: 1,
				age: 1,
				points: []
			}

			//	Fill the points with new heights
			for (var x = 0; x <= this.pointBasePosition.length; x++) {
            	newRow.points.push(Math.floor(Math.random()*zMod*2)-zMod);
            }

            //	push the row into the stack of rows
			this.rows.unshift(newRow)
		}

		//	clear the canvas
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);



		//	move through the rows
		var row = null;
		var h = null;
		var w = null;
		var p = null;
		var thisPointX = thisPointY = thisPointYOffset = null;
		var nextPointX = nextPointY = nextPointYOffset = null;
		var horizon = this.canvas.height / 3;
		var heightMod = 2;
		var widthMod = 20;


		for (y in this.rows) {

			y = parseInt(y, 10);
			if (y == this.rows.length - 1) break;

			row = this.rows[y];
			row2 = this.rows[y + 1];
			h = horizon + row.position;
			h2 = horizon + row2.position;

			w = this.canvas.width / 2;

			//	move through the points
			for (x in row.points) {

				x = parseInt(x, 10);
				if (x == this.pointBasePosition.length) break;

				//	work out the position of *this* point
				topLeftX = w + (this.pointBasePosition[x] * row.position/widthMod) + this.pointBasePosition[x];
				topLeftY = h - (row.points[x] * heightMod) + (row.position * heightMod);

				if (topLeftX > this.canvas.width) continue;

				//	work out the position of the *next* point
				topRightX = w + (this.pointBasePosition[x+1] * row.position/widthMod) + this.pointBasePosition[x+1];
				topRightY = h - (row.points[x+1] * heightMod) + (row.position * heightMod);

				if (topRightX < 0) continue;

				bottomLeftX = w + (this.pointBasePosition[x] * row2.position/widthMod) + this.pointBasePosition[x];
				bottomLeftY = h2 - (row2.points[x] * heightMod) + (row2.position * heightMod);

				bottomRightX = w + (this.pointBasePosition[x+1] * row2.position/widthMod) + this.pointBasePosition[x+1];
				bottomRightY = h2 - (row2.points[x+1] * heightMod) + (row2.position * heightMod);

				l = ((topRightY - horizon) / (this.canvas.height - horizon) * 50);
				l2 = ((topRightY - horizon) / (this.canvas.height - horizon)) * 100;
				hue = this.hue + y;
				if (hue > 360) hue = 1;

				ctx.fillStyle = 'hsl(' + hue + ', 100%, ' + l + '%)';
				ctx.strokeStyle = 'hsl( 0, 0, ' + l + ')';
				ctx.beginPath();
				ctx.moveTo(topLeftX, topLeftY);
				ctx.lineTo(topRightX, topRightY);
				ctx.lineTo(bottomRightX, bottomRightY);
				ctx.lineTo(bottomLeftX, bottomLeftY);
				ctx.lineTo(topLeftX, topLeftY);
				ctx.fill();
				ctx.stroke();

			}

			//if (y == 2) stackBlurCanvasRGB( 'landscape', 0, 0, this.canvas.width, this.canvas.height, 1 );
			//if (y == 4) stackBlurCanvasRGB( 'landscape', 0, 0, this.canvas.width, this.canvas.height, 1 );
			//if (y == 8) stackBlurCanvasRGB( 'landscape', 0, 0, this.canvas.width, this.canvas.height, 4 );

		}

		//	move all the rows down a bit
		var popit = false;
		for (i in this.rows) {

			row = this.rows[i];
			row.position = row.position * 1.06;
			row.age++;

			//	if the row position is off the bottom of the canvas then
			//	we just pop it from the array
			if (row.position > this.canvas.height / 2) {
				this.rows.pop();
				break;
			}
		}


		this.tick++;
		if (this.tick > 6) {
			this.tick = 0;
		}

		this.hue++;
		if (this.hue > 360) {
			this.hue = 0;
		}



	}


},

utils = {
	
	log: function(msg) {
		try {
			console.log(msg)
		} catch(er) {
			//	DO NOWT
		}
	}

}