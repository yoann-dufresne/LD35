var Assets = {
	tileSize: 32,
	loader: new PIXI.loaders.Loader(),
	loaded: false,
	//character: 'assets/testCercle.png',
	sprintSheetURL: "art/tiles.png",
	tilesSheetCanvas: document.createElement("canvas"),
	tileCanvas: document.createElement("canvas"),

	img: null,
	subImgs: [],

	extractSubImage: function(x, y) {
		var tmpCtx = Assets.tileCanvas.getContext("2d");
		tmpCtx.drawImage(
			Assets.tilesSheetCanvas,
			x * Assets.tileSize,
			y * Assets.tileSize,
			Assets.tileSize, Assets.tileSize,
			0, 0,
			Assets.tileSize, Assets.tileSize
			);
		return Assets.tileCanvas.toDataURL("image/png");
	},

	separateSprintes: function() {
		var tilesSheetCtx = Assets.tilesSheetCanvas.getContext("2d");
		Assets.tilesSheetCanvas.width = Assets.img.width;
		Assets.tilesSheetCanvas.height = Assets.img.height;
		tilesSheetCtx.drawImage(Assets.img, 0, 0);

		var walls = tilesInfos.walls[0];
		for (var type in walls) {
			var tile = Assets.extractSubImage(
									walls[type].x, walls[type].x, Assets.img
								) ;
			console.log(tile);
		};
	},

	loadSpritesSheet: function(){
		Assets.img = new Image();
		Assets.img.onload = function () {
			Assets.separateSprintes ();
		};
		Assets.img.src = Assets.sprintSheetURL;
	},

	loadSprites: function () {
		var that = this;

		this.loader.add("broc", "tmp_art/broc.png");
		this.loader.once('complete', function() {
			console.log("Assets loaded");
			that.loaded = true;
		});
		this.loader.load();
	}

};

Assets.loadSpritesSheet();
//Assets.loadSprites();