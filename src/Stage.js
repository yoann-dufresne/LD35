
function Stage (renderer, maze) {
	PIXI.Container.call(this);
	this.renderer = renderer;
	this.maze = maze;
	this.wallsRendrer = [];

	for (var line=0 ; line<maze.walls.length ; line++) {
		this.wallsRendrer[line] = [];
		for (var col=0 ; col<maze.walls[line].length ; col++) {
			if (maze.walls[line][col]){
				var broc = Assets.textures.walls[0]["empty"];
				var ts = new PIXI.extras.TilingSprite (broc, broc.width, broc.height);
				ts.z = 1;
				this.wallsRendrer[line][col] = ts;
			} else {
				this.wallsRendrer[line][col] = null;
			}
		}
	}

	this.updateRequired = true;
}

Stage.prototype = Object.create(PIXI.Container.prototype, {
	constructor: { value: Stage }
});

Stage.prototype.refresh = function () {
	this.addChildren(12);
};

Stage.prototype.addChildren = function (fov) {
	for (var i = this.children.length - 1; i >= 0; i--) {
		this.removeChild(this.children[i]);
	}

	var cLine = this.maze.charLine;
	var floorLine = Math.floor(cLine);
	var cCol = this.maze.charCol;
	var floorCol = Math.floor(cCol);
	for (var line=floorLine-fov ; line<=floorLine+fov ; line++) {
		if (!this.wallsRendrer[line])
			continue;

		for (var col=floorCol-fov ; col<=floorCol+fov ; col++) {
			if (!this.wallsRendrer[line][col])
				continue;

			if (this.wallsRendrer[line][col] != null) {
				var ts = this.wallsRendrer[line][col]; // this.renderer.width
				ts.position.y = this.renderer.height/2 + (line-cLine) * Assets.tileSize;
				ts.position.x = this.renderer.width/2 + (col-cCol) * Assets.tileSize;
				this.addChild(ts);
			}
		}
	}
}
