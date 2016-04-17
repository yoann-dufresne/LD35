function Maze (width, height) {
	this.width = width;
	this.height = height;

	this.charLine = height/2 + 0.5;
	this.charCol = width/2 + 0.5;
	this.speed = 5;

	this.walls = [];
	for (var line=0 ; line<height ; line++) {
		this.walls[line] = [];
		for (var col=0 ; col<this.width ; col++)
			this.walls[line][col] = false;
	}

	this.createWalls (100);
};

Maze.prototype = {
	createWalls: function (size) {
		var candidates = [];
		for (var line=0 ; line<this.height ; line++)
			for (var col=0 ; col<this.width ; col++)
				candidates.push({"line":line, "col":col});

		var idx = _.findIndex (candidates, {"line":this.height/2, "col":this.width/2});
		candidates.splice(idx, 1);

		_.shuffle(candidates);

		while (candidates.length > 0) {
			var tile = candidates[0];
			candidates.splice(0, 1);

			var possible = true;
			for (var line=tile.line-1 ; line<=tile.line+1 && possible ; line++) {
				if (this.walls[line] == undefined)
					continue;

				for (var col=tile.col-1 ; col<=tile.col+1 ; col++) {
					if (this.walls[line][col] == undefined)
						continue;

					if (this.walls[line][col]) {
						possible = false;
						break;
					}
				}
			}
			if (!possible)
				continue;

			this.walls[tile.line][tile.col] = true;
			var walls = [];
			walls.push(tile);

			while (walls.length > 0 && Math.random() > (1/size)) {
				idx = Math.floor(Math.random()*walls.length);
				tile = walls[idx];
				var free = this.getFreeNeighbors(tile);

				if (free.length == 0)
					walls.splice(idx, 1);
				else {
					idx = Math.floor(Math.random()*free.length);
					tile = free[idx];
					this.walls[tile.line][tile.col] = true;
					walls.push(tile);
				}
			}
		}
		this.loaded = true;
	},

	getFreeNeighbors: function (tile) {
		var free = [];

		// North
		if ((this.walls[tile.line-1] != undefined && this.walls[tile.line-1][tile.col-1] != undefined && !this.walls[tile.line-1][tile.col-1])
			&& (this.walls[tile.line-1] != undefined && this.walls[tile.line-1][tile.col+1] != undefined && !this.walls[tile.line-1][tile.col+1])
			&& (this.walls[tile.line-2] != undefined && this.walls[tile.line-2][tile.col] != undefined && !this.walls[tile.line-2][tile.col])
			&& (this.walls[tile.line-2] != undefined && this.walls[tile.line-2][tile.col-1] != undefined && !this.walls[tile.line-2][tile.col-1])
			&& (this.walls[tile.line-2] != undefined && this.walls[tile.line-2][tile.col+1] != undefined && !this.walls[tile.line-2][tile.col+1]))
			free.push({"line":tile.line-1, "col":tile.col});

		// South
		if ((this.walls[tile.line+1] != undefined && this.walls[tile.line+1][tile.col-1] != undefined && !this.walls[tile.line+1][tile.col-1])
			&& (this.walls[tile.line+1] != undefined && this.walls[tile.line+1][tile.col+1] != undefined && !this.walls[tile.line+1][tile.col+1])
			&& (this.walls[tile.line+2] != undefined && this.walls[tile.line+2][tile.col] != undefined && !this.walls[tile.line+2][tile.col])
			&& (this.walls[tile.line+2] != undefined && this.walls[tile.line+2][tile.col-1] != undefined && !this.walls[tile.line+2][tile.col-1])
			&& (this.walls[tile.line+2] != undefined && this.walls[tile.line+2][tile.col+1] != undefined && !this.walls[tile.line+2][tile.col+1]))
			free.push({"line":tile.line+1, "col":tile.col});

		// East
		if ((this.walls[tile.line-1] != undefined && this.walls[tile.line-1][tile.col+1] != undefined && !this.walls[tile.line-1][tile.col+1])
			&& (this.walls[tile.line-1] != undefined && this.walls[tile.line-1][tile.col+2] != undefined && !this.walls[tile.line-1][tile.col+2])
			&& (this.walls[tile.line] != undefined && this.walls[tile.line][tile.col+2] != undefined && !this.walls[tile.line][tile.col+2])
			&& (this.walls[tile.line+1] != undefined && this.walls[tile.line+1][tile.col+1] != undefined && !this.walls[tile.line+1][tile.col+1])
			&& (this.walls[tile.line+1] != undefined && this.walls[tile.line+1][tile.col+2] != undefined && !this.walls[tile.line+1][tile.col+2]))
			free.push({"line":tile.line, "col":tile.col+1});

		// West
		if ((this.walls[tile.line-1] != undefined && this.walls[tile.line-1][tile.col-1] != undefined && !this.walls[tile.line-1][tile.col-1])
			&& (this.walls[tile.line-1] != undefined && this.walls[tile.line-1][tile.col-2] != undefined && !this.walls[tile.line-1][tile.col-2])
			&& (this.walls[tile.line] != undefined && this.walls[tile.line][tile.col-2] != undefined && !this.walls[tile.line][tile.col-2])
			&& (this.walls[tile.line+1] != undefined && this.walls[tile.line+1][tile.col-1] != undefined && !this.walls[tile.line+1][tile.col-1])
			&& (this.walls[tile.line+1] != undefined && this.walls[tile.line+1][tile.col-2] != undefined && !this.walls[tile.line+1][tile.col-2]))
			free.push({"line":tile.line, "col":tile.col-1});

		return free;
	}
};

var maze = new Maze(100, 100);
