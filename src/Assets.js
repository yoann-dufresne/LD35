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
	loadedAnim: false,
	loadedItems: false,

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

			Assets.loadAnims(spriteSheetCanvas);

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


	loadItems: function(){
		bottle1 = tilesInfos.bottle1;
		Assets.textures.bottle1 = Assets.extractSubImage(bottle1.x, bottle1.y, Assets.tilesSheetCanvas);

		bottle2 = tilesInfos.bottle1;
		Assets.textures.bottle2 = Assets.extractSubImage(bottle2.x, bottle2.y, Assets.tilesSheetCanvas);

		acid1 = tilesInfos.acid1;
		Assets.textures.acid1 = Assets.extractSubImage(acid1.x, acid1.y, Assets.tilesSheetCanvas);

		acid2 = tilesInfos.acid2;
		Assets.textures.acid2 = Assets.extractSubImage(acid2.x, acid2.y, Assets.tilesSheetCanvas);

		fountain1 = tilesInfos.fountain1;
		Assets.textures.fountain1 = Assets.extractSubImage(fountain1.x, fountain1.y, Assets.tilesSheetCanvas);

		fountain2 = tilesInfos.fountain1;
		Assets.textures.fountain2 = Assets.extractSubImage(fountain2.x, fountain2.y, Assets.tilesSheetCanvas);

		Assets.loadedItems=true;
	},

	loadAnims: function(spriteSheetCanvas){
		Assets.textures.wallsAnim = {};
		var wallTypes = tilesAnimInfos.wallsHorror;
		for (var wallType in wallTypes) {
			Assets.textures.wallsAnim[wallType] = [];
			for (var nb in wallTypes[wallType]){
		 		currWall = wallTypes[wallType][nb];
		 		var canvas = Assets.extractSubImage(
					currWall.x, currWall.y, spriteSheetCanvas
				);
				Assets.textures.wallsAnim[wallType][nb] = PIXI.Texture.fromCanvas(canvas);
			}
		}

		Assets.textures.eye = [];
		var eyes = tilesAnimInfos.eye;
		for (eye in eyes){
			var canvas = Assets.extractSubImage(
					eyes[eye].x, eyes[eye].y, spriteSheetCanvas
				);
				Assets.textures.eye.push(canvas)
		}
		Assets.loadedAnim = true;
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
		Assets.loadItems();

		var event = new Event('loadingComplete');
		var interv = setInterval(function() {
			if(Assets.loadedChar && Assets.loadedWalls && Assets.loadedFloor && Assets.loadedAnim && Assets.loadedItems) {
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