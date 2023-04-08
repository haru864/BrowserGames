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

    new Sprite(0, 50, 3, 7),   //5,弾1
    new Sprite(4, 50, 5, 5),   //6,弾2

    new Sprite(3, 42, 16, 5),// 7,噴射 左2
    new Sprite(29, 42, 21, 5),// 8,噴射 左1
    new Sprite(69, 42, 19, 5),// 9,噴射 正面
    new Sprite(108, 42, 21, 5),//10,噴射 右1
    new Sprite(138, 42, 16, 5),//11,噴射 右2

    new Sprite(11, 50, 7, 7),//12,敵弾1-1
    new Sprite(19, 50, 7, 7),//13,敵弾1-2
    new Sprite(32, 49, 8, 8),//14,敵弾2-1
    new Sprite(42, 47, 12, 12),//15,敵弾2-2

    new Sprite(5, 351, 9, 9),//16  ,爆発1
    new Sprite(21, 346, 20, 20),//17  ,爆発2
    new Sprite(46, 343, 29, 27),//18  ,爆発3
    new Sprite(80, 343, 33, 30),//19  ,爆発4
    new Sprite(117, 340, 36, 33),//20  ,爆発5
    new Sprite(153, 340, 37, 33),//21  ,爆発6
    new Sprite(191, 341, 25, 31),//22  ,爆発7
    new Sprite(216, 349, 19, 16),//23  ,爆発8
    new Sprite(241, 350, 15, 14),//24  ,爆発9
    new Sprite(259, 350, 14, 13),//25  ,爆発10
    new Sprite(276, 351, 13, 12),//26  ,爆発11

    new Sprite(6, 373, 9, 9),//27  ,ヒット1
    new Sprite(19, 371, 16, 15),//28  ,ヒット2
    new Sprite(38, 373, 11, 12),//29  ,ヒット3
    new Sprite(54, 372, 17, 17),//30  ,ヒット4
    new Sprite(75, 374, 13, 14),//31  ,ヒット5

    new Sprite(4, 62, 24, 27),	//32  ,黄色1
    new Sprite(36, 62, 24, 27),	//33  ,黄色2
    new Sprite(68, 62, 24, 27),	//34  ,黄色3
    new Sprite(100, 62, 24, 27),	//35  ,黄色4
    new Sprite(133, 62, 24, 27),	//36  ,黄色5
    new Sprite(161, 62, 30, 27),	//37  ,黄色6

    new Sprite(4, 95, 24, 26),	//38  ,ピンク1
    new Sprite(36, 95, 24, 26),	//39  ,ピンク2
    new Sprite(68, 95, 24, 26),	//40  ,ピンク3
    new Sprite(100, 95, 24, 26),	//41  ,ピンク4
    new Sprite(133, 92, 24, 29),	//42  ,ピンク5
    new Sprite(161, 95, 30, 26),	//43  ,ピンク6

    new Sprite(4, 125, 24, 29),	//44  ,青グラサン1
    new Sprite(36, 125, 24, 29),	//45  ,青グラサン2
    new Sprite(68, 125, 24, 29),	//46  ,青グラサン3
    new Sprite(100, 125, 24, 29),	//47  ,青グラサン4
    new Sprite(133, 124, 24, 30),	//48  ,青グラサン5
    new Sprite(161, 125, 30, 29),	//49  ,青グラサン6

    new Sprite(4, 160, 25, 27),	//50  ,ロボ1
    new Sprite(34, 160, 26, 27),	//51  ,ロボ2
    new Sprite(66, 160, 26, 27),	//52  ,ロボ3
    new Sprite(98, 160, 26, 27),	//53  ,ロボ4
    new Sprite(132, 160, 26, 27),	//54  ,ロボ5
    new Sprite(161, 158, 30, 29),	//55  ,ロボ6

    new Sprite(4, 194, 24, 28),	//56  ,にわとり1
    new Sprite(36, 194, 24, 28),	//57  ,にわとり2
    new Sprite(68, 194, 24, 28),	//58  ,にわとり3
    new Sprite(100, 194, 24, 28),	//59  ,にわとり4
    new Sprite(133, 194, 24, 30),	//60  ,にわとり5
    new Sprite(161, 194, 30, 28),	//61  ,にわとり6

    new Sprite(4, 230, 22, 26),	//62  ,たまご1
    new Sprite(41, 230, 22, 26),	//63  ,たまご2
    new Sprite(73, 230, 22, 26),	//64  ,たまご3
    new Sprite(105, 230, 22, 26),	//65  ,たまご4
    new Sprite(137, 230, 22, 26),	//66  ,たまご5

    new Sprite(6, 261, 24, 28),	//67  ,殻帽ヒヨコ1
    new Sprite(38, 261, 24, 28),	//68  ,殻帽ヒヨコ2
    new Sprite(70, 261, 24, 28),	//69  ,殻帽ヒヨコ3
    new Sprite(102, 261, 24, 28),	//70  ,殻帽ヒヨコ4
    new Sprite(135, 261, 24, 28),	//71  ,殻帽ヒヨコ5

    new Sprite(206, 58, 69, 73),	//72  ,黄色(中)
    new Sprite(204, 134, 69, 73),	//73  ,ピンク(中)
    new Sprite(205, 212, 69, 78),	//74  ,青グラサン(中)

    new Sprite(337, 0, 139, 147),//75  ,黄色(大)
    new Sprite(336, 151, 139, 147),//76  ,ピンク(大)
    new Sprite(336, 301, 139, 155),//77  ,青グラサン()
];

// キャラクターの共通クラス
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

class Enemy extends CharaBase {

    constructor(snum, x, y, vx, vy) {
        super(snum, x, y, vx, vy);
    }

    update() {
        super.update();
    }

    draw() {
        super.draw();
    }
}

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

// 敵を生成
let enemies = [
    new Enemy(39, (SCREEN_WIDTH / 2) << 8, (SCREEN_HEIGHT * 2 / 5) << 8, 0, 0),
];

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
