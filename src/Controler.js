const WALLS_GENRATION_RATE = 10;

function Controler (input, maze) {
	this.input = input;
	this.maze = maze;
	this.maze.caseChanged = false;
	this.wallsFrame = WALLS_GENRATION_RATE;
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
		var x = Math.floor (this.maze.charCol);
		var y = Math.floor (this.maze.charLine);

		if (x != Math.floor(prevX) || y != Math.floor(prevY)){
			this.maze.caseChanged = true;
		}

		// Borders collider
		if (this.maze.charCol < 0)
			this.maze.charCol = 0;
		else if (this.maze.charCol >= this.maze.width)
			this.maze.charCol = this.maze.width - 0.000001;

		if (this.maze.charLine < 0)
			this.maze.charLine = 0;
		else if (this.maze.charLine >= this.maze.height)
			this.maze.charLine = this.maze.height - 0.000001;

		// Walls collider
		if (this.maze.walls[y] != undefined &&
		 		this.maze.walls[y][x] != undefined &&
		  		this.maze.walls[y][x]) {

			this.collide({
				x: this.maze.charCol,
				y: this.maze.charLine,
				prevX: prevX,
				prevY: prevY,
				maze: maze
			});
		}

		this.wallGeneration();
	},

	collide: function (coords) {
		var flrX = Math.floor(coords.x);
		var flrY = Math.floor(coords.y);
		var flrPrevX = Math.floor(coords.prevX);
		var flrPrevY = Math.floor(coords.prevY);

		if (flrPrevX != flrX && flrPrevY != flrY) {
			if (!coords.maze.walls[flrPrevY][flrX]) {
				flrX = flrPrevX;
			} else if (!coords.maze.walls[flrY][flrPrevX]) {
				flrY = flrPrevY;
			}
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
	},

	wallGeneration: function () {
		this.wallsFrame--;
		if (this.wallsFrame <= 0) {
			var tile = this.maze.freeTiles[0];
			if (Math.floor(this.maze.charLine) == tile.line && Math.floor(this.maze.charCol) == tile.col)
				return;

			//console.log(tile);
			this.maze.walls[tile.line][tile.col] = true;
			this.maze.freeTiles.splice(0, 1);

			for (var line=tile.line-1 ; line<=tile.line+1 ; line++)
				for (var col=tile.col-1 ; col<=tile.col+1 ; col++) {
					if ((line != tile.line && col != tile.col)
					 || col<0 || line<0 || col>=this.maze.width || line >= this.maze.height)
						continue;
					else if (line == tile.line && col == tile.col) {
						var sprite = vue.stage.selectSprite(line, col);
						vue.stage.wallsRendered[line][col] = sprite;
						vue.stage.addChildAt(sprite, this.maze.width*this.maze.height+10);
					} else
						vue.stage.selectSprite(line, col, vue.stage.wallsRendered[line][col]);
				}

			this.wallsFrame = WALLS_GENRATION_RATE;
		}
	}
}

var controler = new Controler (inputKeyboard, maze);
controler.loadLevel();