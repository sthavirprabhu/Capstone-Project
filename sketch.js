var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Runner, Runnerrunning, RunnerDead;
var ground, invisibleGround, groundImage;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

function preload(){
  Runnerrunning = loadAnimation("Boy Running 1.png","Boy Running 2.png","Boy Running 3.png","Boy Running 4.png","Boy Running 5.png","Boy Running 6.png","Boy Running 7.png","Boy Running 8.png");
  RunnerDead = loadAnimation("Boy Running 1 - Copy.png")
  
  groundImage = loadImage("ground2.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  cloudImage = loadImage("cloud.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  //Creating Sprites
  
 Runner = createSprite(50,160,20,50);
 Runner.addAnimation("running", Runnerrunning);
 Runner.addAnimation("Dead", RunnerDead);
 Runner.scale = 0.25;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);

  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  Runner.setCollider("rectangle",0,0,Runner.width,Runner.height);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  
  score = 0;
  
}

function draw() {
  
  background(180);
  
  text("Score: "+ score, 500,50);
  
  //Setting Gamestates
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    
    if(keyDown("space")&& Runner.y >= 100) {
      Runner.velocityY = -12;
        jumpSound.play();
    }
    
    
    Runner.velocityY = Runner.velocityY + 0.8
  
    
    spawnClouds();
  
    
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(Runner)){
        
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;

      Runner.changeAnimation("Dead", RunnerDead);
    
      ground.velocityX = 0;
      Runner.velocityY = 0
      
     
      
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  
  Runner.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState = PLAY
score = 0
obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()
  
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
           
    obstacle.scale = 0.15;
    obstacle.lifetime = 300;
   
   
    obstaclesGroup.add(obstacle);
 }
}

//Spawn Clouds

function spawnClouds() {
  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 200;
    cloudsGroup.add(cloud);
    cloud.depth = Runner.depth;
    Runner.depth = Runner.depth + 1;
  }
}

