const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
var restart = document.getElementById("restart");
document.onkeydown = keyPress;
restart.style.opacity = "0";

class board{
  constructor(){
    c.fillStyle = 'rgb(188,140,99)' // background wood color
    c.fillRect(0,0,canvas.width,canvas.height); 
    let step = canvas.width/20;
    let space = step/2;
    for(let i=0; i<canvas.width; i+=step){ // columns
      c.beginPath();
      c.moveTo(space+i,0);
      c.lineTo(space+i,canvas.height);
      c.stroke();
    }
    for(let i=0; i<canvas.height; i+=step){ // rows
      c.beginPath();
      c.moveTo(0,space+i);
      c.lineTo(canvas.height,space+i);
      c.stroke();
    }
  }
}

class dot{
  constructor(x,y,turn){
    this.x=x;
    this.y=y;
    this.r=14;
    this.turn=turn;
  }
  draw(){
    c.beginPath();
    c.arc(this.x,this.y,this.r,0,2*Math.PI,false);
    if(this.turn)
      c.fillStyle = 'white';
    else
      c.fillStyle = 'black';
    c.fill();
    c.lineWidth = 1.5;
    c.strokeStyle = 'black';
    c.stroke();
  }
}

function checkWin(){
  // method: check from placed point, diagonals,verticals,horizontals
  let horizCol=0,vertCol=0,color=0,checkNum=2; // default black for checkNum
  if(turn)
    checkNum=1; // checkNum is white if turn=true

  for(let i=0; i<20; i++){ // check row & column
    horizCol = (bd[i][elementY]==checkNum)?horizCol+1:0;
    vertCol = (bd[elementX][i]==1)?vertCol+1:0;
    if(horizCol==5||vertCol==5){
      win();
      break;
    }
  }
  let i=elementX,j=elementY;
  while(i>=0 && j>=0){ // check diagonal \
    color = (bd[i][j]==1)?color+1:0;
    if(color==5){
      win();
      break;
    }
    i--;
    j--;
  }
  i=elementX;
  j=elementY;
  while(i<20 && j<20){ // check diagonal \
    color = (bd[i][j]==1)?color+1:0;
    if(color==5){
      win();
      break;
    }
    i++;
    j++;
  }

  i=elementX;
  j=elementY;
  while(i>=0 && j<20){ // check diagonal /
    color = (bd[i][j]==1)?color+1:0;
    if(color==5){
      win();
      break;
    }
    i--;
    j++;
  }
  i=elementX;
  j=elementY;
  while(i<20 && j>=0){ // check diagonal /
    color = (bd[i][j]==1)?color+1:0;
    if(color==5){
      win();
      break;
    }
    i++;
    j--;
  }

}

function win(){
  alive=false;
  restart.style.opacity = "1";
  restart.style.top = String(250)+"px";
  if(turn){
    document.getElementById("turn").style.color = "white";
    document.getElementById("turn").innerHTML = "White won!";
  }
  else{
    document.getElementById("turn").style.color = "black";
    document.getElementById("turn").innerHTML = "Black won!";
  }
}

function keyPress(e){
  let key = e.keyCode;
  if(!alive && key==82){ // press r to restart
      restart.style.opacity = "0";
      newGame(); // and possibly include save score
  }
}

function newGame(){
  document.getElementById("turn").style.color = "white";
  document.getElementById("turn").innerHTML = "White";
  b = new board();
  for(let i=0; i<20; i++){
    for(let j=0; j<20; j++)
      bd[i][j] = 0;
  }
  alive = true;
  turn = true; // true=white, false=black
  mouseX=0,mouseY=0;
}

function mousePosition(canvas,event) {
  let rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}

let canvasElem = document.querySelector("canvas");
canvasElem.addEventListener("mousedown", function(e)
{
  if(alive){
    restart.style.opacity = "0";
    mousePosition(canvasElem, e);
    mouseX = Math.floor(mouseX-mouseX%(canvas.width/20)+(canvas.width/40));
    mouseY = Math.floor(mouseY-mouseY%(canvas.height/20)+(canvas.height/40));
    elementX = Math.floor((mouseX-16)/32);
    elementY = Math.floor((mouseY-16)/32);
    
    if(bd[elementX][elementY] == 0){
      if(turn==true){ // true is white
        bd[elementX][elementY] = 1;
        document.getElementById("turn").style.color = "black";
        document.getElementById("turn").innerHTML = "Black";
      }
      else{ // false is black
        bd[elementX][elementY] = 2;
        document.getElementById("turn").style.color = "white";
        document.getElementById("turn").innerHTML = "White";
      }
      const d = new dot(mouseX,mouseY,turn);
      d.draw();
      checkWin(5); // cross 5 dots to win
      turn = !turn;
    }
  }
});

/*
To Do:



*/

var bd = [];
for(let i=0; i<20; i++){
  bd[i] = [];
  for(let j=0; j<20; j++)
    bd[i][j] = 0;
}
var alive = true, turn = true; // true=white, false=black
var mouseX=0,mouseY=0,elementX=0,elementY=0;
var b = new board();


  /* old win check method (diagonals didn't work)
  let vertblack=0,vertwhite=0;
  let horizblack=0,horizwhite=0;
  let diagblack=0,diagwhite=0;
  for(let i=0; i<20; i++){ // columns & rows
    for(let j=0; j<20; j++){
     vertwhite = (bd[i][j]==1)?vertwhite+1:0;
     vertblack = (bd[i][j]==2)?vertblack+1:0;
     horizwhite = (bd[j][i]==1)?horizwhite+1:0;
     horizblack = (bd[j][i]==2)?horizblack+1:0;
      if(vertblack==winAmount||vertwhite==winAmount||horizblack==winAmount||horizwhite==winAmount)
        break;
    }
    if(vertblack==winAmount||vertwhite==winAmount||horizblack==winAmount||horizwhite==winAmount)
      break;
  }
  for(let i=0; i<20; i++){ // check \ diagonal
    for(let j=20-i-1; j>=0; j--){
      diagwhite = (bd[j][j]==1)?diagwhite+1:0;
      diagblack = (bd[j][j]==2)?diagblack+1:0;
      if(diagblack==winAmount||diagwhite==winAmount)
        break;
    }
  }
  if(vertblack==winAmount||horizblack==winAmount||diagblack==winAmount){
    document.getElementById("turn").style.color = "black";
    document.getElementById("turn").innerHTML = "Black won!";
    alive = false;
    restart.style.top = String(250)+"px";
  }
  else if(vertwhite==winAmount||horizwhite==winAmount||diagwhite==winAmount){
    document.getElementById("turn").style.color = "white";
    document.getElementById("turn").innerHTML = "White won!";
    alive = false;
    restart.style.top = String(250)+"px";
  }
  */