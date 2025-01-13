const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
var score = document.getElementById("score");
var restart = document.getElementById("restart");
document.onkeydown = keyPress;
document.onkeyup = stop;

class Player{
  constructor(x,y,w,h,color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.speedX = 0;
  }
  updatePosition(){
    this.x += this.speedX;
    this.draw();
  }
  draw(){
    c.fillStyle = this.color;
    c.fillRect(this.x,this.y,this.w,this.h);
  }
}

class Ball{
  constructor(x,y,r,speedX,speedY){
    this.x = x;
    this.y = y;
    this.r = r;
    this.speedX = speedX;
    this.speedY = speedY;
  }
  draw(){
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fillStyle = "white";
    c.fill();
  }
  updatePosition(){
    this.x += this.speedX;
    this.y += this.speedY;
    this.draw();
  }
}

class Brick{
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // parameters are 0-360 for hue, saturation%, brightness%
    this.color = `hsl(${Math.random()*360},50%,50%)`;
    this.hp = Math.ceil(Math.random()*2)+1; // 1-3 hp
  }
  draw(){
    c.fillStyle = this.color;
    c.fillRect(this.x,this.y,this.w,this.h);
  }
}

function stop(){
  p.speedX = 0;
}

function keyPress(e){
  // http://gcctech.org/csc/javascript/javascript_keycodes.htm keycode list
  let key = e.keyCode;
  if(alive){
    if(p.x<1 || p.x+p.w>canvas.width)
      stop();
    if(key==65 && p.x>0) // a
      p.speedX = -speed;
    else if(key==68 && p.x+p.w<canvas.width) // d
      p.speedX = speed;
  }
  else if(!alive){
    if(key == 82) // press r to restart
      newGame(); // and possibly include save score
  }
  
}

function newGame(){
  restart.style.top = String(-250)+"px";
  scoreNum = 0;
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  p.x = canvas.width/2-p.w/2;;
  stop();
  alive = true;
}

function generateBricks(){
  bricks = [];
  bricks.push(new Brick(0-(Math.random()*40),0,250,50));
  for(let i = 1; i < 16; i++){
    bricks.push(new Brick(bricks[i-1].x+bricks[i-1].w,bricks[i-1].y,100,50));
    if(bricks[i].x>canvas.width){
      bricks[i].x=-(Math.random()*40);
      bricks[i].y=bricks[i-1].y+bricks[i-1].h;
    }
  }
}

function update(){ // game loop
  if(alive){
    c.fillStyle = 'rgba(1,1,1,0.4)'
    c.fillRect(0,0,canvas.width,canvas.height);
    p.updatePosition();
    ball.updatePosition();
    for(let i=0; i<bricks.length; i++)
      bricks[i].draw();
    // ball hits player
    if((ball.y+ball.r == p.y) && (ball.x>=p.x && ball.x+ball.r<=p.x+p.w)){
      if(Math.abs(p.speedX)>Math.abs(ball.speedX))
        ball.speedX = p.speedX;
      ball.speedY *= -1;
    }
    // hits sides of the screen
    if(ball.x<0 || ball.x+ball.r>canvas.width)
      ball.speedX *= -1;

    if(ball.y>canvas.height){ // lose (show score)
      alive = false;
      restart.style.top = String(250)+"px";
    }
    else if(ball.y<0){ // win (next level with current score)
      //alert("passed");
      console.log("passed");
    }
    for(let i=0; i<bricks.length; i++){
      /*
      if(ball.x>=bricks[i].x && ball.x<=bricks[i].x+bricks[i].w && ball.y+ball.h>=bricks[i].y && ball.y<=bricks[i].y+bricks[i].h){
        ball.speedY *= -1;
        bricks[i].hp-=1;
      }
      */
      /*
      // ball hits brick vertically
      if(ball.x>bricks[i].x && ball.x<bricks[i].x+bricks[i].w && ball.y == bricks[i].y+bricks[i].h && Math.abs(ball.speedY)<50){
      //if(ball.y+ball.h>=bricks[i].y && ball.y+ball.h<=bricks[i].y+bricks[i].h){
        bricks[i].hp-=1;
        ball.speedY *= -1;
        scoreNum++;
        score.innerHTML = "Score: "+scoreNum;
      }
      // ball hist brick horizontally
      else if(ball.y>bricks[i].y && ball.y<bricks[i].y+bricks[i].h && (ball.x==bricks[i].x || ball.x==bricks[i].x+bricks[i].w)){
      //else if(ball.x>=bricks[i].x && ball.x<=bricks[i].x+bricks[i].w)
        bricks[i].hp-=1;
        ball.speedX *= -1;
        scoreNum++;
        score.innerHTML = "Score: "+scoreNum;
      }
      */
      // ball hits brick vertically
      if(ball.y<=bricks[i].y+bricks[i].h && ball.x>=bricks[i].x && ball.x+ball.r<=bricks[i].x+bricks[i].w){
        ball.speedY *= -1;
        bricks[i].hp -= 1;
      }
      // ball hits brick horizontally
      else if((ball.x+ball.r>=bricks[i].x || ball.x<=bricks[i].x+bricks[i].w) && ball.y>=bricks[i].y && ball.y+ball.r<=bricks[i].y+bricks[i].h){
        ball.speedX *= -1;
        bricks[i].hp -= 1;
      }
      if(bricks[i].hp < 1){
        scoreNum++;
        score.innerHTML = scoreNum;
        bricks.splice(i,1);
        i--;
      }
    }
  }
}

const speed = 7;
const ballSpeed = 5;
var scoreNum = 0;
var alive = true;

const pWidth = 200;
const p = new Player(canvas.width/2-pWidth/2,canvas.height-100,pWidth,25,"aqua");
const ball = new Ball(canvas.width/2,canvas.height/2,10,0,ballSpeed)
var bricks = [];
generateBricks();

setInterval(update,20);