function Maze (width, height) {
	this.width = width;
	this.height = height;

	this.charLine = height/2;
	this.charCol = width/2;

	this.walls = [];
	for (var line=0 ; line<height ; line++) {
		this.walls[line] = [];
		for (var col=0 ; col<width ; col++)
			this.walls[line][col] = Math.random() > 0.3 == 0;
	}
};

var maze = new Maze(100, 100);
