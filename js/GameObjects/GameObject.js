GameObject = Class.extend({
    left: null,
    top: null,
    width: null,
	height: null,
	img: null,
	
    updatePosition: function (left, top) {
        this.left = left;
        this.top = top;
    },
	
	draw: function(){
		ctx.save();
		ctx.drawImage(this.img, this.left, this.top, this.width, this.height);
		ctx.restore();
	}
});