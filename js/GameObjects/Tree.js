Tree = GameObject.extend({
    init: function (){
		this.width = 55;
		this.height = 69;
		this.left = Math.floor((Math.random()*(SnowGame.getGameScreenWidth() - this.width))+1);
		this.top = SnowGame.getGameScreenHeight() - this.height;
		this.img = $('<img src="img/Tree.png" />')[0];
    }
});