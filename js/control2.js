control = {
	
	tick: 0,
	rows: [],
	pointBasePosition: [-310, -290, -270, -250, -230, -210, -190, -170, -150, -130, -110, -90, -70, -50, -30, -10, 10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310],
	hue: 0,
	startTime: null,
	frames: 0,

	init: function() {

		//	Grab the three stacked canvas elements
		this.canvas_back = document.getElementById('landscape_back');
		this.ctx_back = this.canvas_back.getContext('2d');
		this.ctx_middle = document.getElementById('landscape_middle').getContext('2d');
		this.ctx_front = document.getElementById('landscape_front').getContext('2d');

		this.startTime = new Date();

		//	and let's aim for 25 frames per second (1000ms / 25 = 40ms)
		setInterval(function() {control.drawFrame();}, 40);

	},


	drawFrame: function() {

		//	The zMod is how much we modify each point up and down
		var zMod = this.canvas_back.height*0.03;


		//	We use "ticks" to decide how often we are going to add a 
		//	new row onto the back of the landscape. Near the end
		//	of the code we increment the tick and set it back to
		//	0 when it reaches a certain level.
		if (this.tick === 0) {

			//	Make the row object
			var newRow = {
				position: 1,
				age: 1,
				points: []
			}

			//	Fill the points with new random heights, enought
			//	points across to match the pointBasePosition array
			for (var x = 0; x <= this.pointBasePosition.length; x++) {
            	newRow.points.push(Math.floor(Math.random()*zMod*2)-zMod);
            }

            //	push the row into the stack of rows (the landscape startes at
            //	the back of the field and moves forwards over time)
			this.rows.unshift(newRow)
		}

		//	clear all the three canvasses
		//	We re using three canvasses because I want to apply a blur to them at
		//	different levels, giving a Depth of Field effect.
		//	Because we are using CSS3 Filters which will only kick in if there
		//	is hardware acceleration is availible then we don't need to worry
		//	about anything else. If it's there, then it happens and it's virtually "free"
		//	performance we, if it's not then we don't get it.
		this.ctx_back.clearRect(0, 0, this.canvas_back.width, this.canvas_back.height);
		this.ctx_middle.clearRect(0, 0, this.canvas_back.width, this.canvas_back.height);
		this.ctx_front.clearRect(0, 0, this.canvas_back.width, this.canvas_back.height);


		//	These vars are going to hold values set in the loops below
		//	setting them up now so we don't need to keep redefining them
		//	in the loops. Otherwise knows as JSLint moans at me unless
		//	I do this.

		//	To hold the rows out of the rows array
		var row = null,
			row2 = null;

		//	The *base* horizontal position of the two
		//	rows when we plot them onto the screen
		//	and the overall base horizon (in this case
		//	1/3rd of the way down the canvas)
		var h = null,
			h2 = null;
		var horizon = this.canvas_back.height / 3;

		//	to store half the width of the canvas
		var w = this.canvas_back.width / 2;

		//	We need to modify the height adjustments to make the
		//	landscape *look* right. The same goes for moving the
		//	points to the side as they get "closer" to the user.
		//	This is all about moving points towards the bottom
		//	of the screen and to the sides to give the illusion of
		//	a 3D landscape. And so, using science, maths and errr...
		//	adjusting these numbers until it just looks right we
		//	get the 3D effect.
		var heightMod = 2;
		var widthMod = 20;

		//	Each quad is going to have four corners which will
		//	of course have x,y co-ords. In real 3D world the
		//	quads would be made up of two triangles. Because we
		//	are cheating we are just going to draw the "squares"
		//	even though to actually exists they'd need to bend.
		//	Luckly the landscape moves fast enough that we can trick
		//	the brain into not really realising that this is a problem.
		var topLeft = { x: null, y: null},
			topRight = { x: null, y: null},
			bottomLeft = { x: null, y: null},
			bottomRight = { x: null, y: null};

		//	We are going to change the luminosity of the quad and lines
		//	around the edge based on how far down the screen the quad is.
		var l = null,
			l2 = null;

		//	move through the rows, this will start with the newest row
		//	with is also the furthest back on our landscape, so we'll
		//	be drawing from back to front which is good as then we
		//	don't need to worry about hidden faces and all that
		for (y in this.rows) {

			//	Normally we'd just be using y as a index to get to
			//	the correct row in the rows array, but because we
			//	want to use y in calculations let's throw it to
			//	an int. (yes we could use a different for loop, but
			//	whatevars)
			y = parseInt(y, 10);

			//	if we are on the last row then stop, as later on we
			//	try and connect lines from the current row to the next
			//	one. If we are on the last row then there is not next
			//	row to connect to.
			if (y == this.rows.length - 1) break;

			//	Grab this and the next row
			row = this.rows[y];
			row2 = this.rows[y + 1];

			//	Where we take the base horizon and add the
			//	current position of this row and the next one.
			h = horizon + row.position;
			h2 = horizon + row2.position;

			//	move through the points in the current row.
			//	Note that we don't store the x (across) position
			//	of each point, just the height. We'll use the base 
			//	positions for each point (from pointBasePosition)
			//	and then modify them depending on how far down the screen
			//	the point is.
			for (x in row.points) {

				//	Throw it to an int because I am slack
				x = parseInt(x, 10);

				//	if it's the last point in the array break because
				//	we can't join it to the next point along.
				if (x == this.pointBasePosition.length) break;

				//	work out the position of the top left corner
				//	the x (across) position is based on the middle
				//	of the canvas + the basePointPosition. So the first
				//	point is canvas/2 + -310 (and so on along the point defined
				//	in pointBasePosition until we get to convas/2 + 310). But we
				//	are also applying a multiplication based on how far down the screen
				//	the row is, so as it moves down it also moves out sideways,
				//	giving the 3D look.
				topLeft.x = w + (this.pointBasePosition[x] * row.position/widthMod) + this.pointBasePosition[x];

				//	Now we do the same for the height, we have the base position for the row, but each
				//	point is randomly moved up or down by an amount. Which we adjust as the point moves
				//	"closer" to us to keep the 3D illusion going.
				topLeft.y = h - (row.points[x] * heightMod) + (row.position * heightMod);

				//	if the top left corner would be draw off the canvas to the right
				//	then we can skip it
				if (topLeft.x > this.canvas_back.width) continue;

				//	Same calculations but for the top right corner
				topRight.x = w + (this.pointBasePosition[x+1] * row.position/widthMod) + this.pointBasePosition[x+1];
				topRight.y = h - (row.points[x+1] * heightMod) + (row.position * heightMod);

				//	and if the top right is off the canvas to the left then we can
				//	skip drawing this whole quad too.
				if (topRight.x < 0) continue;

				//	if both of the top corners are off the bottom of the canvas then skip the
				//	draw too.
				if (topLeft.y > this.canvas_back.height && topRight.y > this.canvas_back.height) continue

				//	And now same again for the next row down to get the bottom left and right corners
				bottomLeft.x = w + (this.pointBasePosition[x] * row2.position/widthMod) + this.pointBasePosition[x];
				bottomLeft.y = h2 - (row2.points[x] * heightMod) + (row2.position * heightMod);

				bottomRight.x = w + (this.pointBasePosition[x+1] * row2.position/widthMod) + this.pointBasePosition[x+1];
				bottomRight.y = h2 - (row2.points[x+1] * heightMod) + (row2.position * heightMod);

				//	The luminosity of the quad is base on how far down the screen it is
				//	we do the calculations *slightly* differently for the quad and the stroke/line
				//	for various dull reasons. Anyway, this means we're reducing the "pop in" of the
				//	far bit of landscape (but not by much) by making it the same colour as the
				//	background
				l = ((topRight.y - horizon) / (this.canvas_back.height - horizon) * 70);
				l2 = ((topRight.y - horizon) / (this.canvas_back.height - horizon)) * 100;

				//	I want each row of the landscape to be a slighty different hue, so
				//	the landscape changes from one colour at the front to another at the
				//	back (and we are going to be cycling the hue anyway) to make it look
				//	like we are flying over a rainbow landscape
				hue = this.hue - (y*4);
				if (hue < 0) hue = 360 + hue;

				//	Now we need to decide which canvas we are going to draw on
				//	we will assume the front canvas and then move the canvas back depending
				//	on which row we are drawing. This puts the back few rows on the back canvas
				//	the middle rows on the middle canvas, and unsurprisingly the front rows
				//	on the front canvas. Note the values 5 & 8 are just picked by eye, if we
				//	changed the rate at which rows got added to the scene and the speed at which
				//	they travelled we'd have to tweek these. There is not science.
				ctx = this.ctx_front;
				if (y < 8) ctx = this.ctx_middle;
				if (y < 5) ctx = this.ctx_back;

				//	Now we actually draw the quad, because of the way we've done the
				//	maths (i.e cheated) to calculate the colour of the quad we have
				//	a lighter colour if the topleft corner is higher than the topright
				//	giving the effect of a light source over on the right of the scene.
				//	This saves us the bother of trying to correctly calculate how much
				//	we should shade a quad based on it's angle (which is horrid)
				ctx.fillStyle = 'hsl(' + hue + ', 100%, ' + l + '%)';
				ctx.strokeStyle = 'hsl( 0, 0, ' + l + ')';
				ctx.beginPath();
				ctx.moveTo(topLeft.x, topLeft.y);
				ctx.lineTo(topRight.x, topRight.y);
				ctx.lineTo(bottomRight.x, bottomRight.y);
				ctx.lineTo(bottomLeft.x, bottomLeft.y);
				ctx.lineTo(topLeft.x, topLeft.y);
				ctx.fill();
				ctx.stroke();

			}

		}

		//	Now we go thru all the rows adjusting their position
		//	and their age. Culling any rows that are now off the
		//	bottom of the canvas
		for (i in this.rows) {

			//	get the row
			row = this.rows[i];

			//	modify it's position. This means when we start a row it
			//	starts at 1, then become 1.06, then 1.1236 and so on
			//	it starts small but then gets larger fairly quickly. Which
			//	is what gives us the illusion of moving slowly when in the
			//	far distance and then moving quicker as it gets closer to us
			//	you can tweek this value to make this better/worse :)
			//	But you'll also need to modify the values used to decide
			//	if you should draw on the back/middle/front canvas
			row.position = row.position * 1.06;
			
			//	increase the age of the row (we don't do anything with
			//	this, but it could be kinda useful oneday)
			row.age++;

			//	if the row position is off the bottom of the canvas then
			//	we just pop it from the array. Off the bottom is defined
			//	as the position, plus the horizon we are going to be drawing
			//	the position from, and taking into account the maximum possible
			//	modification position that could move a point up. This isn't
			//	*quite* right as we're not taking in the heightMod and stuff
			//	but I've not seen a quad pop out of existance quite yet.
			if (row.position + horizon - zMod > this.canvas_back.height) {
				this.rows.pop();
				break;
			}
		}

		//	increase the tick, if it reaches a certain value (fixed by eye)
		//	then we set it back to 0 which will force a new row to be added
		//	if you do this then you'll also need to modify the values used 
		//	to decide if you should draw on the back/middle/front canvas 
		this.tick++;
		if (this.tick > 5) {
			this.tick = 0;
		}

		// And cycle the hue
		this.hue++;
		if (this.hue > 360) {
			this.hue = 0;
		}

		this.frames++;
		document.getElementById('fps').innerHTML = 'fps: ' + Math.floor(this.frames / (new Date() - this.startTime) * 10000) / 10;

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