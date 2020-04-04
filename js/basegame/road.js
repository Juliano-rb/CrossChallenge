/*
	Representa uma das faixas onde os carros estarão inseridos
*/
class Road {
    constructor(dir, width, height, posy, color, bColor, carWidth) {
        this.color = color;
        this.borderColor = bColor;
        this.y = posy;
        this.x = 0;
        this.dir = dir;
        this.width = width;
        this.height = height;

        this.carWidth = carWidth;
        this.cars = new Array();
    }

    update(ctx) {
        this.draw(ctx);
    }
    draw(ctx) {
        if (debug)
            console.log(
                "DRAW: Desenhando Road em x:" +
                    this.x +
                    " y:" +
                    this.y +
                    " width:" +
                    this.width +
                    " height:" +
                    this.height
            );

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.borderColor;

        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();

        //Draw direction of road

        ctx.restore();

        this.drawCars(ctx);
    }
    drawCars(ctx) {
        for (var i = 0; i < this.cars.length; i++) {
            this.cars[i].draw(ctx);
        }
    }

    addCar(x, color) {
        if (!this.lugarOcupado(x)) {
            var car = new Car(x, this.y, this.carWidth, this.height, this.width, color);
            this.cars.push(car);
            //car.draw(ctx);
            return true;
        } else {
            return false;
        }
    }

    lugarOcupado(xpos) {
        for (var i = 0; i < this.cars.length; i++) {
            if (this.cars[i].x == xpos) return true;
        }
        return false;
    }
}
