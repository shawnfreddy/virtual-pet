var dog, database,foodS,foodStock,fedTime,lastFed,feed,addFood,foodObj;
var dogName;
var M = 1;
var currentTime;
var changeState,readState;
var gameState;

function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");
bathroomIMG=loadImage("images/PET/Wash Room.png")
bedroomIMG=loadImage("images/PET/Bed Room.png")
gardenIMG=loadImage("images/PET/Garden.png")
livingroomIMG=loadImage("images/PET/Living Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  
  nameDog = createInput("Name of your Dog")
  nameDog.position(400,200)

  button = createButton("ENTER")
  button.position(415,250)
 button.mousePressed(()=>{
button.hide();
nameDog.hide();
dogName = nameDog.value();
M=2;
 })
  
  

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  foodObj = new Food();
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState = database.ref('GameState')
  readState.on("value",function(data){
    gameState=data.val();
  });
  
  dog=createSprite(800,200,150,150);
  dog.addImage("dog1",sadDog);
  dog.scale=0.2;
  
  feed=createButton("Feed the Dog");
  feed.position(1000,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Milk");
  addFood.position(1100,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  
  //foodObj.display();
 currentTime = hour();
 if(currentTime===lastFed+1){
   update("Playing")
   foodObj.garden();
 }else if(currentTime===lastFed+2){
  update("Sleeping")
  foodObj.bedRoom();
 }else if(currentTime>lastFed+2&&currentTime<=lastFed+4){
   update("Bathing")
   foodObj.washroom();
 }else{
   update("Hungry")
   foodObj.display();
 }
 if(gameState!=="Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog)
   background(46,139,87);
 }
 
  textSize(30);
  fill("white");
 console.log(gameState)

  if(M===2){
    fill("#39ff14")
    text(dogName+" is: "+gameState,190,450)
    fill("black")
    text("Name of Dog: " + dogName,10,350)
    fill("white")
    if(lastFed>=12&&lastFed<24){
    
      text(""+dogName+" was last Fed At : "+ lastFed%12 + " PM", 30,60);
     }else if(lastFed==0){
       text(""+dogName+" was Last Fed At: 12 AM",30,30);
     }else{
       text(""+dogName+" was Last Fed At: "+ lastFed + " AM", 30,60);
     }
  }
  drawSprites();
  //console.log(mouseX,  mouseY)
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage("dog1",happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    GameState:state
  })
}

