
function Stage (renderer, maze) {
	PIXI.Container.call(this);
	this.renderer = renderer;
	this.maze = maze;
	this.wallsRendered = [];

	this.character = Assets.textures.character;
	this.character = new PIXI.Sprite(this.character, this.character.width, this.character.height);
	this.character.x = this.renderer.width/2;
	this.character.y = this.renderer.height/2;
	this.character.anchor.x = 0.5;
	this.character.anchor.y = 0.5;

	this.floorRendered = [];

	var that = this;
	var generate = function () {
		for (var line=0 ; line<maze.height ; line++) {
			that.floorRendered[line] = [];
			for (var col=0 ; col<maze.width ; col++) {
				var floor = Assets.textures.floor;
				floor = new PIXI.Sprite(floor, floor.width, floor.height);
				that.floorRendered[line][col] = floor;
				that.addChildAt(floor, line*this.maze.width + col);
			}
		}

		that.addChildAt(that.character, that.children.length);

		for (var line=0 ; line<maze.height ; line++) {
			that.wallsRendered[line] = [];
			for (var col=0 ; col<maze.width ; col++) {
				if (maze.walls[line][col]){
					var sprite = that.selectSprite (line, col);
					that.wallsRendered[line][col] = sprite;
					that.addChildAt(sprite, that.children.length);
				} else {
					that.wallsRendered[line][col] = null;
				}
			}
		}
		console.log("Toto");
	}

	var trigger = function() {
		if (that.maze.loaded)
			generate();
		else
			setTimeout (trigger, 10);
	}
	trigger();

	this.updateRequired = true;
}

Stage.prototype = Object.create(PIXI.Container.prototype, {
	constructor: { value: Stage }
});

Stage.prototype.refresh = function () {
	var cLine = this.maze.charLine;
	var cCol = this.maze.charCol;

	for (var line=0 ; line<this.maze.height; line++) {
		for (var col=0 ; col<this.maze.width ; col++) {
			var floor = this.floorRendered[line][col];
				floor.position.y = this.renderer.height/2 + (line-cLine) * Assets.tileSize;
				floor.position.x = this.renderer.width/2 + (col-cCol) * Assets.tileSize;

			if (this.wallsRendered[line][col] != null) {
				var ts = this.wallsRendered[line][col]; // this.renderer.width
				ts.position.y = this.renderer.height/2 + (line-cLine) * Assets.tileSize;
				ts.position.x = this.renderer.width/2 + (col-cCol) * Assets.tileSize;
			}
		}
	}
};

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

	var ts = new PIXI.Sprite (texture, texture.width, texture.height);


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
