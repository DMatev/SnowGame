var ctx;

var SnowGame = (function() {
	var startBtn, pauseBtn;
	
	$(document).ready(function(){
		startBtn = $('#StartBtn');
		pauseBtn = $('#PauseBtn');
		ctx =  $('#GameScreen')[0].getContext('2d');
		pauseBtn.hide();
		startBtn.on('click', function() {
			SnowGame.init();
		});
		pauseBtn.on('click', function() {
			if(!SnowGame.isGameOver()){
				if(this.innerHTML == 'Pause'){
					this.innerHTML = 'Resume';
					} else {
					this.innerHTML = 'Pause';
					}
				SnowGame.togglePause();
			}
		});
	});
	var Timer = {
		init: function(){
			this.time = 0;
		},
		time: null,
		nowMs: null,
		increment: function(){
			this.time += Game.refreshTimeMS;
		}
	}
	var Game = {
		mainLoop: function(){
			Timer.increment();
			Game.spawnRock();
			Game.spawnTree();
			Game.spawnSnow();
			Game.updateScreen();
			Game.interactionManager();
			if(Timer.time == 15000){
				Game.makeHarder();
			}
			if(Timer.time == 35000){
				Game.makeHarder();
			}
			if(Timer.time == 45000){
				Game.makeHarder();
			}			
		},
		init: function(){
				Timer.time = 0;
				this.isPaused = false;
				this.isGameOver = false;
				this.scoreScale = 1;
				this.lastTreeSpawnTimestamp = -1;
				this.TreeSpawnFrequencyMs = 1000;
				this.TreeSpeed = 5;
				this.lastRockSpawnTimestamp = -1;
				this.RockSpawnFrequencyMs = 1000;
				this.lastSnowSpawnTimestamp = -1;
				this.lastSnowSpawnFrequencyMs = 300;
				this.RockSpeed = 5;
				this.LastMoveRight = true;
				this.Player = new Player();
				this.Player.draw();
				this.backgroundImg =  $('<img src="img/background.jpg" />')[0];
				this.backgroundOffset = 0;

		},
		refreshTimeMS: 25,
		gameInterval: null,
		isPaused: null,
		isGameOver: true,
		scoreScale: null,
		
		mainScreenWidth: 800,
		mainScreenHeight: 500,
		scoreScreenWidth: 200,
		scoreScreenHeight: 40,
		timerScreenWidth: 400,
		timerScreenHeight: 40,
		healthScreenWidth: 200,
		healthScreenHeight: 40,
		holeScreenWidth: 800,
		holeScreenHeight: 540,
		
		lastTreeSpawnTimestamp: null,
		TreeSpawnFrequencyMs: null,
		TreeSpeed: null,
		lastRockSpawnTimestamp: null,
		RockSpawnFrequencyMs: null,
		RockSpeed: null,
		lastSnowSpawnTimestamp: null,
		lastSnowSpawnFrequencyMs: null,
		LastMoveRight: null,	
		Player: null,
		Trees: [],
		Rocks: [],
		Snows: [],
		
		backgroundImg: null,
		backgroundOffset: null,
		
		makeHarder: function (){
			this.speedUp();
			this.TreeSpawnFrequencyMs -= 300;
			this.RockSpawnFrequencyMs -= 300;
		},
		speedUp: function(){
			this.TreeSpeed += 1;
			this.RockSpeed += 1;
			this.scoreScale += 5;
		},
		slowDown: function(){
			if(this.scoreScale > 5){
				this.TreeSpeed -= 1;
				this.RockSpeed -= 1;
				this.scoreScale -= 5;
			}
		},
		
		trackPlayerMove: function(e){
			if(e.keyCode == 39){ //right
				if((Game.Player.left + Game.Player.width + Game.Player.speed) <= Game.mainScreenWidth){
					Game.Player.updatePosition(Game.Player.left + Game.Player.speed, Game.Player.top);
					if(!Game.LastMoveRight){
						Game.Player.img.src = 'img/right.png'
						Game.LastMoveRight = true;
						}
				}
			}	
			if(e.keyCode == 37){ //left
				if((Game.Player.left - Game.Player.speed) >= 0){
					Game.Player.updatePosition(Game.Player.left - Game.Player.speed, Game.Player.top);
					if(Game.LastMoveRight){
						Game.Player.img.src = 'img/left.png'
						Game.LastMoveRight = false;
					}
				}
			}
			if(e.keyCode == 38){ //up
				Game.slowDown();
			}
			if(e.keyCode == 40){ //down
				Game.speedUp();
			}
		},
		spawnTree: function(){
			Timer.nowMs = Date.now();
			if(Timer.nowMs - Game.lastTreeSpawnTimestamp > Game.TreeSpawnFrequencyMs){
				Game.lastTreeSpawnTimestamp = Timer.nowMs;
				Game.Trees.push(new Tree());
			}
		},
		spawnRock: function(){
			Timer.nowMs = Date.now();
			if(Timer.nowMs - Game.lastRockSpawnTimestamp > Game.RockSpawnFrequencyMs){
				Game.lastRockSpawnTimestamp = Timer.nowMs;
				Game.Rocks.push(new Rock());
			}
		},
		spawnSnow: function(){
			Timer.nowMs = Date.now();
			if(Timer.nowMs - Game.lastSnowSpawnTimestamp > Game.lastSnowSpawnFrequencyMs){
				Game.lastSnowSpawnTimestamp = Timer.nowMs;
				Game.Snows.push(new Snow());
			}
			
		},
		updateScreen: function(){	
			ctx.clearRect(0, 0, Game.holeScreenWidth, Game.holeScreenHeight);
			Game.drawBackground();
			Game.Player.draw();
			for(var i=0; i<Game.Rocks.length; i++){
				Game.Rocks[i].draw();
			}
			for(var i=0; i<Game.Trees.length; i++){
				Game.Trees[i].draw();
			}
			for(var i=0; i<Game.Snows.length; i++){
				Game.Snows[i].draw();
			}
			Game.drawScore();
			Game.drawTimer();
			Game.drawHealthBar();

		},
		detectCollision: function(obj1,obj2){
			var hit = ((obj1.top < (obj2.top +obj2.height)) &&
							((obj1.left + obj1.width) > obj2.left) && ((obj1.left + obj1.width) < (obj2.left + obj2.width))) ||
							((obj1.top < (obj2.top + obj2.height)) &&
							(obj1.left > obj2.left) && (obj1.left < (obj2.left + obj2.width)))
			return hit;
		},
		interactionManager: function(){
			Game.Player.score += Game.scoreScale;
			for(var i=0; i<Game.Trees.length; i++){
				//moving trees
				if((Game.Trees[i].top - Game.TreeSpeed) >= 0){
					Game.Trees[i].updatePosition(Game.Trees[i].left, Game.Trees[i].top - Game.TreeSpeed);
				} else {
					Game.Trees.splice(i,1);
					if(i > 0){
						i--;
					} else {
						break;
					}
				}
				//detecting tree hit a player
				if(Game.detectCollision(Game.Trees[i], Game.Player)){
					Game.Trees.splice(i,1);
					Game.playerTakeDmg(1);
					if(i > 0){
						i--;
					} else {
						break;
					}
				}
			}
			for(var i=0; i<Game.Rocks.length; i++){
				//moving rocks
				if((Game.Rocks[i].top - Game.RockSpeed) >= 0){
					Game.Rocks[i].updatePosition(Game.Rocks[i].left, Game.Rocks[i].top - Game.RockSpeed);
				} else {
					Game.Rocks.splice(i,1);
					if(i > 0){
						i--;
					} else {
						break;
					}
				}
				//detecting rocks hit a player
				if(Game.detectCollision(Game.Rocks[i], Game.Player)){
					Game.Rocks.splice(i,1);
					Game.playerTakeDmg(1);
					if(i > 0){
						i--;
					} else {
						break;
					}
				}
			}
			for(var i=0; i<Game.Snows.length; i++){
				// move snow
				if((Game.Snows[i].top + Game.Snows[i].speed) < Game.mainScreenHeight){
					Game.Snows[i].top += Game.Snows[i].speed;
				} else {
					Game.Snows.splice(i,1);
					if(i > 0){
						i--;
					} else {
						break;
					}
				}
			}
		},
		playerTakeDmg: function(dmg){
			if((Game.Player.currentHealth - dmg) > 0){
				Game.Player.currentHealth--;
			} else {
				Game.gameOver();
			}
		},
		drawGameOver: function(){
			ctx.save();
			ctx.clearRect(0, 0, Game.holeScreenWidth, Game.holeScreenHeight);
			ctx.font="50px Georgia";
			ctx.fillStyle="black";
			ctx.fillText("Game Over", 300, 280);
			ctx.restore();
		},
		drawScore: function(){
			ctx.save();
			ctx.translate(0, Game.mainScreenHeight);
			ctx.font="20px Georgia";
			ctx.fillStyle="red";
			ctx.fillText("Score: " + Game.Player.score, 10, 30);
			ctx.restore();
		},	
		drawTimer: function(){
			var minutes = Math.floor(parseInt(Timer.time/1000) / 60);
			var seconds = parseInt(Timer.time/1000) - minutes * 60;			
			ctx.save();
			ctx.translate(Game.scoreScreenWidth, Game.mainScreenHeight);
			ctx.font="20px Georgia";
			ctx.fillStyle="red";
			ctx.fillText("Time: " + minutes + ":" + seconds, 100, 30);
			ctx.restore();
		},
		drawHealthBar: function(){
			var HealthBarHeight = 20;
			var HealthBarWidth = parseInt(Game.healthScreenWidth/(Game.Player.maxHealth + 2));
			ctx.save();
			ctx.translate((Game.scoreScreenWidth + Game.timerScreenWidth), Game.mainScreenHeight);

			ctx.beginPath();
			ctx.strokeStyle="red";
			ctx.fillStyle="red";
			for(var i=0; i< Game.Player.maxHealth; i++){
				ctx.rect(i*HealthBarWidth + 20,10, HealthBarWidth, HealthBarHeight);
				ctx.stroke();
			}
			for(var i=0; i< Game.Player.currentHealth; i++){
				ctx.fillRect(i*HealthBarWidth + 20,10, HealthBarWidth, HealthBarHeight);
				ctx.stroke();
			}
			ctx.restore();
		},
		drawBackground: function(){
			ctx.save();			
			Game.backgroundOffset += Game.TreeSpeed;
					if (Game.backgroundOffset >= 1400) {
						ctx.drawImage(Game.backgroundImg, 0, 700 - (Game.backgroundOffset - 1400));
					}
					if (Game.backgroundOffset >= 2100) {
						Game.backgroundOffset = 0;
					}
					ctx.drawImage(Game.backgroundImg, 0, -Game.backgroundOffset);
			ctx.restore();
		},
		gameOver: function(){
			Game.isGameOver = true;
			clearInterval(Game.gameInterval);
			window.removeEventListener('keydown', Game.trackPlayerMove, false);
			Game.drawGameOver();
			startBtn.show();
			pauseBtn.hide();		
		}
	}
	
	return {
		init: function() {	
			if(Game.isGameOver){
				window.addEventListener('keydown', Game.trackPlayerMove, false);
				Game.init();
				Game.gameInterval = setInterval(function(){
					Game.mainLoop();
				}, Game.refreshTimeMS);
				
				startBtn.hide();
				pauseBtn.show();
			}
		},
		togglePause : function(){
			if(Game.isPaused && !Game.isGameOver){
				window.addEventListener('keydown', Game.trackPlayerMove, false);
				Game.gameInterval = setInterval(function(){
					Game.mainLoop();
				}, Game.refreshTimeMS);
				Game.isPaused = !Game.isPaused;
			} else {
				clearInterval(Game.gameInterval);
				window.removeEventListener('keydown', Game.trackPlayerMove, false);
				Game.isPaused = !Game.isPaused;
			}
		},
		isGameOver: function(){
			return Game.isGameOver;
		},
		getGameScreenWidth: function(){
			return Game.mainScreenWidth;
		},
		getGameScreenHeight: function(){
			return Game.mainScreenHeight;
		},
	}
})();