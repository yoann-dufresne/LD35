function depthCompare(a,b) {
	if (a.z < b.z)
		return -1;
	if (a.z > b.z)
		return 1;
	return 0;
}

function Vue (model, controler) {
	this.renderer = PIXI.autoDetectRenderer(680, 680,{backgroundColor : 0x444444});
	document.body.appendChild(this.renderer.view);
	this.maze = maze;
	this.controler = controler;

	this.stats = new Stats();


	document.body.appendChild( this.stats.domElement );
	this.stats.domElement.style.position = "absolute";
	this.stats.domElement.style.top = "0px";

	var that = this;
	window.addEventListener('loadingComplete',
		function (e) {
			that.stage = new Stage(that.renderer, that.maze);
		},
		false);
}

Vue.prototype = {

	startAnimation: function () {
		// Start the animation
		this.animate();
	},

	animate: function () {
		this.stats.begin();

		if (Assets.loaded && this.stage) {

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
	},


}

var vue = new Vue (maze, controler);
vue.startAnimation();
