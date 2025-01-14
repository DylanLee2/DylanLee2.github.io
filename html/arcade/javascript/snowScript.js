const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
var playerFace = document.getElementById("snowFace");
var score = document.getElementById("scoreSnow");
var restart = document.getElementById("restart");
document.onkeydown = keyPress;
document.onkeyup = releaseKey;

class Player{
  constructor(x,y,r,color,speedX,speedY){
    this.x=x; this.y=y; this.r=r; this.color=color;
    this.speedX=speedX; this.speedY=speedY;
  }
  move(moveX,moveY){
    this.x+=moveX; this.y+=moveY;
    this.draw();
  }

  draw(){
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.strokeStyle = this.color;
    c.stroke();
    c.drawImage(playerFace,this.x-(this.r/2),this.y-(this.r/2),this.r,this.r);
  }
  fill(){
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
  }
  updatePosition(/*degrees*/){
    //c.rotate(degrees*Math.PI/180);
    this.x+=this.speedX; this.y+=this.speedY;
    this.draw();
  }
}

class Rect{
  constructor(x,y,w,h){
    this.x=x; this.y=y; this.w=w; this.h=h;
  }
  draw(){
    c.strokeStyle = "black";
    c.strokeRect(this.x,this.y,this.w,this.h);
  }
}

function keyPress(e){
  let key = e.keyCode;
  if(alive) // a=65, d=68
    p.speedX = (key==65)?-speed : (key==68)?speed : p.speedX; 
  else if(key==82) // press r to restart
    newGame();
  accel = 0;
}

function releaseKey(){
  accel = 0.5;
}

function newGame(){
  snow = []; // clear both arraylists
  leaves = [];
  floorHeight = radius;
  floor.y = canvas.height-floorHeight;
  time=numScore=accel=0;
  p.x = canvas.width/2; // no need to reset p.y
  p.r = radius;
  alive = true;
}

function generateSnow(time,interval){
  if(time%interval == 0){
    let xPos = Math.random()*canvas.width;
    let yPos = 0-Math.random()*100;
    let rad = 12;
    snow.push(new Player(xPos,yPos,rad,"blue",0,3.5,"fallingSnow"));
  }
}

function isColliding(a,b){
  return (a.x+a.r >= b.x-b.r && a.x <= b.x+b.r && a.y+a.r >= b.y-b.r);
}
/* Checklist
leaves that fall unpredictably and slow down movement
show instructions before playing instead of below canvas
improve graphics (clouds, face that rolls as ball rolls, background parralax etc)
bigger you get the slower you get
make it harder

*/
function update(){ // game loop
  if(alive){
    restart.style.opacity = "0";
    c.fillStyle = 'rgba(255,255,255,1)' // background
    c.fillRect(0,0,canvas.width,canvas.height);
    sun.fill();
    generateSnow(time,60); // current time, making interval (lesser is faster)
    
    if(p.speedX>0){
      p.speedX -= accel;
      ///degree = 10;
    }
    else if(p.speedX<0){
      p.speedX += accel;
      //degree = -10;
    }
    

    //p.speedX *= 0.95;
    p.updatePosition(/*degree*/);
    //if(degree>359)
      //degree=1;

    floor.draw();
    for(let i=0; i<snow.length; i++){
      snow[i].updatePosition();
      if(isColliding(snow[i],p)){
        p.r += snow[i].r/1.5;
        snow.splice(i,1);
        i--;
      }
      else if(snow[i].y>canvas.height){
        snow.splice(i,1);
        i--;
        floorHeight += 5;
        // go higher but closer to sun = faster melting
        floor.y = canvas.height-floorHeight; 
        decreaseRate += 0.009;
      }
    }
/*
    if(Math.abs(p.speedX)>0){ // higher decrease rate when moving
      p.r -= decreaseRate;
    }
    else if(p.speedX == 0){ // when standing still, rate decreaes
      p.r -= (decreaseRate/2);
    }
*/
    p.r = (Math.abs(p.speedX>0))?p.r-decreaseRate : p.r-(decreaseRate/2);

    p.y = canvas.height-floorHeight-p.r; // keeps player on platform
    if(p.x>canvas.width && p.speedX>0)
      p.x=-2*p.r;
    else if(p.x-p.r<0 && p.speedX<0)
      p.x=canvas.width;

    time++;
    if(time%10 == 0){ // updates score based on time
      numScore++;
      score.innerHTML = numScore;
    }
    
    alive = (p.r >= 0.1); // dies if radius is too small
  }
  else if(!alive){
    restart.style.opacity = "1";
    restart.style.top = String(150)+"px";
  }
}
var degree = 0;
var accel = 0;
var speed = 8;
var decreaseRate = 0.11;
var time = 0;
var numScore = 0;
var radius = 35;
var floorHeight = radius;
var alive = true;
var p = new Player(canvas.width/2,canvas.height-(radius*2),radius,"black",0,0);
var snow = [];
var leaves = [];
var sun = new Player(canvas.width/2,0,90,"yellow",0,0);
var floor = new Rect(0,canvas.height-floorHeight,canvas.width,canvas.height);

setInterval(update,20);