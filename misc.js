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
        this.isOffScreen = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > SCREEN_WIDTH << 8
            || this.y < 0 || this.y > SCREEN_HEIGHT << 8) {
            this.isOffScreen = true;
        }
    }

    draw() {
        drawSprite(this.spriteNumber, this.x, this.y);
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

