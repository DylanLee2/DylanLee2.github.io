// Dylan Lee 11/20/21 just playing around with js :P
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
document.onkeydown = keyPress;
document.onkeyup = stop;
document.onclick = shoot;
const displayScore = document.getElementById("score");
const displayAmmo = document.getElementById("dispAmmo");
const restartText = document.getElementById("restart");

class Player{
  constructor(x,y,w,h,type){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.maxSpeed = 4;
    this.speedX = 0;
    this.speedY = 0;
    this.type = type;
    if(this.type == "player")
      this.image = document.getElementById("player");
    else if(this.type == "enemy")
      this.image = document.getElementById("enemy");
    else if(this.type == "ammo")
      this.image = document.getElementById("ammo");
  }
  draw(){
    c.drawImage(this.image,this.x,this.y,this.w,this.h);
  }
  switchImage(imgsrc){
    this.image = document.getElementById(imgsrc);
    this.draw();
  }
  updatePosition(){
    this.x += this.speedX;
    this.y += this.speedY;
    this.draw();
  }
}

class Projectile{
  constructor(x,y,w,h,color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;
  }
  draw(){
    c.fillStyle = this.color;
    c.fillRect(this.x,this.y,this.w,this.h);
  }
  updatePosition(){
    this.x += this.speedX;
    this.y += this.speedY;
    this.draw();
  }
}

var p = new Player(canvas.width/2,canvas.height/2,50,70,"player");
var bullets = [];
var enemies = [];
var ammopack = [];
var mouseX = 0;
var mouseY = 0;
var ammo = 10;
var score = 0;
var msScore = 0;
var alive = true;
var abilityOn = false;
var bulletColor = "white";

function spawn(){
  if(alive){
    setInterval(()=>{
      let enemyWidthAndHeight = Math.random()*(80-40)+40; // width & height are 40-80
      let enemyX, enemyY;
      if(Math.random<0.5){
        enemyX = Math.random() < 0.5 ? 0-40 : canvas.width;
        enemyY = Math.random()*canvas.height;
      }
      else{
        enemyX = Math.random()*canvas.width;
        enemyY = Math.random() < 0.5 ? 0-40 : canvas.height;
      }
      enemies.push(new Player(enemyX,enemyY,enemyWidthAndHeight,enemyWidthAndHeight,"enemy"));
    },1500);
    setInterval(()=>{
      let ammoX = Math.random()*canvas.width;
      let ammoY = Math.random()*canvas.height;
      ammopack.push(new Player(ammoX,ammoY,20,30,"ammo"));
    },9000);
  }
}

function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}

let canvasElem = document.querySelector("canvas");
canvasElem.addEventListener("mousedown", function(e)
{
  getMousePosition(canvasElem, e);
});

function shoot(){
  if(alive && ammo>0){
    //let mouseX = e.pageX-canvas.width/1.7;
    //let mouseY = e.pageY-canvas.height/1.4;
    let playerX = p.x+(p.w/2);
    let playerY = p.y+(p.h/2);
    const angle = Math.atan2(mouseY-playerY,mouseX-playerX);
    if(!abilityOn){ // shoot normal bullet
      ammo--;
    }
    else if(abilityOn){ // shoot penetrating bullet (toggle back if not enough ammo)
      if(ammo >= 5){
        ammo-=5;
      }
      else{
        abilityOn = false;
        p.switchImage("player");
        bulletColor = "white";
      }
    }
    bullets.push(new Projectile(playerX,playerY,10,10,bulletColor));
    bullets[bullets.length-1].speedX = Math.cos(angle)*8;
    bullets[bullets.length-1].speedY = Math.sin(angle)*8;
    displayAmmo.innerHTML = "Ammo: "+ammo;
  }
}

function stop(){
  p.speedX = 0;
  p.speedY = 0;
}

function keyPress(e){
  let key = e.keyCode;
  if(alive){
    if(key == 87) // w = 87
      p.speedY = -p.maxSpeed;
    else if(key == 83) // s = 83
      p.speedY = p.maxSpeed;
    else if(key == 65) // a = 65
      p.speedX = -p.maxSpeed; 
    else if(key ==  68) // d = 68,
      p.speedX = p.maxSpeed;
    else if(key == 69 && !abilityOn && ammo>=5){ // e = 69 turns on penetrating ammo
      abilityOn = true;
      p.switchImage("angryPlayer");
      bulletColor = "red";
    }
    else if(key == 69 && abilityOn){
      abilityOn = false;
      p.switchImage("player");
      bulletColor = "white";
    }
  }
  else if(!alive && key == 82){ // r = 82, restart game
    restart();
  }
}

function restart(){
  bullets = [];
  enemies = [];
  ammopack = [];
  p.x = canvas.width/2;
  p.y = canvas.height/2;
  score = 0;
  ammo = 10;
  displayAmmo.innerHTML = "Ammo: "+ammo;
  restartText.style.top = String(-250)+"px";
  p.switchImage("player");
  bulletColor = "white";
  abilityOn = false;
  alive = true;
}

  /* Checklist :)
  restart button (currently press r to restart)
  barriers that block movement
  melee attacks(slow)
  power ups (eg speed boost, infinite ammo for a period of time, etc.)
  soundfx if possible
  ammo & score icon
  clone that enemies go toward as bait
  when enemies die they have x eyes and slowly fade
  more abilities (triple shot, extra hit, dash)
  */

function isColliding(a,b){
  return (a.x+a.w>=b.x && a.x<=b.x+b.w && a.y+a.h>=b.y && a.y<=b.y+b.h); // shorter code :P
}

function update(){
  if(alive){
    restartText.style.opacity = "0";
    c.fillStyle = 'rgba(1,1,1,0.4)' // background
    c.fillRect(0,0,canvas.width,canvas.height);
    p.updatePosition();
    for(let i = 0; i < ammopack.length; i++){
      ammopack[i].draw();
      if(isColliding(ammopack[i],p)){
        ammo += 3;
        displayAmmo.innerHTML = "Ammo: "+ammo;
        ammopack.splice(i,1);
        i--;
      }
    }
    for(let i = 0; i < bullets.length; i++){
      bullets[i].updatePosition();
      if(bullets[i].x+bullets[i].w < 0 || bullets[i].x > canvas.width || bullets[i].y+bullets[i].h < 0 || bullets[i].y>canvas.height){
        bullets.splice(i,1);
        i--;
      }
    }
    for(let i = 0; i < enemies.length; i++){
      enemies[i].updatePosition();
      let angle = Math.atan2(p.y-enemies[i].y+(p.h/2),p.x-enemies[i].x+(p.w/2)); // enemy movement
      enemies[i].speedX = Math.cos(angle);
      enemies[i].speedY = Math.sin(angle);
      if(isColliding(enemies[i],p)){
        p.switchImage("deadPlayer");
        restartText.style.opacity = "1";
        restartText.style.top = String(150)+"px";
        alive = false;
        break;
      }
      for(let j = 0; j < bullets.length; j++){
        if(isColliding(bullets[j],enemies[i]) && !abilityOn){ // bullet stops when hitting enemy
          enemies.splice(i,1);
          bullets.splice(j,1);
        }
        else if(isColliding(bullets[j],enemies[i]) && abilityOn){ // penetrating bullets go through enemy
          enemies.splice(i,1);
        }
      }
    }
    // score is based on time survived
    msScore++;
    if(msScore == 6){
      msScore = 0;
      score++;
      displayScore.innerHTML = score;
    }
    // player recycling
    if(p.x > canvas.width)
      p.x = -p.w;
    else if(p.x < -p.w)
      p.x = canvas.width;
    if(p.y > canvas.height)
      p.y = -p.h;
    else if(p.y < -p.h)
      p.y = canvas.height;
  }
}

var game = setInterval(update,20); // basically canvas.pause
spawn();