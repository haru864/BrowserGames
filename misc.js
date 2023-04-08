class Star {

    constructor() {
        // 星の座標 (x,y)
        this.x = rand(0, SCREEN_WIDTH) << 8;
        this.y = rand(0, SCREEN_HEIGHT) << 8;
        // ベクトル (vx,vy)
        this.vx = 0;
        this.vy = rand(30, 500);
        // 星のサイズ
        this.size = rand(1, 2);
    }

    draw() {
        let x = this.x >> 8;
        let y = this.y >> 8;
        virtualContext.fillStyle = (rand(0, 2) != 0) ? "#66f" : "#8af";
        virtualContext.fillRect(x, y, this.size, this.size);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y > SCREEN_HEIGHT << 8) {
            this.y = 0;
            this.x = rand(0, SCREEN_WIDTH) << 8;
        }
    }
}

class CharaBase {

    constructor(snum, x, y, vx, vy) {
        this.spriteNumber = snum;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = sprites[snum].w;
        this.h = sprites[snum].h;
        this.isDead = false;
        this.count = 0;
    }

    update() {
        this.count++;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > SCREEN_WIDTH << 8
            || this.y < 0 || this.y > SCREEN_HEIGHT << 8) {
            this.isDead = true;
        }
    }

    draw() {
        drawSprite(this.spriteNumber, this.x, this.y);
    }
}

class Explosion extends CharaBase {

    draw() {
        this.spriteNumber = 16 + (this.count >> 2);
        if (this.count >= 27) {
            this.isDead = true;
            return;
        }
        super.draw();
    }
}

// キーボードが押されたとき
document.onkeydown = function (e) {
    // console.log('pushing ' + e.key);
    keyboard.set(e.key, true);
}

// キーボードが離されたとき
document.onkeyup = function (e) {
    // console.log('release ' + e.key);
    keyboard.set(e.key, false);
}

// スプライトを描画する関数
function drawSprite(snum, x, y) {

    let sprite_x = sprites[snum].x;
    let sprite_y = sprites[snum].y;
    let sprite_w = sprites[snum].w;
    let sprite_h = sprites[snum].h;

    let dist_x = (x >> 8) - sprite_w / 2;
    let dist_y = (y >> 8) - sprite_h / 2;

    virtualContext.drawImage(spriteImage, sprite_x, sprite_y, sprite_w, sprite_h,
        dist_x, dist_y, sprite_w, sprite_h);
}

// 乱数を生成する関数
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkHitRect(x1, y1, w1, h1, x2, y2, w2, h2) {

    // let isHit = true;

    let left1 = x1 >> 8;
    let right1 = left1 + w1;
    let top1 = y1 >> 8;
    let bottom1 = top1 + h1;

    let left2 = x2 >> 8;
    let right2 = left2 + w2;
    let top2 = y2 >> 8;
    let bottom2 = top2 + h2;

    // if (right1 < left2) isHit = false;
    // if (left1 > right2) isHit = false;
    // if (top1 > bottom2) isHit = false;
    // if (bottom1 < top2) isHit = false;
    // console.log(isHit);
    // return isHit;

    return (left1 <= right2 &&
        right1 >= left2 &&
        top1 <= bottom2 &&
        bottom1 >= top2);
}

function checkHitCirc(x1, y1, r1, x2, y2, r2) {

    let a = (x2 - x1) >> 8;
    let b = (y2 - y1) >> 8;
    let r = r1 + r2;

    return r * r >= a * a + b * b;
}
