/*
	Automaton representa um indivíduo do algoritmo genético, ele extende o personagem,
	adicionando características como o seu genoma e a capacidade de movimentos automatizados
*/
class Automaton extends Char {
    //moves é um array de direções para o personagem se mover, direções possíveis: 'up', 'down', 'left' e 'right'
    constructor(xpos, ypos, width, height, color, id, moves) {
        //
        super(xpos, ypos, width, height, color, id);
        this.moveset = moves;
        //this.stats = "ended";
        this.atMoveIndex = 0;
        this.pontuation = 0;
    }

    move() {
        //moves
        //Caso ainda não tenha terminado de se movimentar
        if (this.stats == "playing" && this.atMoveIndex < this.moveset.length) {
            var movement = this.moveset[this.atMoveIndex];
            if (debug)
                console.log(
                    "GAME AutomatonClass: Movendo para: " +
                        movement +
                        " -" +
                        this.atMoveIndex +
                        " de " +
                        this.moveset.length
                );
            switch (movement) {
                case "up":
                    this.up(roadHeight);
                    break;
                case "down":
                    this.down(roadHeight);
                    break;
                case "left":
                    this.left(carWidth);
                    break;
                case "right":
                    this.right(carWidth);
                    break;
                default:
                    console.log(
                        "ERROR AutomatonClass: Direção no moveset de automato ID: " +
                            this.id +
                            " inválida. Direção: " +
                            this.atMoveIndex +
                            "-" +
                            movement
                    );
                    alert(
                        "ERROR: Direção no moveset de automato ID: " +
                            this.id +
                            " inválida:" +
                            movement
                    );
                    console.log(population);
            }

            this.atMoveIndex++;
            if (this.atMoveIndex > this.moveset.length - 1) {
                //Significa que ele não consegue mais se mover
                this.atMoveIndex = 0;
                this.stats = "exhausted";
                this.color = charExhaustedColor;
            }
            return true;
        } else {
            return false;
        }
    }
    reset() {
        this.x = 320;
        this.y = roadHeight * roads.length + startY;
        this.pontuation = 0;
        this.atMoveIndex = 0;
        this.stats = "playing";
        this.color = charPlayingColor;
    }
}
