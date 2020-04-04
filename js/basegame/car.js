/*
	Um carro, e só
*/
class Car {
    constructor(posx, posy, width, height, lifeTime, color) {
        this.x = posx;
        this.y = posy;
        this.lifeTime = lifeTime;
        this.color = color;
        this.width = width;
        this.height = height;

        this.im = new Image();
        this.im.src = carSprite.src;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.lineWidth = 1;

        ctx.drawImage(
            this.im,
            carSprite.x,
            carSprite.y,
            carSprite.w,
            carSprite.h,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}
