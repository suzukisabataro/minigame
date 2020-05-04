"use strict";
const cHeight     = 9;
const cWidth      = 8;
const Font        = "10px monospace"//フォントサイズ
const FontStyle   = "#ffffff"//文字の色
const Height      = 120;//仮想画面高さと幅
const Width       = 128;
const map_width   = 32;
const map_height  = 32;
const Smooth      = 0;
const start_x     = 15;//スタート位置x座標
const start_y     = 17;//スタート位置y座標
const start_Hp     = 30;
const tilesize    = 8;
const tilerow     = 4;
const tilecolumn  = 4;
const WindowStyle = "rgba( 0, 0, 0, 0.75 )";//ウィンドウのいろ
const s_height    = 8;//画面タイルサイズ高さ/2
const s_width     = 8;//画面タイルサイズ幅/2
const Interval    = 33;//フレーム呼び出し間隔
const Scroll      = 1;//スクロール速度
const gName        = "ベジータ";

const gkey = new Uint8Array( 0x100);// キー入力バッファ

let gFrame = 0;//内部カウンタ
let gImgMap; //マップ
let gAngle = 0;
let gImgPlayer;
let gImgMonster;
let gImgBoss;
let gCursor = 0;//カーソル位置
let gEnemyType;//敵種別
let gEx = 0;
let gHp = start_Hp;
let gMHp = start_Hp;
let gLv = 1;
let gPlayerX = start_x * tilesize + tilesize / 2;//キャラ座標x軸
let gPlayerY = start_y * tilesize + tilesize / 2;//キャラ座標y軸
let gEnemyHp;//敵のHp
let gWidth ;
let gMoveX = 0;//フィールド移動量x
let gMoveY = 0;//フィールド移動量y
let gOrder;//行動順
let gHeight ;
let gMessage1 = null;
let gMessage2 = null;
let gItem = 0;
let gPhase = 0;// 戦闘フェーズ


const gFileMap = "img/map.png";

const gFileMonster = "img/monster.png";
const gFileBoss = "img/Boss.png";
const gFilePlayer = "img/player.png";

const gEncounter = [0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0];
const gMonsterName = ["スライム","ラビット","ナイト","ドラゴン","魔王"];


const gMap = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
	0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6,13, 6, 0, 0, 0,
	0, 3, 3,10,11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
	0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3,12, 3, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
	7,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
	7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
 

];

function CommandFight(){
	gPhase = 2;
	gCursor = 0;
	SetMessage("　たたかう", "　にげる");
}

function GetDamage(a){
	return(Math.floor(a * ( 4 + Math.random())));//攻撃力の1~2倍
}

function Action(){//戦闘処理
	gPhase++;
	if(((gPhase + gOrder) & 1) == 0){
		const d = GetDamage( gEnemyType + 3);
		SetMessage( gMonsterName[ gEnemyType ] + "の攻撃！！", d + "のダメージ");
		gHp -= d;//Hp減少処理
		if(gHp <= 0){//Hpが０になった時Phase７へ
					gPhase = 7;
		}
		return;
	}

	if(gCursor == 0){//カーソルが０の時たたかう
		const d = GetDamage( gLv + 1);
		SetMessage("ベジータの攻撃！", d + "のダメージ");
		gEnemyHp -= d;
		if(gEnemyHp <= 0){
			gPhase = 5;
		}
		return;
	}

	if( Math.random() < 0.5){//逃走成功時
		SetMessage("あなたは逃げ出した", null);
		gPhase = 6;
		return;
	}
	SetMessage("あなたは逃げ出した", "しかし回り込まれてしまった！");
}

function AppearEnemy(t){//モンスター出現処理
	gPhase = 1;
	gEnemyHp = t * 5 + 5;//敵のHp
	gEnemyType = t;
	SetMessage("モンスターが現れた！", null);
}

function AddExp( val ){// 経験値加算処理
	gEx += val;
	while(gLv * (gLv + 1) * 2 <= gEx ){//レベルアップ条件を満たしている場合whileをループする
		gLv++;
		gMHp += 4 + Math.floor(Math.random() * 3);//HP上昇４〜７
	}

}

function Drawfight(g){//戦闘画面描画
	g.fillStyle = "#000000"
	g.fillRect(0, 0, Width, Height);
	if( gPhase <= 5){
		if(IsBoss()){//ボスの場合
			g.drawImage( gImgBoss, Width / 2 - gImgBoss.width / 2, Height / 2 - gImgBoss.height / 2 );
			}
			else{
			let w = gImgMonster.width / 4;
			let h = gImgMonster.height;
			g.drawImage(gImgMonster, gEnemyType * w, 0, w, h, Math.floor(Width / 2 - w / 2), Math.floor(Height / 2 - h), w, h );
		}	
	}

	DrawMessage(g);
	DrawStatus(g);

	if(gPhase == 2){
		g.fillText( "▷",1, 96 + 14 * gCursor);//カーソル描画
	}
}

function IsBoss(){
	return( gEnemyType == gMonsterName.length - 1);
}

function DrawField(g){
	let   mx = Math.floor(gPlayerX / tilesize);//プレイヤーのタイル座標x
	let   my = Math.floor(gPlayerY / tilesize);//プレイヤーのタイル座標y

	for( let dy = -s_height; dy <= s_height; dy++){//dx,dyは変数が増えてきたときに混乱するためdをつけた
		let ty = my + dy;   										 //タイル座標y
		let py = (ty + map_height) % map_height;//ループ後タイル座標y
		for(let dx = -s_width; dx <= s_width; dx++){
			let tx = mx + dx;  										//タイル座標x
			let px = (tx + map_width) % map_width;//ループ後タイル座標x
			DrawTile(g, 
							tx * tilesize + Width / 2 - gPlayerX,
							ty * tilesize + Height /2  - gPlayerY,
							 gMap[ py * map_width + px]);
		}
	}

	g.drawImage( gImgPlayer, //プレイヤーの描画
		( gFrame >> 3 & 1) * cWidth, gAngle * cHeight, cWidth, cHeight,
		Width / 2 - cWidth / 2, Height / 2 - cHeight + tilesize / 2, cWidth, cHeight);
		g.fillStyle = WindowStyle;
		g.fillRect( 2, 2, 44, 49 );
		DrawMessage(g);
		DrawStatus(g);
}

function WmSize(){
	const ca = document.getElementById("main");
	ca.width = window.innerWidth;
	ca.height = window.innerHeight;

	const g = ca.getContext("2d");
	g.imageSmoothingEnabled = g.msimageSmoothingEnabled = Smooth;
	gWidth = ca.width;
	gHeight = ca.height;
	if(gWidth / Width < gHeight / Height){
		gHeight = gWidth * Height / Width;
	}
	else{
		gWidth = gHeight * Width / Height;
	}

}

function Drawmain(){
	const g = Sgame.GR.mCanvas.getContext("2d");//仮想画面の2d描画コンテキストを取得

	if( gPhase <= 1 ){
		DrawField(g);//フィールド画面描画
	}
	else{ 
		Drawfight(g);
	}
}

function DrawMessage(g){
	if (!gMessage1){
		return;
	}
	g.fillStyle = WindowStyle;
	g.fillRect( 4, 84, 120, 30 );
	g.font = Font;
	g.fillStyle = FontStyle;

	g.fillText(gMessage1, 6, 96);
	if(gMessage2){
	g.fillText(gMessage2, 6, 110);
	}
}

function DrawStatus(g){
	g.font = Font;
	g.fillStyle = FontStyle;

	g.fillText( gName, 4, 13);
	g.fillText("Lv", 4, 25); DrawtextR( g, gLv, 44, 25);
	g.fillText("HP", 4, 37); DrawtextR( g, gHp, 44, 37);
	g.fillText("Ex", 4, 49); DrawtextR( g, gEx, 44, 49);
}

function DrawtextR(g, str, x, y){
	g.textAlign = "right";
	g.fillText(str, x, y);
	g.textAlign = "left";
}

function DrawTile(g, x, y, idx){
	const ix = ( idx % tilecolumn) * tilesize;
	const iy = Math.floor( idx / tilecolumn) * tilesize;
	g.drawImage( gImgMap, ix, iy, tilesize, tilesize, x, y, tilesize, tilesize);
}

function LoadImage(){
	gImgBoss = new Image(); gImgBoss.src = gFileBoss;//
	gImgMap = new Image(); gImgMap.src = gFileMap;//マップ画像読み込み
	gImgMonster = new Image(); gImgMonster.src = gFileMonster;//モンスター画像読み込み
	gImgPlayer = new Image(); gImgPlayer.src = gFilePlayer;//プレイヤー画像読み込み
}

function SetMessage(v1,v2){
	gMessage1 = v1;
	gMessage2 = v2;
}

function MoveField(){       //フィールド進行処理
	if( gPhase != 0){
		return;
	}
	if( gMoveX !=0 || gMoveY != 0 || gMessage1){} //移動中の場合
	else if( gkey[37]) {gAngle = 1; gMoveX = -tilesize;}//左
	else if( gkey[38]) {gAngle = 3; gMoveY = -tilesize;}//上
	else if( gkey[39]) {gAngle = 2; gMoveX = tilesize;}//右
	else if( gkey[40]) {gAngle = 0; gMoveY = tilesize;}//下
	//移動後のタイル座標判定↓
	let  mx = Math.floor((gPlayerX + gMoveX) / tilesize);
	let  my = Math.floor((gPlayerY + gMoveY) / tilesize);
	mx += map_width;
	mx %= map_width;
	my += map_height;
	my %= map_height;
	let   m = gMap[ my * map_width + mx]; //タイル座標を取得mに代入（1.2.3が移動できない地形）
	if( m < 3){//移動先タイル番号が３未満な時、移動量を０にする
		gMoveX = 0;
		gMoveY = 0;
	}
//イベント
	if(Math.abs(gMoveX) + Math.abs(gMoveY) == Scroll){
		if( m == 8 || m == 9){//お城
			gHp = gMHp;//イベント発生HP回復
			SetMessage( "王「魔王を倒してくるのじゃ！！」","べ「・・・・」");
		}

		if( m == 10 || m == 11 ){	//	街
			gHp = gMHp;										//	HP全回復
			SetMessage( "西の果てにも", "村があります" );
		}

		if( m == 13){//洞窟
			gItem = 1;//鍵入手
			SetMessage( "鍵を手に入れた","べ「・・・」");
		}

		if( m == 12){//村
			gHp = gMHp;
			SetMessage( "住人「鍵は洞窟にあります」","べ「・・・」");
		}

		if( m == 14){
			if( gItem == 0){
				gPlayerY -= tilesize;
				SetMessage( "カギがかかっている",null);
			}
			else{
				SetMessage("扉が開いた", null);
			}
		}

		if( m == 15){
			// SetMessage("魔王を倒し平和が訪れた");
			AppearEnemy( gMonsterName.length - 1 );
		}

		if(Math.random() * 8 < gEncounter[ m ]){//ランダムエンカウント
			let t = Math.abs (gPlayerX / tilesize - start_x) +
							Math.abs (gPlayerY / tilesize - start_y);
			if( m == 6){//林の場合
				t += 8;//敵レベルを0~0.5上昇
			}
			if( m == 7){//山の場合
				t += 16;//敵レベルを1上昇
			}
			t += Math.random() * 8;//敵レベルを0~0.5上昇
			t = Math.floor (t / 16);	
			t = Math.min( t, gMonsterName.length - 2);
			AppearEnemy(t);
		}
	}





	gPlayerX += Math.sign(gMoveX) * Scroll;//プレイヤー座標x
	gPlayerY += Math.sign(gMoveY) * Scroll;//プレイヤー座標y
	gMoveX -= Math.sign(gMoveX) * Scroll;//プレイヤー座標x
	gMoveY -= Math.sign(gMoveY) * Scroll;//プレイヤー座標x



	// マップループ処理
	gPlayerX += (map_width * tilesize);
	gPlayerX %= (map_width * tilesize);
	gPlayerY += (map_height * tilesize);
	gPlayerY %= (map_height * tilesize);
}

function WmPaint(){
	Drawmain();
	const ca = document.getElementById("main");//mainキャンバスの要素を取得
	const g = ca.getContext("2d");
	g.drawImage(Sgame.GR.mCanvas, 0, 0, Sgame.GR.mCanvas.width, Sgame.GR.mCanvas.height, 0, 0, gWidth, gHeight );
}

Sgame.onTimer = function(d){//タイマーイベント発生時のメソット
	if(!gMessage1){
		while(d--){
			gFrame++ ;  //内部カウンタを加算
			MoveField();	
		}
	}
	WmPaint ();	
}

window.onkeydown = function(ev){
	let c = ev.keyCode;

	if(gkey[c] != 0){
		return;
	}
	gkey[ c ] = 1;

	if(gPhase == 1){		//敵が現れた場合
		CommandFight()
		return;
	}

	if(gPhase == 2){//コマンド選択中の場合
		if( c == 13 || c == 90){//13はenterキー、90はZキーの場合
			gOrder = Math.floor(Math.random() * 2);//戦闘行動順
			Action();
			}
		else{
			gCursor = 1 - gCursor;//カーソル移動
		}
		return;
	}

	if(gPhase == 3){
		Action();
		return;
	}

	if(gPhase == 4){
		CommandFight();
		return;
	}

	if(gPhase == 5){
		gPhase = 6;
		AddExp( gEnemyType + 5);
		SetMessage("モンスターを倒した", null);
		return;
	}

	if(gPhase == 6){
		if( IsBoss() && gCursor == 0){
		SetMessage("魔王を倒し", "世界に平和が訪れた");
		return;
		}	
		gPhase = 0;//マップ移動
	}

	if(gPhase == 7){
		gPhase = 8;
		SetMessage("ベジータは死んでしまった", null);
		return;
	}

	if(gPhase == 8){
		SetMessage("GAMEOVER", null);
		return;
	}

	
  gMessage1 = null;
}

window.onkeyup = function(ev){
	gkey[ev.keyCode] = 0;
}


window.onload = function(){ //ブラウザ起動イベント
  LoadImage();
	WmSize ();               //画面サイズ初期化
	window.addEventListener("resize", function(){WmSize()});//ブラウザサイズ変更時、WmSize()が呼び出される
	Sgame.init();
}
