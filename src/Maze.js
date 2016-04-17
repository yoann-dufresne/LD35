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

		var idx = candidates.indexOf ({"line":this.height/2, "col":this.width/2});
		console.log(idx);
		candidates.splice(idx, 1);

		while (candidates.length > 0) {
			var rnd = Math.floor(Math.random()*candidates.length);
			var tile = candidates[rnd];
			candidates.splice(rnd, 1);
			this.walls[tile.line][tile.col] = true;
			//console.log(tile);
		
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

					for (var line=tile.line-1 ; line<=tile.line+1 ; line++)
						for (var col=tile.col-1 ; col<=tile.col+1 ; col++) {
							idx = candidates.indexOf ({"line":line, "col":col});
							//console.log(idx);
							if (idx >= 0)
								candidates.splice(idx, 1);
						}
				}
			}
		}
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
