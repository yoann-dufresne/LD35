function Maze (width, height) {
	this.width = width;
	this.height = height;

	this.walls = [];
	for (var line=0 ; line<height ; line++) {
		this.walls[line] = [];
		for (var col=0 ; col<width ; col++)
			this.walls[line][col] = (col + line) % 2 == 0;
	}
};

var maze = new Maze(100, 100);
