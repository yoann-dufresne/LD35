var Assets = {
	tileSize: 32,
	loader: new PIXI.loaders.Loader(),
	loaded: false,
	//character: 'assets/testCercle.png',
	spriteSheetUrl: "art/tiles.png",
	tilesSheetCanvas: document.createElement("canvas"),
	tileCanvas: document.createElement("canvas"),

	img: null,
	subImgs: [],

	loadedWalls: false,
	loadedChar: false,
	loadedFloor: false,
	loadedAnimWalls: false,

	textures: {},

	extractSubImage: function(x, y, tilesSheetCanvas) {
		var tileCanvas = document.createElement("canvas");
		tileCanvas.width = Assets.tileSize;
		tileCanvas.height = Assets.tileSize;
		var tmpCtx = tileCanvas.getContext("2d");
		tmpCtx.drawImage(
			tilesSheetCanvas,
			x * Assets.tileSize,
			y * Assets.tileSize,
			Assets.tileSize, Assets.tileSize,
			0, 0,
			Assets.tileSize, Assets.tileSize
			);

		return tileCanvas;
	},

	loadChar: function(){
		charImg = new Image();
		charImg.onload = function () {
			var spriteSheetCanvas = document.createElement("canvas");
			spriteSheetCanvas.width = charImg.width;
			spriteSheetCanvas.height = charImg.height;
			spriteSheetCanvas.getContext("2d").drawImage(charImg, 0, 0);

			Assets.loadWallsHorror(spriteSheetCanvas);

			Assets.textures.character = [];
			for (var idx=0 ; idx<8 ; idx++) {
				var canvas = Assets.extractSubImage(6, idx, spriteSheetCanvas);
				Assets.textures.character[idx] = PIXI.Texture.fromCanvas(canvas);
			}
			Assets.loadedChar = true;
		}
		charImg.src = "art/animation.png";
	},

	loadWalls: function(){
		Assets.textures.walls = [];
		for (var i=0; i < tilesInfos.walls.length; i++){
			var walls = tilesInfos.walls[i];
			Assets.textures.walls[i] = {}
			for (var type in walls) {
				var canvas = Assets.extractSubImage(
					walls[type].x, walls[type].y, Assets.tilesSheetCanvas
				);
				Assets.textures.walls[i][type] = PIXI.Texture.fromCanvas(canvas);
			};
			Assets.loadedWalls=true;
		}
	},

	loadWallsHorror: function(spriteSheetCanvas){
		Assets.textures.wallsAnim = [];
		var wallTypes = tilesAnimInfos.wallsHorror;
		for (var wallType in wallTypes) {
			Assets.textures.wallsAnim[wallType] = [];
			for (var nb in wallTypes[wallType]){
		 		currWall = wallTypes[wallType][nb];
		 		var canvas = Assets.extractSubImage(
					currWall.x, currWall.y, spriteSheetCanvas
				);
				document.body.appendChild(canvas);
				console.log(wallType, nb);
				Assets.textures.wallsAnim[wallType][nb] = PIXI.Texture.fromCanvas(canvas);
			}
		}
		Assets.loadedAnimWalls = true;
	},


	loadFloor: function(){
		floarImg = new Image();
		floarImg.onload = function () {
			var floorCanvas = document.createElement("canvas");
			floorCanvas.width = Assets.tileSize;
			floorCanvas.height = Assets.tileSize;
			ctx = floorCanvas.getContext("2d");
			ctx.drawImage(floarImg, 0, 0);
			Assets.textures.floor = PIXI.Texture.fromCanvas(floorCanvas);
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
		var interv = setInterval(function() {
			if(Assets.loadedChar && Assets.loadedWalls && Assets.loadedFloor && Assets.loadedAnimWalls) {
				window.dispatchEvent(event);
				Assets.loaded = true;
				clearInterval(interv);
			}
		}, 10);
	},

	loadSpritesSheet: function(){
		Assets.img = new Image();
		Assets.img.onload = function () {
			Assets.separateSprintes ();
		};
		Assets.img.src = Assets.spriteSheetUrl;
	},

};

Assets.loadSpritesSheet();