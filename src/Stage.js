
function Stage (renderer, model) {
	PIXI.Container.call(this);
	this.renderer = renderer;
	this.model = model;

	for (var line=0 ; line<model.walls.length ; line++)
		for (var col=0 ; col<model.walls[line].length ; col++)
			if (model.walls[line][col]){
				var broc = Assets.loader.resources.broc.texture;
				var ts = new PIXI.extras.TilingSprite (broc, broc.width, broc.height);
				ts.z = 1;
				this.addChild(ts);
				ts.position.y = line * Assets.tileSize;
				ts.position.x = col * Assets.tileSize;
			}
}

Stage.prototype = Object.create(PIXI.Container.prototype, {
	constructor: { value: Stage }
});

Stage.prototype.refresh = function () {
	
};
