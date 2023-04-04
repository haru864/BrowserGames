// ################# 初期設定 #################
// 画面サイズ
const SCREEN_WIDTH = 180 * 2;
const SCREEN_HEIGHT = 320 * 2;

// キャンバスサイズ
// const CANVAS_WIDTH = SCREEN_WIDTH * 2;
// const CANVAS_HEIGHT = SCREEN_HEIGHT * 2;

// フィールドサイズ
// const FIELD_WIDTH = SCREEN_WIDTH * 2;
// const FIELD_HEIGHT = SCREEN_HEIGHT * 2;

//星の数
const NUM_OF_STAR = 300;

//ゲームスピード(ms)
const GAME_SPEED = 1000 / 60;

//デバッグのフラグ
const DEBUG_FLUG = true;

// カメラの座標
let camera_x = 0;
let camera_y = 0;

// 星の実体
let stars = [];

//キーボードの状態
let keyboard = new Map();    // ゲームパッドにも対応させたい

// スプライト画像
let spriteImage = new Image();
spriteImage.src = "sprite.png";   // 画像サイズを小さくしたい

// スプライトクラス
class Sprite {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

// スプライト
let sprites = [
    new Sprite(0, 0, 22, 42),   //0,自機 左2
    new Sprite(23, 0, 33, 42),  //1,自機 左1
    new Sprite(57, 0, 43, 42),  //2,自機 正面
    new Sprite(101, 0, 33, 42), //3,自機 右1
    new Sprite(135, 0, 21, 42), //4,自機 右2
    new Sprite(0, 50, 3, 7),    //5,弾1
    new Sprite(4, 50, 5, 5),    //6,弾2
];

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

// 自機クラス
class Jiki {
    constructor() {
        this.x = (SCREEN_WIDTH / 2) << 8;
        this.y = (SCREEN_HEIGHT * 4 / 5) << 8;
        this.anime = 2;
        this.speed = 512;
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
            if (++this.countOfShots == 4) {
                this.firingInterval = 20;
                this.countOfShots = 0;
            }
        }
        if (keyboard.get(' ') == undefined || keyboard.get(' ') == false) {
            this.firingInterval = this.countOfShots = 0;
        }
        // 自機が画面外にあれば移動させる
        this.x = Math.max(this.x, (sprites[this.anime].w / 2) << 8);
        this.y = Math.max(this.y, (sprites[this.anime].h / 2) << 8);
        this.x = Math.min(this.x, (SCREEN_WIDTH - sprites[this.anime].w / 2) << 8);
        this.y = Math.min(this.y, (SCREEN_HEIGHT - sprites[this.anime].h / 2) << 8);
    }

    // キャンバスに自機を描画
    draw() {
        drawSprite(this.anime, this.x, this.y);
    }
}

class Bullet {
    constructor(x, y, vx, vy) {
        this.spriteNumber = 5;
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

// ################# メイン処理 #################
// キャンバス取得
let canvas = document.getElementById("can");
let context = canvas.getContext("2d");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

// 仮想画面を作成
let virtualCanvas = document.createElement("canvas");
let virtualContext = virtualCanvas.getContext("2d");
virtualCanvas.width = SCREEN_WIDTH;
virtualCanvas.height = SCREEN_HEIGHT;

// 自機を生成
let jiki = new Jiki();

// 弾を生成
let bullets = [];

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

// ゲーム開始
gameInit();


// ################# 関数定義 #################
// ゲーム初期化
function gameInit() {
    for (let i = 0; i < NUM_OF_STAR; i++) {
        stars[i] = new Star();
    }
    setInterval(gameLoop, GAME_SPEED);
}

// 乱数を生成する関数
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 星を動かす関数
function gameLoop() {
    // 星を移動させる
    for (let i = 0; i < NUM_OF_STAR; i++) {
        stars[i].update();
    }

    // 弾を移動させる
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
        if (bullets[i].isOffScreen) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // 自機を移動させる
    jiki.update();

    // 星を描画
    virtualContext.fillStyle = "black";
    virtualContext.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let i = 0; i < NUM_OF_STAR; i++) {
        stars[i].draw();
    }

    // 弾を描画
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw();
    }

    // 自機を描画
    jiki.draw();

    if (DEBUG_FLUG) {
        virtualContext.font = "20px 'Impact'";
        virtualContext.fillStyle = "white";
        virtualContext.fillText("bullets:" + bullets.length, 20, 20);
    }

    // 仮想画面から実際のキャンバスにコピー
    context.drawImage(virtualCanvas, camera_x, camera_y, SCREEN_WIDTH, SCREEN_HEIGHT,
        0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
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
