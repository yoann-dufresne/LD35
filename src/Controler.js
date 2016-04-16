
function Controler (input, maze) {
	this.input = input;
	this.maze = maze;
}

Controler.prototype = {
	loadLevel: function () {
		var that = this;

		this.input.gameControl ();
	},

	refresh: function () {
		// Move the character
		var time = Date.now();

		var durationX = 0;
		var durationY = 0;
		durationX =
			this.input.right * (time - this.input.rightTime) -
			this.input.left * (time - this.input.leftTime);
		durationY =
			this.input.down * (time - this.input.downTime) -
			this.input.up * (time - this.input.upTime);

		this.input.upTime = time;
		this.input.downTime = time;
		this.input.leftTime = time;
		this.input.rightTime = time;

		var prevX = this.maze.charCol;
		var prevY = this.maze.charLine;
		this.maze.charCol += this.maze.speed * (durationX / 1000);
		this.maze.charLine += this.maze.speed * (durationY / 1000);

		// Trigger the events functions
		var x = Math.floor (this.maze.charLine);
		var y = Math.floor (this.maze.charCol);
		if (this.maze.walls[x] != undefined &&
		 		this.maze.walls[x][y] != undefined &&
		  		this.maze.walls[x][y]) {
			
			this.collide({
				x: this.maze.charLine,
				y: this.maze.charCol,
				prevX: prevX,
				prevY: prevY,
				maze: maze
			});
		}
	},

	collide: function (coords) {
		var flrX = Math.floor(coords.x);
		var flrY = Math.floor(coords.y);
		var flrPrevX = Math.floor(coords.prevX);
		var flrPrevY = Math.floor(coords.prevY);

		if (flrPrevX != flrX && flrPrevY != flrY)
			if (coords.maze.walls[flrX][flrPrevY] == undefined) {
				coords.prevX = coords.x;
				flrPrevX = Math.floor(coords.x);
			} else if (coords.maze.walls[flrPrevX][flrY] == undefined) { 
				coords.prevY = coords.y;
				flrPrevY = Math.floor(coords.y);
			}

		if (flrPrevX != flrX) {
			coords.maze.charCol = Math.round(coords.prevX);
			if (coords.prevX < coords.x)
				coords.maze.charCol -= 0.000001
		}
		if (flrPrevY != flrY) {
			coords.maze.charLine = Math.round(coords.prevY);
			if (coords.prevY < coords.y)
				coords.maze.charLine -= 0.000001
		}

		console.log(coords.y, coords.maze.charCol);
	},
}

var controler = new Controler (inputKeyboard, maze);
controler.loadLevel();