//Classe  usada para detectar se o personagem colidiu com algum carro, ou se ele consegiu atravesssar a rua
class CollisionChecker {
    //Return true if is colliding, else: false
    static checkCollision(roads, charac) {
        for (var i = 0; i < roads.length; i++) {
            var carsAt = roads[i].cars;
            for (var j = 0; j < carsAt.length; j++) {
                if (this.isCollidingOnCar(carsAt[j], charac)) {
                    if (debug) console.log("COLLISION: Personagem está colidindo");
                    return true;
                }
            }
        }
        return false;
    }
    static isCollidingOnCar(car, me) {
        if (
            car.x < me.x + me.width &&
            car.x + car.width > me.x &&
            car.y < me.y + me.height &&
            car.height + car.y > me.y
        ) {
            return true;
        } else {
            return false;
        }
    }

    static crossed(me) {
        if (me.y < startY) {
            if (debug) console.log("GAME: Atravessou!, personagem ID: " + me.id);
            return true;
        }
    }
}
