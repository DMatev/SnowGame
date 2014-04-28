Snow = Class.extend({
    init: function (){
		this.radius =  Math.floor((Math.random()*7)+1);
		this.left = Math.floor((Math.random()*(SnowGame.getGameScreenWidth() - this.radius))+1);
		this.top = this.radius;
		this.speed = 7;
    },
	
	radius: null,
	left:null,
	top: null,
	speed: null,
	
	draw: function(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle="#E8E4E3";
		ctx.arc(this.left, (this.top + this.radius), this.radius, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
});