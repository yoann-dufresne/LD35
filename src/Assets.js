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

	texture: null,

	extractSubImage: function(x, y) {
		Assets.tileCanvas.width = Assets.tileSize;
		Assets.tileCanvas.height = Assets.tileSize;
		var tmpCtx = Assets.tileCanvas.getContext("2d");
		tmpCtx.drawImage(
			Assets.tilesSheetCanvas,
			x * Assets.tileSize,
			y * Assets.tileSize,
			Assets.tileSize, Assets.tileSize,
			0, 0,
			Assets.tileSize, Assets.tileSize
			);
	},

	separateSprintes: function() {
		var tilesSheetCtx = Assets.tilesSheetCanvas.getContext("2d");
		Assets.tilesSheetCanvas.width = Assets.img.width;
		Assets.tilesSheetCanvas.height = Assets.img.height;
		tilesSheetCtx.drawImage(Assets.img, 0, 0);
		var walls = tilesInfos.walls[0];
		for (var type in walls) {
			Assets.extractSubImage(
					walls[type].x, walls[type].y, Assets.img
			) ;
			Assets.texture = PIXI.Texture.fromCanvas(Assets.tileCanvas);
		};
		var event = new Event('loadingComplete');
		window.dispatchEvent(event);
	},

	loadSpritesSheet: function(){
		Assets.img = new Image();
		Assets.img.onload = function () {
			Assets.separateSprintes ();
		};
		Assets.img.src = Assets.sprintSheetURL;
	},

};

Assets.loadSpritesSheet();