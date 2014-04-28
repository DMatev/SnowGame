Rock = GameObject.extend({
    init: function (){
		this.width = 15;
		this.height = 14;
		this.left = Math.floor((Math.random()*(SnowGame.getGameScreenWidth() - this.width))+1);
		this.top = SnowGame.getGameScreenHeight() - this.height;
		this.img = $('<img src="img/Rock.png" />')[0];
    }
});