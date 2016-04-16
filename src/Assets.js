var Assets = {
	tileSize: 32,
	loader: new PIXI.loaders.Loader(),
	loaded: false,
	//character: 'assets/testCercle.png',
	
	loadSprites: function (onLoad) {
		var that = this;

		this.loader.add("broc", "tmp_art/broc.png");
		this.loader.once('complete', function() {
			console.log("Assets loaded");
			that.loaded = true;
		});
		this.loader.load();
	}

};

Assets.loadSprites();