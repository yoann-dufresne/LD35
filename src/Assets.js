function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

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

	textures: {},

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

	loadWalls: function(){
		Assets.textures.walls = [];
		for (var i=0; i < tilesInfos.walls.length; i++){
			var walls = tilesInfos.walls[i];
			Assets.textures.walls[i] = {}
			for (var type in walls) {
				Assets.extractSubImage(
					walls[type].x, walls[type].y, Assets.img
				);
				Assets.textures.walls[i][type] = PIXI.Texture.fromCanvas(cloneCanvas(Assets.tileCanvas));
			};
		}
	},

	separateSprintes: function() {
		var tilesSheetCtx = Assets.tilesSheetCanvas.getContext("2d");
		Assets.tilesSheetCanvas.width = Assets.img.width;
		Assets.tilesSheetCanvas.height = Assets.img.height;
		tilesSheetCtx.drawImage(Assets.img, 0, 0);
		Assets.loadWalls();
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