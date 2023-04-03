// ################# 定数宣言 #################
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

// ################# クラス定義 #################
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

// カメラの座標
let camera_x = 0;
let camera_y = 0;

// 星の実体
let star = [];

// ゲーム開始
gameInit();


// ################# 関数定義 #################
// ゲーム初期化
function gameInit() {
    for (let i = 0; i < NUM_OF_STAR; i++) {
        star[i] = new Star();
    }
    setInterval(gameLoop, GAME_SPEED);
}

// 乱数を生成する関数
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 星を動かす関数
function gameLoop() {
    for (let i = 0; i < NUM_OF_STAR; i++) {
        star[i].update();
    }
    virtualContext.fillStyle = "black";
    virtualContext.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let i = 0; i < NUM_OF_STAR; i++) {
        star[i].draw();
    }
    // 仮想画面から実際のキャンバスにコピー
    context.drawImage(virtualCanvas, camera_x, camera_y, SCREEN_WIDTH, SCREEN_HEIGHT, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
