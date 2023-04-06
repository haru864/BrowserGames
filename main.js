// 画面サイズ
const SCREEN_WIDTH = 180 * 2;
const SCREEN_HEIGHT = 320 * 2;

//星の数
const NUM_OF_STAR = 300;

//ゲームスピード(ms)
const GAME_SPEED = 1000 / 60;

//デバッグのフラグ
const DEBUG_FLUG = true;

// スムージング
const SMOOTHING = false;

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

// キャンバス取得
let canvas = document.getElementById("can");
let context = canvas.getContext("2d");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
context.mozimageSmoothingEnagbled = SMOOTHING;
context.webkitimageSmoothingEnabled = SMOOTHING;
context.msimageSmoothingEnabled = SMOOTHING;
context.imageSmoothingEnabled = SMOOTHING;

// 仮想画面を作成
let virtualCanvas = document.createElement("canvas");
let virtualContext = virtualCanvas.getContext("2d");
virtualCanvas.width = SCREEN_WIDTH;
virtualCanvas.height = SCREEN_HEIGHT;

// 自機を生成
let jiki = new Jiki();

// 弾を生成
let bullets = [];

// 敵を生成
let enemies = [
    new Enemy(39, (SCREEN_WIDTH / 2) << 8, (SCREEN_HEIGHT * 2 / 5) << 8, 0, 0),
];

// ゲーム開始
gameInit();

// ゲーム初期化
function gameInit() {
    for (let i = 0; i < NUM_OF_STAR; i++) {
        stars[i] = new Star();
    }
    setInterval(gameLoop, GAME_SPEED);
}

// 星を動かす関数
function gameLoop() {

    // オブジェクトの位置を更新
    updateAll();

    // キャンバスに描画
    drawAll();

    if (DEBUG_FLUG) {
        context.font = "20px 'Impact'";
        context.fillStyle = "white";
        context.fillText("bullets:" + bullets.length, 10, 20);
        context.fillText("enemies:" + enemies.length, 10, 40);
    }
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

// オブジェクトの位置を更新する関数
function updateObj(obj) {
    for (let i = obj.length - 1; i >= 0; i--) {
        obj[i].update();
        if (obj[i].isOffScreen) {
            obj.splice(i, 1);
        }
    }
}

// オブジェクトを描画する関数
function drawObj(obj) {
    for (let i = 0; i < obj.length; i++) {
        obj[i].draw();
    }
}

// まとめて位置を更新する関数
function updateAll() {
    updateObj(stars);
    updateObj(bullets);
    updateObj(enemies);
    jiki.update();
}

// まとめて描画する関数
function drawAll() {

    //描画の前処理
    virtualContext.fillStyle = "black";
    virtualContext.fillRect(camera_x, camera_y, SCREEN_WIDTH, SCREEN_HEIGHT);

    drawObj(stars);
    drawObj(bullets);
    drawObj(enemies);
    jiki.draw();

    // 自機の範囲 0 ～ FIELD_W
    // カメラの範囲 0 ～ (FIELD_W-SCREEN_W)
    // camera_x = (jiki.x >> 8) / FIELD_W * (FIELD_W - SCREEN_W);
    // camera_y = (jiki.y >> 8) / FIELD_H * (FIELD_H - SCREEN_H);

    // 仮想画面から実際のキャンバスにコピー
    context.drawImage(virtualCanvas, camera_x, camera_y, SCREEN_WIDTH, SCREEN_HEIGHT,
        0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}
