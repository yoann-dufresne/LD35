
function Stage (renderer, maze) {
	PIXI.Container.call(this);
	this.renderer = renderer;
	this.maze = maze;
	this.wallsRendrer = [];

	for (var line=0 ; line<maze.walls.length ; line++) {
		this.wallsRendrer[line] = [];
		for (var col=0 ; col<maze.walls[line].length ; col++) {
			if (maze.walls[line][col]){
				var sprite = this.selectSprite (line, col);
				sprite.z = 1;
				this.wallsRendrer[line][col] = sprite;
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

Stage.prototype.selectSprite = function (line, col) {
	var north = this.maze.walls[line-1] == undefined || this.maze.walls[line-1][col] == undefined ? false : this.maze.walls[line-1][col];
	var south = this.maze.walls[line+1] == undefined || this.maze.walls[line+1][col] == undefined ? false : this.maze.walls[line+1][col];
	var west = this.maze.walls[line] == undefined || this.maze.walls[line][col-1] == undefined ? false : this.maze.walls[line][col-1];
	var east = this.maze.walls[line] == undefined || this.maze.walls[line][col+1] == undefined ? false : this.maze.walls[line][col+1];

	var nb = north ? 1 : 0;
	nb += south ? 1 : 0;
	nb += east ? 1 : 0;
	nb += west ? 1 : 0;

	var texture = Assets.textures.walls[0]["empty"];
	switch (nb) {
		case 1:
			texture = Assets.textures.walls[0]["endLine"];
		break;

		case 2:
		if ((east && west) || (south && north))
			texture = Assets.textures.walls[0]["twoSides"];
		else
			texture = Assets.textures.walls[0]["corner"];
		break;

		case 3:
		texture = Assets.textures.walls[0]["oneSide"];
		break;
	}

	var ts = new PIXI.extras.TilingSprite (texture, texture.width, texture.height);


	switch (nb) {
		case 1:
			if (south) {
				ts.anchor.x = 1;
				ts.anchor.y = 1;
				ts.rotation += Math.PI;
			} else if (east) {
				ts.anchor.x = 0;
				ts.anchor.y = 1;
				ts.rotation += Math.PI/2;
			} else if (west) {
				ts.anchor.x = 1;
				ts.anchor.y = 0;
				ts.rotation += -Math.PI/2;
			}
		break;

		case 2:
			if (east && west) {
				ts.anchor.x = 0;
				ts.anchor.y = 1;
				ts.rotation += Math.PI/2;
			} else if (north && west) {
				ts.anchor.x = 1;
				ts.anchor.y = 0;
				ts.rotation += -Math.PI/2;
			} else if (south && west) {
				ts.anchor.x = 1;
				ts.anchor.y = 1;
				ts.rotation += Math.PI;
			} else if (south && east) {
				ts.anchor.x = 0;
				ts.anchor.y = 1;
				ts.rotation += Math.PI/2;
			}
		break;

		case 3:
			if (!east) {
				ts.anchor.x = 1;
				ts.anchor.y = 0;
				ts.rotation += -Math.PI/2;
			} else if (!west) {
				ts.anchor.x = 0;
				ts.anchor.y = 1;
				ts.rotation += Math.PI/2;
			} else if (!north) {
				ts.anchor.x = 1;
				ts.anchor.y = 1;
				ts.rotation += Math.PI;
			}
		break;
	}

	return ts;
};

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
