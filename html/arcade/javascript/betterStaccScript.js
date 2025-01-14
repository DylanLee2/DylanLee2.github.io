const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
var score = document.getElementById("score");
var restart = document.getElementById("restart");
document.onkeydown = keyPress;
document.onkeyup = releaseKey;

/*
High Scores:
Dylan63
Aaron82
 */
class Player{
  constructor(x,y,w,h,color,speedX){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.speedX = speedX;
  }
  move(moveX,moveY){
    this.x += moveX;
    this.y += moveY;
    c.fillStyle = this.color;
    c.fillRect(this.x,this.y,this.w,this.h);
  }
  draw(){
    // strokeStyle, rect, and stroke is drawing an outline, fillStyle and fillRect fills
    c.fillStyle = this.color;
    c.fillRect(this.x,this.y,this.w,this.h);
  }
  leftAndRight(){
    if((this.x<0 && this.speedX<0) || (this.x+this.w>canvas.width && this.speedX>0))
      this.speedX*=-1;
  }
}

function keyPress(e){
  let key = e.keyCode;
  if(alive){
    if(key==32 && !pressed){ // spacebar pressed, new rect
      pressed = true;
      newRect();
    }
  }
  else if(!alive){
    if(key==82) // r is pressed, restart
      newGame();
  }
}

canvas.addEventListener("touchstart",function(e){
  if(alive)
    newRect();
  else
    newGame();
});

function newRect(){
  if(counter<1){
    counter++;
    p.push(new Player(p[0].x,p[0].y,p[0].w,p[0].h,"red",p[0].speedX));
    p[1].draw();
  }
  if((p[counter].x+p[counter].w < p[counter-1].x) || (p[counter].x>p[counter-1].x+p[counter-1].w)){
    alive = false;
  }
  p[counter].color = p[0].color;
  // current rec is to the left of prev rectangle
  if(p[counter].x < p[counter-1].x){
    s.push(new Player(p[counter].x,p[counter].y,p[counter-1].x-p[counter].x,p[counter].h,"red"));
    p[counter].w = p[counter].x+p[counter].w-p[counter-1].x;
    p[counter].x = p[counter-1].x;
    streak = 1;
  }
  // current rec is to the right of prev rectangle
  else if(p[counter].x > p[counter-1].x){
    s.push(new Player(p[counter-1].x+p[counter-1].w,p[counter].y,p[counter].x+p[counter].w-p[counter-1].x-p[counter-1].w,p[counter].h,"red"));
    p[counter].w = p[counter].w-(p[counter].x+p[counter].w-p[counter-1].x-p[counter-1].w)
    streak = 1;
  }
  // current rec is exactly on prev rectangle
  else if(p[counter].x==p[counter-1].x && p[counter].x+p[counter].w==p[counter-1].x+p[counter-1].w && counter>1){
    p[counter].color = "green";
    streak++;
  }
  if(streak>3){
    p[counter].x -= 10; // make player wider when streak passes 3
    p[counter].w += 20;
  }
  counter++;
  let newPlayerCol = "red";
  p.push(new Player(p[counter-1].x,p[counter-1].y-p[counter-1].h,p[counter-1].w,p[counter-1].h,newPlayerCol,p[counter-1].speedX));
  //p[counter].speedX = defaultSpeed*(startWidth/p[counter].w);
  score.innerHTML = (counter-1);
}

function releaseKey(){
  pressed = false;
}

function newGame(){
  counter = 1;
  score.innerHTML = (counter-1);
  alive = true;
  streak = 0;
  for(let i=1; i<p.length; i++){
    p.splice(i,1);
    i--;
  }
  p[0].y=canvas.height-35;
  p.push(new Player(p[0].x,p[0].y-p[0].h,p[0].w,p[0].h,"red",p[0].speedX));
}

function update(){ // game loop
  if(alive){
    restart.style.opacity = "0";
    if(counter>0){ // 1st rectangle on
      c.fillStyle = 'rgba(1,1,1,0.4)'
      c.fillRect(0,0,canvas.width,canvas.height);
      for(let i=0; i<p.length; i++) // constantly display stacks
        p[i].draw();
      for(let i=0; i<s.length; i++){ // displays the falling rectangles
        s[i].draw();
        s[i].move(0,2);
        if(s[i].y > canvas.height){
          s.splice(i,1);
          i--;
        }
      }
      if(p[counter].y<30){ // camera aligning "animation"
        for(let i=0; i<p[counter].h; i++){
          setTimeout(function(){
            for(let j = 0; j < p.length; j++)
              p[j].move(0,0.1); 
          },1);
        }
      }
      if(p[counter].w<2) // dies if player's width is too smol
        alive = false;
      p[counter].move(p[counter].speedX,0);
      p[counter].leftAndRight();
    }
  }
  else{
    restart.style.opacity = "1";
    restart.style.top = String(150)+"px";

  }
}

c.fillStyle = 'rgb(1,1,1)'
c.fillRect(0,0,canvas.width,canvas.height);
var p = [];
const startWidth = canvas.width/2;
const height=40
const defaultSpeed = 4;
p.push(new Player((canvas.width/2)-(startWidth/2),canvas.height-height,startWidth,height,"blue",defaultSpeed));
p[0].draw();
var s = [];
var counter = 0;
var streak = 0;
var alive = true;
var pressed = false;
 
setInterval(update,15);