class Bullet extends CharaBase {

    constructor(x, y, vx, vy) {
        super(5, x, y, vx, vy);
    }

    update() {
        super.update();
    }

    draw() {
        super.draw();
    }
}

class Jiki {

    constructor() {
        this.x = (SCREEN_WIDTH / 2) << 8;
        this.y = (SCREEN_HEIGHT * 4 / 5) << 8;
        this.anime = 2;
        this.speed = 1024;
        this.firingInterval = 0;
        this.countOfShots = 0;
    }

    // キーが押下されている場合は移動させる
    update() {
        if (keyboard.get('w')) {
            this.y -= this.speed;
        }
        if (keyboard.get('a')) {
            this.x -= this.speed;
            if (this.anime > 0) {
                this.anime--;
            }
        }
        if (keyboard.get('s')) {
            this.y += this.speed;
        }
        if (keyboard.get('d')) {
            this.x += this.speed;
            if (this.anime < 4) {
                this.anime++;
            }
        }
        if ((keyboard.get('a') == undefined || keyboard.get('a') == false)
            && (keyboard.get('d') == undefined || keyboard.get('d') == false)) {
            if (this.anime > 2) {
                this.anime--;
            } else if (this.anime < 2) {
                this.anime++;
            }
        }
        if (keyboard.get(' ') && this.firingInterval == 0) {
            bullets.push(new Bullet(this.x, this.y, 0, -2000));
            this.firingInterval = 4;
            // if (++this.countOfShots == 4) {
            //     this.firingInterval = 20000000;
            //     this.countOfShots = 0;
            // }
        }
        if (keyboard.get(' ') == undefined || keyboard.get(' ') == false) {
            this.firingInterval = this.countOfShots = 0;
        }
        // 自機が画面外にあれば移動させる
        this.x = Math.max(this.x, (sprites[2].w / 2) << 8);
        this.y = Math.max(this.y, (sprites[2].h / 2) << 8);
        this.x = Math.min(this.x, (SCREEN_WIDTH - sprites[2].w / 2) << 8);
        this.y = Math.min(this.y, (SCREEN_HEIGHT - sprites[2].h / 2) << 8);
    }

    // キャンバスに自機を描画
    draw() {
        drawSprite(this.anime, this.x, this.y);
    }
}
