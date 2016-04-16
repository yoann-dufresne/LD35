function depthCompare(a,b) {
	if (a.z < b.z)
		return -1;
	if (a.z > b.z)
		return 1;
	return 0;
}

function Vue (model, controler) {
	this.renderer = PIXI.autoDetectRenderer(800, 600,{backgroundColor : 0xE42217});
	document.body.appendChild(this.renderer.view);
	this.model = model;
	//this.controler = controler;

	var that = this;
	Assets.loader.once("complete", function () {
		that.stage = new Stage(that.renderer, that.model);
	});
}

Vue.prototype = {

	startAnimation: function () {
		// Start the animation
		this.animate();
	},

	animate: function () {
		if (Assets.loaded && this.stage) {

			// 1 - Input
			//this.controler.refresh ();

			// 2 - Move
			this.stage.refresh ();

			// // 3 - Collisions
			// // Automatic (listeners)

			// // 4 - Send data through the network
			// // TODO

			// 5 - Render the scene
			this.stage.children.sort(depthCompare);
			this.renderer.render(this.stage);
		}

		requestAnimationFrame(function () {vue.animate();});
	},


}

var vue = new Vue (maze, null)//, model, controler);
//vue.initMenu();
//vue.initButtons();
//vue.changeStage("test");
vue.startAnimation();
