/*
	O personagem que o usuario controla.
*/
class Char{
	//xps e ypos: posições iniciais no canvas, width e height: dimensões, cor, id: identificador para caso se tenha mais de um personagem
	constructor(xpos,ypos, width, height, color, id){
		this.id = id;
		this.x = xpos;
		this.y = ypos;
		this.width = width;
		this.height = height;
		this.color = color;
		//pode ser 'playing', 'died' e 'winner' ou "exhausted" para um automato
		this.stats = "playing";
		this.bgImage = new Image();
		this.bgImage.src = charPlayingSprite.src;
		this.showId= false;
		this.bgx = charPlayingSprite.up.x;
		this.bgy = charPlayingSprite.up.y;
		//this.bgImage.onload = function(){console.log("Carregou imagem")};
	}
	//Função que desenha na tela...
	draw(ctx){
		if(debug)
			console.log("DRAW: Desenhando carac ID: " + this.id + " em x:" + this.x + " y:" + this.y + " width:" + this.width + " height:" + this.height);
		
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.lineWidth=1;
		//ctx.strokeStyle = this.borderColor;
		
		if(this.stats == "exhausted" || this.stats == "died"){
			ctx.fillRect(this.x,this.y, this.width, this.height);
			ctx.rect(this.x,this.y, this.width, this.height);
			ctx.fill();
			
			//ctx.drawImage(this.bgImage, this.x,this.y);
		}
		else{
			ctx.drawImage(this.bgImage, this.bgx, this.bgy, charPlayingSprite.up.s, charPlayingSprite.up.s, this.x, this.y, this.width, this.height);
			//ctx.stroke();
		}
		
		if(this.showId){
			ctx.fillStyle = "red";
			ctx.font = "15px Arial";
			ctx.fillText(this.id,this.x + (this.height*0.2),this.y + (this.width*0.8));
		}
		
		ctx.restore();
	}
	
	up(value){
		this.bgx = charPlayingSprite.up.x;
		this.bgy = charPlayingSprite.up.y;
		this.y-=value;
		
		//Verifica se esta colidindo...
		if(CollisionChecker.checkCollision(roads, this)){
			//Se estiver, desfaz o movimento e perde o jogo(Como se não se movesse :))
			this.y+=value;
			this.die();
		}
		else if(CollisionChecker.crossed(this)){
			this.win();
		}
		
	}
	down(value){
		this.bgx = charPlayingSprite.down.x;
		this.bgy = charPlayingSprite.down.y;
		this.y+=value;
		if(CollisionChecker.checkCollision(roads, this)){
			this.y-=value;
			this.die();
		}
		else if(CollisionChecker.crossed(this)){
			this.win();
		}
	}
	left(value){
		this.bgx = charPlayingSprite.left.x;
		this.bgy = charPlayingSprite.left.y

		this.x-=value;
		if(CollisionChecker.checkCollision(roads, this)){
			this.x+=value;
			this.die();
		}
		else if(CollisionChecker.crossed(this)){
			this.win();
		}
	}
	right(value){
		this.bgx = charPlayingSprite.right.x;
		this.bgy = charPlayingSprite.right.y;
		this.x+=value;
		if(CollisionChecker.checkCollision(roads, this)){
			this.x-=value;
			this.die();
		}
		else if(CollisionChecker.crossed(this)){
			this.win();
		}
	}
	
	die(){
		this.stats = "died";
		this.color = charDiedColor;
		console.log("GAME: personagem ID: " + this.id + " morreu");
	}
	win(){
		this.stats = "winner";
		console.log("GAME: Personagem ID: " + this.id + " GANHOU!");
	}
}