const canvas = document.getElementById("canvas1");
const c = canvas.getContext("2d");
var score = document.getElementById("score");
var restart = document.getElementById("restart");
document.onkeydown = keyPress;
document.onkeyup = releaseKey;

class Player{
  constructor(x,y,w,h,color){
    this.x=x; this.y=y; this.w=w; this.h=h; this.color=color;
    this.speedY = 0;
  }
  draw(){
    c.fillStyle = this.color;
    c.fillRect(this.x,this.y,this.w,this.h);
  }
  updatePos(){
    this.y+=this.speedY;
    this.draw();
  }
}
class Ball{
  constructor(x,y,r,color){
    this.x=x; this.y=y; this.r=r; this.color=color;
    this.speedX=0; this.speedY=0;
  }
  serve(){
    this.x = canvas.width/2;
    this.y = Math.random()*canvas.height;

    this.speedX = (Math.random()<0.5)?ballSpeed : -ballSpeed;
    this.speedY = (Math.random()<0.5)?ballSpeed : -ballSpeed;
  }
  draw(){
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
  }
  updatePos(){
    this.x+=this.speedX; this.y+=this.speedY;
    this.draw();
  }
}

function keyPress(e){
  let key = e.keyCode;
  if(alive){ // movement
    /*
    if(p1.y>0 && key==87) // w=87
      p1.speedY=-speed;
    else if(p1.y+p1.h<canvas.height && key==83) //s=83
      p1.speedY=speed;
    else
      p1.speedY=0;
    */
    if(key==87){ // w=87
      p1.speedY=-speed;
      if(p1.y+p1.h<0)
        p1.y=canvas.height;
    }
    else if(key==83){ //s=83
      p1.speedY=speed;
      if(p1.y>canvas.height)
        p1.y=0-p1.h;
    }
  }
  else if(!alive){
    if(key == 82) // press r to restart
      newGame(); // and possibly include save score
  }
}

function releaseKey(){
  p1.speedY = 0;
}

function newGame(){
  //alert("new game"); // placeholder
  alive=true;
  score1=score2=0;
}

function bot(mode,player){
  if(mode == "easy"){
    alert("placehodler for ez mode");
  }
  else if(mode == "medium"){
    alert("placeholder for med mode");
  }
  else if(mode == "hard"){
    player.y = b.y-player.h/2;
  }
}

function update(){ // game loop
  if(alive){
    restart.style.opacity = "0";
    c.fillStyle = 'rgba(1,1,1,0.4)';
    c.fillRect(0,0,canvas.width,canvas.height);
    c.fillStyle = 'rgb(255,255,255)'
    c.fillRect(canvas.width/2,0,3,canvas.height);
    p1.updatePos();
    p2.updatePos();
    bot("hard",p2);
    b.updatePos();
    if((b.y-b.r<0)||(b.y+b.r>canvas.height))
      b.speedY*=-1;
    
    if((b.x-b.r<=p1.x+p1.w && b.x+3>p1.x+p1.w && b.y>p1.y && b.y+b.r<p1.y+p1.h)||(b.x+b.r>=p2.x && b.x+b.r<p2.x+4 && b.y>p2.y && b.y+b.r<p2.y+p2.h))
      b.speedX*=-1.1;
    
    else if(b.x+b.r<0){
      score2++;
      score.innerHTML = score1 + " " + score2;
      b.serve();
    }
    else if(b.x>canvas.width){
      score1++;
      score.innerHTML = score1 + " " + score2;
      b.serve();
    }
    if(score1>2 || score2>2)
      alive=false;
    /*
    c.font = "30px Verdana";
    c.fillStyle = "WHITE";
    c.fillText(score1,canvas.width/2 - 30,60);  
    c.fillText(score2,canvas.width/2 +,60);
    */
    
  }
  else {
    restart.style.opacity = "1"
    restart.style.top = String(100)+"px";
  }
}

var alive = true, canMove = true;
var score1=0, score2=0;
const speed=10, ballSpeed=4;
var p1 = new Player(30,canvas.height/2,30,170,"blue");
var p2 = new Player(canvas.width-50,canvas.height/2,30,170,"red");
var b = new Ball(canvas.width/2,canvas.height/2,12,"white");
b.serve();

setInterval(update,20);