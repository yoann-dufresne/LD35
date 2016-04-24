function depthCompare(a,b) {
	if (a.z < b.z)
		return -1;
	if (a.z > b.z)
		return 1;
	return 0;
}

function Vue (model, controler) {
	this.renderer = PIXI.autoDetectRenderer(680, 680,{backgroundColor : 0x444444});
	var element = $(".pixi-container")[0];
	element.appendChild(this.renderer.view);

	this.maze = maze;
	this.controler = controler;

	this.stats = new Stats();
	this.fpsStats = [];
	$(".stats")[0].appendChild( this.stats.domElement );

	var that = this;
	window.addEventListener('loadingComplete',
		function (e) {
			that.stage = new Stage(that.renderer, that.maze);
		},
		false);
}

Vue.prototype = {

	startAnimation: function () {
		var that = this;
		window.addEventListener('gameover', function (e) {that.ended=true}, false);
		this.ended = false;

		// Start the animation
		this.animate();
	},

	animate: function () {
		this.stats.begin();
		var tic = ( performance || Date ).now();

		if (Assets.loaded && this.stage && !this.ended) {

			// 1 - Input
			this.controler.refresh ();

			// 2 - Move
			this.stage.refresh ();

			// 3 - Collisions
			// Automatic (listeners)

			// // 4 - Send data through the network
			// // TODO

			// 5 - Render the scene
			this.renderer.render(this.stage);
		}

		requestAnimationFrame(function () {vue.animate();});
		this.stats.end();
		this.fpsStats.push(( performance || Date ).now() - tic);
	},


}

var vue = new Vue (maze, controler);

$(function(){
		vue.startAnimation();
	}
)
