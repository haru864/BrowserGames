class Bullet extends CharaBase {

    constructor(x, y, vx, vy) {
        super(5, x, y, vx, vy);
    }

    update() {
        super.update();
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].isDead) {
                continue;
            }
            if (checkHitRect(this.x, this.y, this.w, this.h,
                enemies[i].x, enemies[i].y, enemies[i].w, enemies[i].h)) {
                enemies[i].isDead = true;
                this.isDead = true;
                score++;
                // 敵の大きさに合わせて爆発エフェクトを大きくする
                explosion.push(new Explosion(20, enemies[i].x, enemies[i].y, 0, 0));
                for (let j = 1; j < enemies[i].size; j++) {
                    let evx = (rand(-10, 10) << 5);
                    let evy = (rand(-10, 10) << 5);
                    explosion.push(new Explosion(20, enemies[i].x, enemies[i].y, evx, evy));
                }
                break;
            }
        }
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
        this.hitPoints = 3;
        this.w = sprites[this.anime].w;
        this.h = sprites[this.anime].h;
        this.isDead = false;
    }

    // キーが押下されている場合は移動させる
    update() {
        if (this.hitPoints <= 0 && !this.isDead) {
            this.isDead = true;
            this.explode();
            return;
        }

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

    // 爆発
    explode() {
        for (let i = 0; i < 10; i++) {
            let evx = (rand(-10, 10) << 5);
            let evy = (rand(-10, 10) << 5);
            explosion.push(new Explosion(20, this.x, this.y, evx, evy));
        }
        // console.log("boom!");
    }
}
