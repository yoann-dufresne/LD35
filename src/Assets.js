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

	loadedWalls: false,
	loadedChar: false,
	loadedFloor: false,

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

	loadChar: function(){
		charImg = new Image();
		charImg.onload = function () {
			charCanvas = document.createElement("canvas");
			charCanvas.width = Assets.tileSize;
			charCanvas.height = Assets.tileSize;
			ctx = charCanvas.getContext("2d");
			ctx.drawImage(charImg, 0, 0);
			Assets.textures.character = PIXI.Texture.fromCanvas(cloneCanvas(charCanvas));
			Assets.loadedChar = true;
		}
		charImg.src = "tmp_art/char.png";
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
			Assets.loadedWalls=true;
		}
	},

	loadFloor: function(){
		floarImg = new Image();
		floarImg.onload = function () {
			floorCanvas = document.createElement("canvas");
			floorCanvas.width = Assets.tileSize;
			floorCanvas.height = Assets.tileSize;
			ctx = floorCanvas.getContext("2d");
			ctx.drawImage(floarImg, 0, 0);
			Assets.textures.floor = PIXI.Texture.fromCanvas(cloneCanvas(floorCanvas));
			Assets.loadedFloor = true;
		}
		floarImg.src = "tmp_art/floor.png";
	},

	separateSprintes: function() {
		var tilesSheetCtx = Assets.tilesSheetCanvas.getContext("2d");
		Assets.tilesSheetCanvas.width = Assets.img.width;
		Assets.tilesSheetCanvas.height = Assets.img.height;
		tilesSheetCtx.drawImage(Assets.img, 0, 0);
		Assets.loadChar();
		Assets.loadWalls();
		Assets.loadFloor();

		var event = new Event('loadingComplete');
		setTimeout(function() {
			if(Assets.loadedChar && Assets.loadedWalls && Assets.loadedFloor) {
				window.dispatchEvent(event);
				Assets.loaded = true;
			}
		}, 10);
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