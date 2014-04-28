Player = GameObject.extend({
    init: function (){
        this.maxHealth = 10;
		this.currentHealth = this.maxHealth;
		this.width = 100;
		this.height = 105;
		this.left = SnowGame.getGameScreenWidth()/2 - this.width/2;
		this.top = 0;
		this.speed = 10;
		this.score = 0;
		this.img = $('<img src="img/right.png" />')[0];
    },
	
	speed: null,
    maxHealth: null,
    currentHealth: null,
	score: null,
});