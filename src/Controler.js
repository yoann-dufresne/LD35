
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
	}
}

var controler = new Controler (inputKeyboard, maze);
controler.loadLevel();