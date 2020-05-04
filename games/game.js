"use strict";

var Sgame = Sgame || {}
Sgame.GR = {};
Sgame.mCurrentFrame = 0;//経過フレーム数
Sgame.onTimer = function(){}
Sgame.mFPS = 60;
Sgame.mHeight = 120;//仮想画面高さ
Sgame.mWidth = 128;//仮想画面横幅

Sgame.init = function(){
  
  Sgame.GR.mCanvas = document.createElement("canvas");
	Sgame.GR.mCanvas.width = Sgame.mWidth;
  Sgame.GR.mCanvas.Height = Sgame.mHeight;
  Sgame.GR.mG = Sgame.GR.mCanvas.getContext("2d");


  requestAnimationFrame( Sgame.wmTimer);
  // setInterval(function(){Sgame.onTimer()}, 33);//33ms間隔で、WmTimerを呼び出す
}

Sgame.wmTimer = function(){
  if (!Sgame.mCurrentStart){
    Sgame.mCurrentStart = performance.now();//開始時刻を設定
  }
  let d = Math.floor((performance.now() - Sgame.mCurrentStart) * Sgame.mFPS / 1000) - Sgame.mCurrentFrame ;
  if( d > 0){
    Sgame.onTimer(d);
    Sgame.mCurrentFrame += d;
  }
  requestAnimationFrame( Sgame.wmTimer);
  

}