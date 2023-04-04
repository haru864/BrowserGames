// ################# 初期設定 #################
// 画面サイズ
const SCREEN_WIDTH = 180;
const SCREEN_HEIGHT = 320;

// キャンバスサイズ
const CANVAS_WIDTH = SCREEN_WIDTH * 2;
const CANVAS_HEIGHT = SCREEN_HEIGHT * 2;

// フィールドサイズ
const FIELD_WIDTH = SCREEN_WIDTH * 2;
const FIELD_HEIGHT = SCREEN_HEIGHT * 2;

//星の数
const NUM_OF_STAR = 300;

//ゲームスピード(ms)
const GAME_SPEED = 1000 / 60;

// カメラの座標
let camera_x = 0;
let camera_y = 0;

// 星の実体
let array_of_star = [];

//キーボードの状態
let keyboard = new Map();    // ゲームパッドにも対応させたい

// スプライト画像
let fighterImage = new Image();
fighterImage.src = "fighter.png";   // 画像サイズを小さくしたい

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
let array_of_sprite = [
    new Sprite(0, 0, 22, 42),
    new Sprite(23, 0, 33, 42),
    new Sprite(57, 0, 43, 42),
    new Sprite(101, 0, 33, 42),
    new Sprite(135, 0, 21, 42),
];

class Star {
    constructor() {
        // 星の座標 (x,y)
        this.x = rand(0, FIELD_WIDTH) << 8;
        this.y = rand(0, FIELD_HEIGHT) << 8;
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
        if (this.y > FIELD_HEIGHT << 8) {
            this.y = 0;
            this.x = rand(0, FIELD_WIDTH) << 8;
        }
    }

}

//自機クラス
class Jiki {
    constructor() {
        this.x = (FIELD_WIDTH / 2) << 8;
        this.y = (FIELD_HEIGHT / 2) << 8;
        this.anime = 0;
        this.speed = 512;
    }

    // キーが押下されている場合は移動させる
    update() {
        if (keyboard.get('w')) {
            this.y -= this.speed;
        }
        if (keyboard.get('a')) {
            this.x -= this.speed;
        }
        if (keyboard.get('s')) {
            this.y += this.speed;
        }
        if (keyboard.get('d')) {
            this.x += this.speed;
        }
    }

    // キャンバスに自機を描画
    draw() {
        drawSprite(2 + this.anime, this.x, this.y);
    }
}

// 自機を生成
let jiki = new Jiki();

// ################# メイン処理 #################
// キャンバス取得
let canvas = document.getElementById("can");
let context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// 仮想画面を作成
let virtualCanvas = document.createElement("canvas");
let virtualContext = virtualCanvas.getContext("2d");
virtualCanvas.width = FIELD_WIDTH;
virtualCanvas.height = FIELD_HEIGHT;

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
        array_of_star[i] = new Star();
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
        array_of_star[i].update();
    }

    // 自機を移動させる
    jiki.update();

    // 星を描画
    virtualContext.fillStyle = "black";
    virtualContext.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let i = 0; i < NUM_OF_STAR; i++) {
        array_of_star[i].draw();
    }

    // 自機を描画
    jiki.draw();

    // 仮想画面から実際のキャンバスにコピー
    context.drawImage(virtualCanvas, camera_x, camera_y, SCREEN_WIDTH, SCREEN_HEIGHT,
        0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// スプライトを描画する関数
function drawSprite(snum, x, y) {
    let sprite_x = array_of_sprite[snum].x;
    let sprite_y = array_of_sprite[snum].y;
    let sprite_w = array_of_sprite[snum].w;
    let sprite_h = array_of_sprite[snum].h;
    let dist_x = (x >> 8) - sprite_w / 2;
    let dist_y = (y >> 8) - sprite_h / 2;
    virtualContext.drawImage(fighterImage, sprite_x, sprite_y, sprite_w, sprite_h,
        dist_x, dist_y, sprite_w, sprite_h);
}
