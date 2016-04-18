const CHAR_ANIM_RATE = 6;
const SHADOW_RATE = 36;
const WALL_RATE = 15;

function Stage (renderer, maze) {
	PIXI.Container.call(this);
	this.renderer = renderer;
	this.maze = maze;
	this.wallsRendered = [];
	this.radius = 300;

	this.character = Assets.textures.character[0];
	this.character = new PIXI.Sprite(this.character, this.character.width, this.character.height);
	this.character.x = this.renderer.width/2;
	this.character.y = this.renderer.height/2;
	this.character.anchor.x = 0.5;
	this.character.anchor.y = 0.5;
	this.character.frame = 0;

	this.floorRendered = [];
	this.frame = CHAR_ANIM_RATE;

	this.blackFog = new PIXI.Graphics();
	this.blackFog.lineStyle ( 2 , 0x000000,  1);
	this.blackFog.beginFill(this.colour);
	this.blackFog.drawCircle(renderer.width / 2, renderer.height / 2, this.radius);

	var canvas = document.createElement('canvas');
	canvas.width = this.renderer.width;
	canvas.height = this.renderer.height;
	var ctx = canvas.getContext('2d');
	var gradient = ctx.createLinearGradient(0,0,170,0);
	gradient.addColorStop(0,"black");
	gradient.addColorStop(1,"white");

	ctx.fillStyle = gradient;
	ctx.fillRect(20,20,150,100);

	var texture = PIXI.Texture.fromCanvas(canvas);
	// blackFog.filters = [new PIXI.AlphaMaskFilter(texture)];

	this.blackFog.position.x = renderer.width / 2;
	this.blackFog.position.y = renderer.height / 2;
	// this.addChild(blackFog);
	this.mask = this.blackFog;
	this.mask.frame = SHADOW_RATE;


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
					var sprite = that.selectSprite (line, col, Assets.textures.wallsAnim);
					that.wallsRendered[line][col] = sprite;
					that.addChildAt(sprite, that.children.length);
				} else {
					that.wallsRendered[line][col] = null;
				}
			}
		}
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
	this.tilesAnimation();
	this.charAnimation();
	this.shadowAnimation();
};

Stage.prototype.tilesAnimation = function () {
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

				ts.frame--;
				if (ts.frame <= 0) {
					ts.step = (ts.step + 1) % ts.textures.length;
					ts.texture = ts.textures[ts.step];
					ts.frame = WALL_RATE;
				}
			}
		}
	}
}

Stage.prototype.charAnimation = function () {
	var dx = this.maze.charCol - this.maze.oldCharCol;
	var dy = this.maze.charLine - this.maze.oldCharLine;

	if (dx == 0 && dy == 0) {
		this.character.texture = Assets.textures.character[0];
		this.frame = 1;
	} else {
		this.frame--;
		if (this.frame == 0) {
			this.character.frame = (this.character.frame + 1) % Assets.textures.character.length;
			this.character.texture = Assets.textures.character[this.character.frame];
			this.frame = CHAR_ANIM_RATE;
		}
	}

	if (dx > 0 && dy == 0) {
		vue.stage.character.rotation = Math.PI/2;
	} else if (dx < 0 && dy == 0) {
		vue.stage.character.rotation = -Math.PI/2;
	} else if (dx == 0 && dy > 0) {
		vue.stage.character.rotation = Math.PI;
	} else if (dx == 0 && dy < 0) {
		vue.stage.character.rotation = 0;
	} else if (dx > 0 && dy > 0) {
		vue.stage.character.rotation = 3*Math.PI/4;
	} else if (dx > 0 && dy < 0) {
		vue.stage.character.rotation = Math.PI/4;
	} else if (dx < 0 && dy > 0) {
		vue.stage.character.rotation = -3*Math.PI/4;
	} else if (dx < 0 && dy < 0) {
		vue.stage.character.rotation = -Math.PI/4;
	}

	this.maze.oldCharCol = this.maze.charCol;
	this.maze.oldCharLine = this.maze.charLine;
}

Stage.prototype.shadowAnimation = function () {
	this.mask.frame--;

	if (this.mask.frame == 0 && this.radius > 1) {
		this.radius = Math.max (2, this.radius - 3);
		this.blackFog.clear();
		this.blackFog.lineStyle ( 2 , 0x000000,  1);
		this.blackFog.beginFill(this.colour);
		this.blackFog.drawCircle(this.renderer.width/2, this.renderer.height/2, this.radius);
		this.mask.frame = SHADOW_RATE;
	}
}

Stage.prototype.selectSprite = function (line, col, textures, sprite) {
	var north = this.maze.walls[line-1] == undefined || this.maze.walls[line-1][col] == undefined ? false : this.maze.walls[line-1][col];
	var south = this.maze.walls[line+1] == undefined || this.maze.walls[line+1][col] == undefined ? false : this.maze.walls[line+1][col];
	var west = this.maze.walls[line] == undefined || this.maze.walls[line][col-1] == undefined ? false : this.maze.walls[line][col-1];
	var east = this.maze.walls[line] == undefined || this.maze.walls[line][col+1] == undefined ? false : this.maze.walls[line][col+1];

	var nb = north ? 1 : 0;
	nb += south ? 1 : 0;
	nb += east ? 1 : 0;
	nb += west ? 1 : 0;

	var texture = textures["empty"];
	switch (nb) {
		case 0:
			texture = textures["full"];
		break;
		case 1:
			texture = textures["endLine"];
		break;

		case 2:
		if ((east && west) || (south && north))
			texture = textures["twoSides"];
		else
			texture = textures["corner"];
		break;

		case 3:
		texture = textures["oneSide"];
		break;
	}

	var ts;
	var rnd = Math.floor(Math.random() * texture.length);
	if (sprite == undefined)
		ts = new PIXI.Sprite (texture[rnd], texture[rnd].width, texture[rnd].height);
	else {
		ts = sprite;
		ts.texture = texture[rnd];
	}
	ts.step = rnd;
	ts.frame = Math.floor(Math.random() * WALL_RATE);
	ts.textures = texture;


	switch (nb) {
		case 1:
			if (south) {
				ts.anchor.x = 1;
				ts.anchor.y = 1;
				ts.rotation = Math.PI;
			} else if (east) {
				ts.anchor.x = 0;
				ts.anchor.y = 1;
				ts.rotation = Math.PI/2;
			} else if (west) {
				ts.anchor.x = 1;
				ts.anchor.y = 0;
				ts.rotation = -Math.PI/2;
			} else {
				ts.anchor.x = 0;
				ts.anchor.y = 0;
				ts.rotation = 0;
			}
		break;

		case 2:
			if (east && west) {
				ts.anchor.x = 0;
				ts.anchor.y = 1;
				ts.rotation = Math.PI/2;
			} else if (north && west) {
				ts.anchor.x = 1;
				ts.anchor.y = 0;
				ts.rotation = -Math.PI/2;
			} else if (south && west) {
				ts.anchor.x = 1;
				ts.anchor.y = 1;
				ts.rotation = Math.PI;
			} else if (south && east) {
				ts.anchor.x = 0;
				ts.anchor.y = 1;
				ts.rotation = Math.PI/2;
			} else {
				ts.anchor.x = 0;
				ts.anchor.y = 0;
				ts.rotation = 0;
			}
		break;

		case 3:
			if (!east) {
				ts.anchor.x = 1;
				ts.anchor.y = 0;
				ts.rotation = -Math.PI/2;
			} else if (!west) {
				ts.anchor.x = 0;
				ts.anchor.y = 1;
				ts.rotation = Math.PI/2;
			} else if (!north) {
				ts.anchor.x = 1;
				ts.anchor.y = 1;
				ts.rotation = Math.PI;
			} else {
				ts.anchor.x = 0;
				ts.anchor.y = 0;
				ts.rotation = 0;
			}
		break;
	}

	return ts;
};
