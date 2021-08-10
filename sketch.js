var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bgImg,gameoverImg,restartImg;
var z1Img,z2Img;
var rock1Img,rock2Img,rock3Img;
var saviourImg,bulletImg;
var invisible,bg;
var saviour,zombie1,zombie2;
var zombieGroup,rockGroup,bulletGroup,coinGroup;
var coin,coins,coinImg,coinScore;
var gameover,restart;
var lives=3;

function preload(){
bgImg=loadImage("bg.png");
saviourImg=loadAnimation("saviour/s1.png","saviour/s2.png","saviour/s3.png","saviour/s4.png","saviour/s5.png");

z1Img=loadAnimation("zombies/zombie-1.1.png","zombies/zombie-1.2.png","zombies/zombie-1.3.png","zombies/zombie-1.4.png",
"zombies/zombie-1.5.png","zombies/zombie-1.6.png","zombies/zombie-1.7.png","zombies/zombie-1.8.png","zombies/zombie-1.9.png",
"zombies/zombie-1.10.png","zombies/zombie-1.11.png","zombies/zombie-1.12.png","zombies/zombie-1.13.png",
"zombies/zombie-1.14.png","zombies/zombie-1.15.png","zombies/zombie-1.16.png");

z2Img=loadAnimation("zombies/zombie-2.1.png","zombies/zombie-2.2.png","zombies/zombie-2.3.png","zombies/zombie-2.4.png","zombies/zombie-2.5.png",
"zombies/zombie-2.6.png","zombies/zombie-2.7.png","zombies/zombie-2.8.png","zombies/zombie-2.9.png","zombies/zombie-2.10.png",
"zombies/zombie-2.11.png","zombies/zombie-2.12.png","zombies/zombie-2.13.png","zombies/zombie-2.14.png","zombies/zombie-2.15.png",
"zombies/zombie-2.16.png");

bulletImg=loadImage("bullet1.png");
rock1Img=loadImage("rock1.png");
rock2Img=loadImage("rock2.png");
rock3Img=loadImage("rock3.png");
coinImg=loadImage("coin.png");
gameoverImg=loadImage("gameover.png");
restartImg=loadImage("restart.png");


    
}

function setup() {
    createCanvas(displayWidth-50,displayHeight-170);

    bg = createSprite(displayWidth/2,displayHeight/2-85,displayWidth-50,displayHeight-170);
    bg.addImage(bgImg);
    bg.scale = 1.57;
    bg.x = bg.width/2;
    bg.velocityX=-5;

    invisible = createSprite((displayWidth-50)/2,displayHeight-230,displayWidth,40);
    invisible.visible=false;

    saviour=createSprite(200,displayHeight-300);
    saviour.addAnimation("walking",saviourImg);
    saviour.scale=0.5;
    saviour.velocityY=7;

    rockGroup = createGroup();
    zombieGroup = createGroup();
    bulletGroup = createGroup();
    
    coinScore=createSprite(75,60);
    coinScore.addImage(coinImg);
    coinScore.scale=0.025;

    gameOver=createSprite((displayWidth-50)/2,(displayHeight-170)/3);
    gameOver.addImage(gameoverImg);
    gameOver.scale=0.5;
    gameOver.visible=false;
    
    restart=createSprite((displayWidth-50)/2,displayHeight-350);
    restart.addImage(restartImg);
    restart.scale=0.7;
    restart.visible=false;

    zombieGroup=createGroup();
    rockGroup=createGroup();
    bulletGroup=createGroup();
    coinGroup=createGroup();

    coins = 0;

}

function draw() {
    background("red");

    if(gameState===PLAY) {

    if(bg.x<0){
        bg.x=bg.width/2;
    }

    if(mousePressedOver(bg)){
        fire();
    }

    if(coinGroup.isTouching(saviour)){
        //coins=coins+1;
        for(var i=0; i<coinGroup.length; i++){
            if(coinGroup[i].isTouching(saviour)){
                coins=coins+1
                coinGroup[i].destroy();
            }
        }
    }

    if(bulletGroup.isTouching(zombieGroup)){
        //zombieGroup.destroyEach();
        //bulletGroup.destroyEach();
        for(var i=0; i<zombieGroup.length; i++){ //3
            // zombieGroup[1]; i=0
            for(var j=0; j<bulletGroup.length ; j++){//10
                // bulletGroup[0];
                if(zombieGroup[i] !== undefined && bulletGroup[j] !== undefined){

                    if(zombieGroup[i].isTouching(bulletGroup[j])){
                        zombieGroup[i].tint = "green";
                        //setTimeout(() => {zombieGroup[i].destroy()}, 100);
                        zombieGroup[i].destroy()
                        bulletGroup[j].destroy();
                    }
                }
            }
        }
    }
    
    if(keyDown("space") && saviour.y>=displayHeight-400){
        saviour.velocityY=-20;
    }
    saviour.velocityY+=1;
    
    if(rockGroup.isTouching(saviour)) {
        for(var i = 0; i<rockGroup.length; i++){
            if(rockGroup[i].isTouching(saviour)){
                rockGroup[i].destroy();
                lives=lives-1;
                saviour.tint = "red";
                setTimeout(() => {saviour.tint="white";}, 1500);
            }
        }
    }

    if(zombieGroup.isTouching(saviour)) {
        for(var i = 0; i<zombieGroup.length; i++){
            if(zombieGroup[i].isTouching(saviour)){
                zombieGroup[i].destroy();
                lives=lives-1;
                saviour.tint = "red";
                setTimeout(() => {saviour.tint="white";}, 1500);
            }
        }
    }
   
    saviour.collide(invisible);
    spawnZombies();
    rocks();
    coinCreate();
    }  
    
    else if (gameState === END) {
        saviour.visible=false;
        gameOver.visible = true;
        restart.visible = true;
        
        coinGroup.destroyEach();
        zombieGroup.destroyEach();
        bulletGroup.destroyEach();
        rockGroup.destroyEach();

        bg.velocityX = 0;
        saviour.velocityY = 0;
        saviour.velocityX = 0;
        zombieGroup.setVelocityXEach(0);
        rockGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
        bulletGroup.setVelocityXEach(0);
        
        if(mousePressedOver(restart)){
            reset();
        }
      }

    drawSprites();

    textSize(25);
    fill("golden")
    text(": "+coins,100,70);

    textSize(25);
    text(": "+lives,displayWidth-150,70);

}

function spawnZombies(){
    var randomFrames = Math.round(random(150,400));
    if(frameCount%randomFrames===0){
        zombie=createSprite(displayWidth,displayHeight-320,20,200);
        zombie.velocityX=-6;
        var rand = Math.round(random(1,2));
        switch(rand) {
                case 1: zombie.addAnimation("z1",z1Img);
                zombie.scale=0.7;
                        break;
                case 2: zombie.addAnimation("z2",z2Img);
                        zombie.scale=0.6;
                        break;
                default: break;
        }

        zombieGroup.add(zombie);
    }
}

function rocks(){
    if(frameCount%400===0){
        rock=createSprite(displayWidth,saviour.y+75);
        rock.velocityX=-5;
        var rand = Math.round(random(1,3));
        switch(rand) {
                case 1: rock.addImage(rock1Img);
                rock.scale=0.5;
                        break;
                case 2: rock.addImage(rock2Img);
                rock.scale=0.5;
                        break;
                case 3: rock.addImage(rock3Img);
                rock.scale=0.5
                default: break;
        }
        rockGroup.add(rock);
    }
}

function fire(){
        bullet=createSprite(saviour.x+90,saviour.y-35);
        bullet.velocityX=9;
        bullet.addImage(bulletImg);
        bullet.scale=0.03;
        console.log("Mouse has been pressed");
        bulletGroup.add(bullet);
}

function coinCreate(){
    if(frameCount%250===0){
        coin=createSprite(displayWidth,displayHeight-310,20,200);
        coin.addImage(coinImg);
        coin.velocityX=-6;
        coin.scale=0.05;
        coinGroup.add(coin);
    }
}

function reset(){

}