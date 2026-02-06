var player, enemy, enemyGroup, enemies2, enemies, ground, sword, beam, slash, pastPosition, health;
var cooldown, cooldown2, cooldown3, cooldownBar, cooldownBar2, cooldownBar3, cooldownBar4;
var healthBar, healthBar, invincibility, gameState, randomness, dodge, gameState, money;
var ground_img, background_img, groundGroup, bottom, energy, wave, amount, beam_array,shop_img, shop;
var a, b, c, mana, manaBar, manaBar2, medkit, medkit_img, energy_img, enemy_beam, beam_group;

function preload() {
  ground_img = loadImage("sprites/ground.png");
  background_img = loadImage("sprites/background.png");
  medkit_img = loadImage("sprites/MedPack.png");
  energy_img = loadImage("sprites/energy.png");
  shop_img = loadImage("sprites/space1.png");

}

function setup() {
  
  createCanvas(windowWidth,windowHeight);
  shop = createSprite(400, height/2 - 100, 50, 50); 
  shop.lifetime = 1;
  money  = 0;
  dodge = 0;
  randomness = 0;
  wave = 1;
  sword = createSprite(400, height/2 - 100, 50, 50);
  sword.lifetime = 1;
  beam = createSprite(400, height/2 - 100, 50, 50);
  beam.lifetime = 1;
  enemy_beam = createSprite(400, height/2 - 100, 50, 50);
  enemy_beam.lifetime = 1; 
  slash = createSprite(400, height/2 - 100, 50, 50);
  slash.lifetime = 1;
  player = createSprite(width/2, height*3/4 - 100, 50, 50);
  player.shapeColor = rgb(0,0,150);
  medkit = createSprite(1400, 550, 50, 50);
  medkit.lifetime = 1;
  energy = createSprite(1400, 550, 50, 50);
  energy.lifetime = 1;
  bottom = createSprite(width/2,height*7/8,windowWidth,height/4);
  bottom.shapeColor = rgb(147,110,79);
  cooldown = 0;
  pastPosition = player.x - 1;
  health = 100;
  invincibility = 0;
  groundGroup = createGroup();
  enemyGroup = createGroup();
  beam_group = createGroup();
  enemies = [];
  enemies2 = [];
  beam_array = [];
  a = -1;
  b = -1;
  c = -1;
  amount = 0;
  enemy = createSprite(1400, 550, 50, 50);
  enemy.shapeColor = rgb(150,150,150);
  enemy.lifetime = 1;
  healthBar = createSprite(100,150,20,150);
  healthBar.shapeColor = "red";
  healthBar2 = createSprite(100,150,20,150);
  healthBar2.shapeColor = "green";
  cooldown2 = 0;
  cooldownBar = createSprite(100,300,20,120);
  cooldownBar.shapeColor = "black";
  cooldown3 = 0;
  cooldownBar3 = createSprite(200,300,20,120)
  cooldownBar3.shapeColor = "black";
  mana = 200;
  manaBar = createSprite(200,150,20,150)
  manaBar.shapeColor = "black";
  manaBar2 = createSprite(200,150,20,150)
  manaBar2.shapeColor = "blue";
  gameState = "on";
  total = 10;
  for (var i = 0; i < windowWidth + 64; i+=128) {
    ground = createSprite(i,height*3/4,50,50);
    ground.addImage("ground",ground_img);
    groundGroup.add(ground);
  }
}

function draw() {
  //console.log(energy.lifetime);
  background(background_img);
  player.velocityY = player.velocityY + 0.4;
  //console.log(c);
  player.collide(groundGroup);
  enemyGroup.collide(groundGroup);
  medkit.collide(groundGroup);
  energy.collide(groundGroup);
  //groundGroup.visible = false;
  
  if (gameState === "on") { 
    if (total === amount ) {
      if (a === -1 && b === -1) {
        gameState = "off";
        total = total + 5;
        amount = 0;
      } 
      
    } else {
      enemySpawn();
    }
    enemyMovement();
    if (b >= 0) {
      enemyBeam();
    }

    if (health <= 0) {
      gameState = "gameOver";
    } 
    if ((player.isTouching(enemyGroup) && invincibility < 0 && dodge < 35) || (player.isTouching(beam_group) && invincibility < 0 && dodge < 35)) {
      if (a >= 0) {
        for (var i = 0; i <= a; i+=1) {
          if (player.isTouching(enemies[i])){
            if (enemies[i].x > player.x) {
              player.x = player.x - 100;
            } else {
              player.x = player.x + 100;
            }
          }
        }
      }
      if (b >= 0) {
        for (var i = 0; i <= b; i+=1) {
          if (player.isTouching(enemies2[i])){
            if (enemies2[i].x > player.x) {
              player.x = player.x - 100;
            } else {
              player.x = player.x + 100;
            }
          }
        }
      }
      if (c >= 0) {
        for (var i = 0; i <= c; i+=1) {
          if (player.isTouching(beam_array[i])){
            if (beam_array[i].x > player.x) {
              player.x = player.x - 100;
            } else {
              player.x = player.x + 100;
            }
            beam_array[i].destroy();
          }
        }
      }
      health = health - 10;
      healthBar2.destroy();
      if (health > 0) {
        healthBar2 = createSprite(100,225-(3/4)*health,20,(3/2)*health);
        healthBar2.shapeColor = "green";
      }

      invincibility = 30;
      player.shapeColor = rgb(0,20,150,0.25);
    } 
    if (player.isTouching(medkit)) {
      medkit.lifetime = 1;
      if (health != 100) {
        health = health + 5;
        healthBar2.destroy();
        healthBar2 = createSprite(100,225-(3/4)*health,20,(3/2)*health);
        healthBar2.shapeColor = "green";
      }
    }
    if (player.isTouching(energy)) {
      energy.lifetime = 1;
      mana = mana + 10; 
      if (mana > 200) {
        mana = 200;
      }
      manaBar2.destroy();
      manaBar2 = createSprite(200,225-(3/8)*mana,20,(3/4)*mana);
      manaBar2.shapeColor = "blue";
    }
    if (keyDown("e") && dodge === 0 && invincibility === -1) {
      dodge = 60;
    }

    if (dodge >= 35) {
      player.shapeColor = rgb(0,20,250,0.5);
      dodge = dodge - 1;
    } else if (dodge != 0) {
      if (invincibility === -1) {
        player.shapeColor = rgb(0,20,150);
      }
      
      dodge = dodge - 1;
    }

    if(invincibility >= 0) {
      player.shapeColor = rgb(0,20,150, 0.25);
      if(invincibility === 0) {
        player.shapeColor = rgb(0,20,150);
      }
      invincibility = invincibility - 1;
    }

    if(cooldown > 0){
    /* cooldownBar2 = createSprite(100,160-4*cooldown,20,8*cooldown);
      cooldownBar2.shapeColor = "red";*/
      cooldown = cooldown - 1;
    }
    if(cooldown2 > 0){
      cooldownBar2 = createSprite(100,360-2*cooldown2,20,4*cooldown2);
      
      cooldownBar2.lifetime = 1;
      cooldown2 = cooldown2 - 1;
    }
    if(cooldown3 > 0){
      cooldownBar4 = createSprite(200,360-cooldown3,20,2*cooldown3);
      cooldownBar4.lifetime = 1;
      cooldown3 = cooldown3 - 1;
    }
    if (ground.y - player.y <= 41 && player.velocityX != 0) {
      player.velocityX = 0;
    }
    if(ground.y - player.y <= 41 && keyWentDown("w")) {
      player.velocityY = -10;
      /*if (keyDown("shift") && keyDown("a")){
        player.velocityX = -10;
     } else if (keyDown("a")) {
       player.velocityX = -5;
     } else if (keyDown("shift") && keyDown("d")) {
      player.velocityX = 10;
     } else if(keyDown("d")) {
      player.velocityX = 5;
     }
     if (keyDown("a") && keyDown("d")) {
      player.velocityX = 0;
     }*/
    }
    if(keyDown("a") ) {
      pastPosition = player.x;
      if (keyDown("shift")) {
        player.x = player.x - 10;
      } else {
        player.x = player.x - 5;
      }
      
    }
    if(keyDown("d") ) {
      pastPosition = player.x;
      if (keyDown("shift")) {
        player.x = player.x + 10;
      } else {
        player.x = player.x + 5;
      }
    }
    if (keyWentDown("i") && cooldown === 0 && cooldown2 < 25 && cooldown3 < 55) {
      attack();
      cooldown = 6;
    }
    if (keyWentDown("o")) {
      if ((keyDown("a") && cooldown2 < 25 && cooldown < 3 && cooldown3 === 0 && mana >= 15) || 
      (keyDown("d") && cooldown2 < 25 && cooldown < 3 && cooldown3 === 0 && mana >= 15)) {
        swordSlash();
        cooldown3 = 60;
      } else if (mana >= 10 && cooldown2 === 0 && cooldown <3 && cooldown3 < 55) {
        swordBeam();
        cooldown2 = 30;
      }

    }
    if (enemyGroup.isTouching(sword)) {
      if (a >= 0) {
        for (var i = 0; i <= a; i+=1) {
          if (sword.isTouching(enemies[i])){
            kill = enemies[i];
            lootDrops();
            
            enemies[i].destroy();
            enemies.splice(i,1);
            a = a - 1;
          }
        }
      }
      if (b >= 0) {
        for (var i = 0; i <= b; i+=1) {
          if (sword.isTouching(enemies2[i])){
            kill = enemies2[i];
            lootDrops();
            
            enemies2[i].destroy();
            enemies2.splice(i,1);
            b = b - 1;
          }
        }
      }
    }
    if (enemyGroup.isTouching(beam)) {
      if (a >= 0) {

        for (var i = 0; i <= a; i+=1) {
          if (beam.isTouching(enemies[i])){
            kill = enemies[i];
            lootDrops();
            enemies[i].destroy();
            beam.destroy();
            enemies.splice(i,1);
            a = a - 1;
          }
        }
      }
      if (b >= 0) {

        for (var i = 0; i <= b; i+=1) {
          if (beam.isTouching(enemies2[i])){
            kill = enemies2[i];
            lootDrops();
            enemies2[i].destroy();
            beam.destroy();
            enemies2.splice(i,1);
            b = b - 1;
          }
        }
      }
    }
    if (enemyGroup.isTouching(slash)) {
        if (a >= 0) {
        for (var i = 0; i <= a; i+=1) {
          
          if (slash.isTouching(enemies[i])){
            kill = enemies[i];
            lootDrops();
            enemies[i].destroy();
            enemies.splice(i,1);
            a = a - 1;
          }
        }
      }
      if (b >= 0) {
        for (var i = 0; i <= b; i+=1) {
          
          if (slash.isTouching(enemies2[i])){
            kill = enemies2[i];
            lootDrops();
            enemies2[i].destroy();
            enemies2.splice(i,1);
            b = b - 1;
          }
        }
      }
    }
    
    
    
  }

  /*if (gameState === "shop") {
    shop = createSprite(width/2,height/2,50,50);
    shop.shapeColor = rgb(0,0,0);
    shop.addImage("shop",shop_img);
    shop.scale = width/200;
  }*/
  drawSprites();
  textSize(20);
  stroke('white');
  fill('black');
  text("Money: " + money,width*(9/10), height*(0.5/10));
  if (gameState === "off") {
    textSize(30);
    stroke('white');
    fill('black');
    text("Wave finished",width/2 - 100, height*(8/10));
    text("Press space to go to next one",width/2 - 200, height*(8.5/10));
    text("Press s to go to the upgrade shop", width/2 - 250, height*(9/10))
    if(keyDown("space")) {
      gameState = "on";
      wave = wave + 1;
    }
    
    /*if(keyDown("s")) {
      gameState = "shop";
      if(keyDown("space")) {
        gameState = "on";
      }
    }*/
  }
  if (gameState === "gameOver") {
    textSize(30);
    stroke('white');
    fill('black');
    text("You lost",width/2 - 50, height*(6/10));
    text("Game Over",width/2 - 50, height*(6.5/10));
  }

  if (c >= 0) {
    for (var i = 0; i <= c; i+=1) {
      if (beam_array[i].lifetime === 0){
       //beam_array[i].destroy();
       beam_array.splice(i,1);
       c = c - 1;
      }
    }
  }

  textSize(30);
  stroke('white');
  fill('black');
  text("Wave:" + wave,width/2 - 50, height/10);
}



function attack() {
  if (keyDown("w")) {
    sword = createSprite(player.x,player.y - 50,10,50)
  } else  if(keyDown("s") && ground.y - player.y > 41){
    sword = createSprite(player.x,player.y + 50,10,50)
  } else  if(player.x - pastPosition < 0){
    sword = createSprite(player.x - 50,player.y,50,10)
  } else  if(player.x - pastPosition > 0){
    sword = createSprite(player.x + 50,player.y,50,10)
  }
  sword.shapeColor = "white";
  sword.lifetime = 2;
}

function swordBeam() {
  if (player.x - pastPosition < 0) {
    beam = createSprite(player.x-25,player.y,10,50);
  beam.velocityX = -20;
  } else {
    beam = createSprite(player.x+25,player.y,10,50);
    beam.velocityX = 20;
  }
  mana = mana - 10;
  manaBar2.destroy();
  if (mana > 0) {
    manaBar2 = createSprite(200,225-(3/8)*mana,20,(3/4)*mana);
    manaBar2.shapeColor = "blue";
  }
  beam.shapeColor = "white";
  beam.lifetime = 30;
}

function swordSlash() {
  if (player.x - pastPosition < 0) {
    player.x = player.x - 250;
    slash = createSprite(player.x+125,player.y,200,10);
  
  } else {
    player.x = player.x + 250
    slash = createSprite(player.x-125, player.y,200,10);
  }
  mana = mana - 15;
  manaBar2.destroy();
  if (mana > 0) {
    manaBar2 = createSprite(200,225-(3/8)*mana,20,(3/4)*mana);
    manaBar2.shapeColor = "blue";
  }
  slash.shapeColor = "white";
  slash.lifetime = 2;
}

function enemySpawn() {
  if (frameCount%60 === 0) {
    
    amount = amount + 1;
    if (amount%2 === 1){
      enemy = createSprite(width*19/20, height*3/4 - 100, 50, 50);
      enemy.velocityX = -2;
    } else {
      enemy = createSprite(width/20, height*3/4 - 100, 50, 50);
      enemy.velocityX = 2;
    }
    randomness = Math.random(0,1);

    if (wave >= 3) {
      randomness = Math.random(0,1);
    } else {
      randomness = 0.1;
    }

    if (randomness <= 0.8) {
      enemy.shapeColor = rgb(127.5, 127.5, 127.5);
      enemies.push(enemy);
      a = a + 1;
    } else {
      enemy.shapeColor = rgb(255, 71, 46);
      enemies2.push(enemy);
      b = b + 1;
    }
    
    //enemy.lifetime = 500;
    enemyGroup.add(enemy);
    
    //console.log(enemies);
  }
}

function enemyMovement() {
    if (a >= 0) {
      for (var q = 0; q <= a; q+=1) {
        /*if (ground.y - enemies[q].y <= 41 && ground.y - player.y > 41 && Math.abs(player.x - enemies[q].x) <= 50) {
          enemies[q].velocityY = -10;
       }*/ 
       if (Math.ceil(random(0,200) + 0.000001) === 69 && ground.y - enemies[q].y <= 41) {
        enemies[q].velocityY = -10;
       }
       if (player.x - enemies[q].x < 0 && ground.y - enemies[q].y <= 41 ) {
        enemies[q].velocityX = -2;
       } else if (player.x - enemies[q].x >= 0 && ground.y - enemies[q].y <= 41 ){
        enemies[q].velocityX = 2;
       }
       enemies[q].velocityY =  enemies[q].velocityY + 0.4;
      }
    }
    if (b >= 0) {
      for (var q = 0; q <= b; q+=1) {
       if (Math.ceil(random(0,300) + 0.000001) === 69 && ground.y - enemies2[q].y <= 41) {
        enemies2[q].velocityY = -10;
       }
       /*if (Math.ceil(random(0,150) + 0.000001) === 69 ) {
        c = c + 1;
        if (player.x - enemies2[q].x < 0) {
         enemy_beam = createSprite(enemies2[q].x-25,enemies2[q].y,50,10);
         enemy_beam.velocityX = -10;
       } else {
         enemy_beam = createSprite(enemies2[q].x+25,enemies2[q],50,10);
         enemy_beam.velocityX = 10;
       }
       enemy_beam.shapeColor = "white";
       enemy_beam.lifetime = 150;
       beam_group.add(enemy_beam);
       beam_array.push(enemy_beam);
      }*/
       if (Math.abs(player.x - enemies2[q].x) <= 500 && ground.y - enemies2[q].y <= 41) {
        enemies2[q].velocityX = 0;
       } else if (player.x - enemies2[q].x < 0 && ground.y - enemies2[q].y <= 41 ) {
        enemies2[q].velocityX = -2;
       } else if (player.x - enemies2[q].x >= 0 && ground.y - enemies2[q].y <= 41 ){
        enemies2[q].velocityX = 2;
       }
       enemies2[q].velocityY =  enemies2[q].velocityY + 0.4;
      }
    }
  }


  function lootDrops() {
    if (Math.ceil(random(1,10) + 0.00000000001) === 5 && medkit.lifetime === 0){
      medkit = createSprite(kill.x,kill.y,10,10);
      medkit.addImage("medkit",medkit_img);
      medkit.velocityY = 1;
      medkit.lifetime = 100;
    } else if (Math.ceil(random(1,10) + 0.00000000001) === 6 && energy.lifetime === 0) {
      energy = createSprite(kill.x,kill.y,10,10);
      energy.addImage("energy pack",energy_img);
      energy.velocityY = 1;
      energy.lifetime = 100;
      energy.scale = 0.194;
    }
  }

  function enemyBeam() {
    
      for (var q = 0; q <= b; q+=1) {
        if (Math.ceil(random(0,150) + 0.000001) === 69 ) {
          c = c + 1;
        if (player.x - enemies2[q].x < 0) {
         enemy_beam = createSprite(enemies2[q].x-25,enemies2[q].y,50,10);
         enemy_beam.velocityX = -10;
       } else {
         enemy_beam = createSprite(enemies2[q].x+25,enemies2[q],50,10);
         enemy_beam.velocityX = 10;
       }
       enemy_beam.shapeColor = "white";
       enemy_beam.lifetime = 150;
       beam_group.add(enemy_beam);
       beam_array.push(enemy_beam);
        }
      }
    
    
  }
