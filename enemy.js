class Enemy extends CharaBase {

    constructor(snum, x, y, vx, vy) {
        super(snum, x, y, vx, vy);
        this.isCloseToJiki = false;
        if (sprites[snum].x > 300) {
            this.size = 10;
        } else if (sprites[snum].x > 200) {
            this.size = 5;
        } else {
            this.size = 1;
        }
    }

    update() {
        // 自機との距離を算出
        let an = Math.atan2(jiki.y - this.y, jiki.x - this.x);
        an += rand(-10, 10) * Math.PI / 180;
        let dx = Math.cos(an) * 1000;
        let dy = Math.sin(an) * 1000;

        super.update();
        // y軸移動：自機が近ければ距離を取る
        if (this.isCloseToJiki && this.vy > -1000) {
            this.vy -= 30;
        }
        // ｘ軸移動：自機が近ければ離れ、そうでなければ軸を寄せる
        if (!this.isCloseToJiki) {
            if (jiki.x > this.x && this.vx < 120) this.vx += 4;
            else if (jiki.x < this.x && this.vx > -120) this.vx -= 4;
        }
        else {
            if (jiki.x < this.x && this.vx < 1000) this.vx += 30;
            else if (jiki.x > this.x && this.vx > -1000) this.vx -= 30;
        }
        // 自機が近ければ撃つ
        if (Math.abs(jiki.y - this.y) < (200 << 8) && !this.isCloseToJiki) {
            this.isCloseToJiki = true;
            enemyBullets.push(new EnemyBullet(15, this.x, this.y, dx, dy));
        }
    }

    draw() {
        super.draw();
    }
}

class EnemyBullet extends CharaBase {

    constructor(snum, x, y, vx, vy) {
        super(snum, x, y, vx, vy);
        this.power = 1;
    }

    update() {
        super.update();
        if (checkHitRect(this.x, this.y, this.w, this.h,
            jiki.x, jiki.y, jiki.w, jiki.h)) {
            this.isDead = true;
            jiki.hitPoints -= this.power;
        }
    }
}
