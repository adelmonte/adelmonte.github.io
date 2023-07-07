let canvas = document.querySelector("canvas")

canvas.width=window.innerWidth
canvas.height=window.innerHeight

let ctx = canvas.getContext('2d')
 
 let colors =[
  '#FFFF00',
  '#e74c3c',
  '#ecf0f1',
  '#349b0b',
  '#2980b9',
 ]

 let mouse ={
  x:undefined,
  y:undefined,
 }

 let gravity = 1
 let friction = .98

 document.addEventListener("mousemove",(e)=>{
  mouse.x=e.x
  mouse.y=e.y
 })

 window.addEventListener("resize",()=>{
  canvas.width=window.innerWidth
  canvas.height=window.innerHeight
  init()
 })

 window.addEventListener('click',()=>{
  init()
 })

 // Utility Functions
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

 function Ball(x,y,dy,dx,r,color){
 this.x=x
 this.y=y
 this.dy=dy
 this.dx=dx
 this.r=r
 this.color=color

 this.Draw = function(){
  ctx.beginPath()
  ctx.arc(this.x,this.y,this.r,0,Math.PI*2 ,false)
  ctx.strokeStyle="blue"
  ctx.stroke()
  ctx.fillStyle=this.color
  ctx.fill()
 }

 this.Update = function(){
  if(this.y+this.r>canvas.height){
   this.dy=-this.dy*friction
  }
  else{
   this.dy+=gravity
  }
  if(this.x+this.r>canvas.width||this.x-this.r<=0){
   this.dx=-this.dx
  }
  this.y+=this.dy
  this.x+=this.dx
  this.Draw()
 }
 }

 let ball
 let ballArray
function init(){
 ballArray=[]
  for(let i=0; i<400;i++){
   let raduis=randomIntFromRange(8,20)
   let x=randomIntFromRange(0,canvas.width-raduis)
   let y=randomIntFromRange(0,canvas.height-raduis)
   let dx =randomIntFromRange(-2,2)
   let dy =randomIntFromRange(-2,2)
   let color = randomColor(colors)
   ballArray.push(new Ball(x,y,dy,dx,raduis,color))
  }
}

init()


 function animate(){
  requestAnimationFrame(animate)
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
  for(let i =0 ;i<ballArray.length;i++){
   ballArray[i].Update()
  }
  // canvas.fillText("HTML Canvas PoilerBlate" ,mouse.x,mouse.y)
 }

 animate()
