var game;
var Colors = [0x489ad8,0xedc233, 0x1a5882, 0xd95f49, 0xffffff];
var score;
var saveData;
var signalgroup1;
var signalgroup2;
var waveTime1=0;
var waveTime2=0;
var collidetime=0;
var hard=50;
var wave1;
var wave2;
var pong1=false;
var pong2=false;
var target;
var leftplaybutton;
var rightplaybutton;
var lefttsellect;
var rightsellect;
var leftagainsellect;
var rightagainsellect;
var howleftsellect;
var howrightsellect;
var leftplayer;
var rightplayer;
var leftcollide;
var rightcollide;
var leftcollidepos;
var rightcollidepos;
var timer,timeEvent;
var ticktoc;
var scoretext;
var saveData;
var localStorageName='shakerama';
var leftreadybutton;
var rightreadybutton;
var leftretrybutton;
var rightretrybutton;
var socket = io.connect();
var connectOne=false;
var connectOneCount=0;
var leftmovement=false;
var connectTwo=false;
var connectTwoCount=0;
var rightmovement=false;
var hitSound1;
var hitSound2;
var bgMusic;


window.onload = function() {
     var width=1334;
     var height=750;
     game=new Phaser.Game(width,height,Phaser.CANVAS,"shakerama");
     game.state.add("Boot", boot);
     game.state.add("Preload", preload); 
     game.state.add("TitleScreen", titleScreen);
     game.state.add("HowToPlay", howToPlay);
     game.state.add("PlayGame", playGame);
     game.state.add("GameOverScreen", gameOverScreen);
     game.state.start("Boot");
}

var boot = function(game){};
boot.prototype = {
     preload: function(){
          this.game.load.image("loading","assets/sprites/loading.png"); 
     },
     create: function(){
          game.scale.pageAlignHorizontally = true;
          game.scale.pageAlignVertically = true;
          game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          this.game.state.start("Preload");
     }      
}

var preload = function(game){};
preload.prototype = {
     preload: function(){ 
          var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loading");
          loadingBar.anchor.setTo(0.5);
          game.load.setPreloadSprite(loadingBar);
          game.load.spritesheet("title", "assets/sprites/titlesheet750x515.png",750,515,3);
          game.load.spritesheet("scoretitle", "assets/sprites/scoresheet720x343.png",720,343,3);
          game.load.spritesheet("dancesheet", "assets/sprites/dancesheet340x340.png",340,340,30);
          game.load.spritesheet("appearsheet", "assets/sprites/appearsheet340x340.png",340,340,28);
          game.load.spritesheet("leftsheet", "assets/sprites/throwsheetleft340x500.png",340,500,12);
          game.load.spritesheet("rightsheet", "assets/sprites/throwsheetright340x500.png",340,500,8);
          game.load.image("howtoplay", "assets/sprites/howtoplay1157x687.png");
          game.load.image("wait", "assets/sprites/waiting340x340.png");
          game.load.image("target", "assets/sprites/target238x238.png");
          game.load.image("bullet", "assets/sprites/ball158x158.png");
          game.load.image("wait", "assets/sprites/waiting340x340.png");
          game.load.image("child", "assets/sprites/child135x135.png");
          game.load.image("playbutton", "assets/sprites/playbutton240x240.png"); 
          game.load.image("gobutton", "assets/sprites/gobutton240x240.png"); 
          game.load.image("againbutton", "assets/sprites/againbutton240x240.png"); 
          game.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
          game.load.audio("hit1", ["assets/sounds/hit.mp3", "assets/sounds/hit.ogg"]);
          game.load.audio("hit2", ["assets/sounds/hit_03.mp3", "assets/sounds/hit_03.ogg"]); 
          game.load.audio("bgmusic", ["assets/sounds/bgmusic.mp3", "assets/sounds/bgmusic.ogg"]);
     },
     create: function(){
          this.game.state.start("TitleScreen");
     }
}

var titleScreen = function(game){};
titleScreen.prototype = {  
     create: function(){  
          bgMusic = game.add.audio("bgmusic");
          bgMusic.loopFull(1); 
          hitSound1 = game.add.audio("hit1");
          hitSound2 = game.add.audio("hit2");
          savedData = localStorage.getItem(localStorageName)==null?
          {score:0}:JSON.parse(localStorage.getItem(localStorageName)); 
          var leftmove;
          var rightmove;
          leftsellect=false;
          rightsellect=false;
          game.stage.backgroundColor = 0xdfdfdf;
          var title = game.add.sprite(game.width / 2, game.height/2-100, "title");
          title.anchor.set(0.5);
          var shake = title.animations.add('shake');
          title.animations.play('shake',6,true);
          var child = game.add.image(game.width / 2-100,game.height-140 ,"child");
          child.anchor.set(0.5);
          game.add.bitmapText(game.width / 2+20, game.height-150 , "font", "X", 60).anchor.x = 0.5;
          game.add.bitmapText(game.width / 2+140, game.height-150 , "font", savedData.score.toString(), 60).anchor.x = 0.5;
          
          var player1wait=game.add.image(170,game.height-200,"wait");
          player1wait.anchor.set(0.5);
          var tweenleft=game.add.tween(player1wait).to({y:game.height-250},900,"Linear",true,0,-1);
          tweenleft.yoyo(true);
          var player2wait=game.add.image(game.width-170,game.height-200,"wait");
          player2wait.anchor.set(0.5);
          var tweenright=game.add.tween(player2wait).to({y:game.height-250},900,"Linear",true,0,-1);
          tweenright.yoyo(true);

          socket.on('player1join',function(joinornot){
               if (joinornot.connection==true&&connectOneCount<1){
                    connectOne=true
                    player1wait.destroy();
                    leftplayer= game.add.sprite(170,game.height-200,"appearsheet");
                    leftplayer.anchor.set(0.5);
                    var player1=leftplayer.animations.add('appear1');
                    leftplayer.animations.play('appear1',30,false);
                    console.log('connenct1')
                    connectOneCount++
               }else if(joinornot.connection==false){
                    console.log('we lost player1')
               }
          });

          socket.on('player2join',function(joinornot){
               if (joinornot.connection==true&&connectTwoCount<1){
                    connectTwo=true
                    player2wait.destroy();
                    rightplayer= game.add.sprite(game.width-170,game.height-200,"appearsheet");
                    rightplayer.anchor.set(0.5);
                    var player2=rightplayer.animations.add('appear2');
                    rightplayer.animations.play('appear2',30,false);
                    console.log('connenct2')
                    connectTwoCount++
               }else if(joinornot.connection==false){
                    console.log('we lost player2')
               }
          });
          leftplaybutton=game.add.button(150,250,'playbutton',this.leftsellect);
          leftplaybutton.anchor.set(0.5); 
          rightplaybutton=game.add.button(game.width-150,250,'playbutton',this.rightsellect);
          rightplaybutton.anchor.set(0.5);
     },
     leftsellect:function(){
          console.log('left player choose to play');
          leftplayer.destroy();
          leftmove= game.add.sprite(170,game.height-200,"dancesheet");
          leftmove.anchor.set(0.5);
          var sellect1=leftmove.animations.add('sellect1');
          leftmove.animations.play('sellect1',30,true);
          leftplaybutton.inputEnabled = false;
          leftsellect=true;
          hitSound1.play();
          if(rightsellect==true){
               game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                    game.state.start("HowToPlay");
                    
               }, this);          
          }
     },

     rightsellect:function(){
          rightplayer.destroy();
          rightmove= game.add.sprite(game.width-170,game.height-200,"dancesheet");
          rightmove.anchor.set(0.5);
          var sellect2=rightmove.animations.add('sellect2');
          rightmove.animations.play('sellect2',30,true);
          rightplaybutton.inputEnabled = false;
          rightsellect=true;
          hitSound2.play();
          if(leftsellect==true ){
               game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                    game.state.start("HowToPlay");
                    
               }, this);
                  
          }
     }

}

var howToPlay = function(game){};
howToPlay.prototype = {  
     create: function(){
          howlefttsellect=false;
          howrightsellect=false;
          var leftdis;
          var rightdis;

          game.stage.backgroundColor = 0x6e6e6e;

          var howtoplayBG = game.add.image(game.width/2, -270, "howtoplay");
          howtoplayBG.anchor.set(0.5,0.55);
          var BGdown=game.add.tween(howtoplayBG).to({y:game.height/2+30},1200,Phaser.Easing.Bounce.Out,true);

          leftplayer=game.add.sprite(170,game.height-200,'dancesheet');
          leftplayer.anchor.set(0.5)
          var player1=leftplayer.animations.add('shake1');
          leftplayer.animations.play('shake1',30,true);

          rightplayer=game.add.sprite(game.width-170,game.height-200,'dancesheet');
          rightplayer.anchor.set(0.5)
          var player2=rightplayer.animations.add('shake2');
          rightplayer.animations.play('shake2',30,true);

          leftreadybutton=game.add.button(150,250,'gobutton',this.leftready);
          leftreadybutton.anchor.set(0.5);

          rightreadybutton=game.add.button(game.width-150,250,'gobutton',this.rightready);
          rightreadybutton.anchor.set(0.5);

     },
     leftready: function(){
     	var buttonleft=game.add.tween(leftreadybutton).to({width:200,height:200},500,"Linear",true,0,-1);
          buttonleft.yoyo(true);
          leftreadybutton.inputEnabled = false;
          howleftsellect=true;
          hitSound1.play();
          if(howrightsellect==true){
               game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                    game.state.start("PlayGame"); 
                    // bgMusic.stop();  
               }, this);
          }
     },
     rightready: function(){
     	var buttonright=game.add.tween(rightreadybutton).to({width:200,height:200},500,"Linear",true,0,-1);
          buttonright.yoyo(true);
          rightreadybutton.inputEnabled = false;
          howrightsellect=true;
          hitSound2.play();
          if(howleftsellect==true){
               game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                    game.state.start("PlayGame");
                    // bgMusic.stop();   
               }, this);
          }

     }
}

var playGame = function(game){};
playGame.prototype = { 
     create: function(){
          bgMusic.mute = true;
          score=0;
          savedData = localStorage.getItem(localStorageName)==null?
          {score:0}:JSON.parse(localStorage.getItem(localStorageName));

          game.physics.startSystem(Phaser.Physics.ARCADE);
          game.stage.backgroundColor = 0xdfdfdf;

          var child = game.add.image(game.width / 2-100,game.height-140 ,"child");
          child.anchor.set(0.5);
          game.add.bitmapText(game.width / 2+20, game.height-150 , "font", "X", 60).anchor.x = 0.5;
          scoretext=game.add.bitmapText(game.width / 2+140, game.height-150 ,"font",  '', 60);

          target = game.add.sprite(game.width/2, game.height/2-90,"target");
          target.anchor.set(0.5);

          timer=game.time.create();
          timerEvent = timer.add( Phaser.Timer.SECOND * 30, this.endTimer, this);
          timer.start();
          ticktoc=game.add.bitmapText(game.width / 2, -50 , "font", '', 80);
          ticktoc.anchor.set(0.5);
          var tickdown=game.add.tween(ticktoc).to({y:100},1200,Phaser.Easing.Bounce.Out,true);

          signalgroup1 =game.add.group();
          signalgroup1.enableBody=true;
          signalgroup1.physicsBodyType=Phaser.Physics.ARCADE;
          for(var i=0; i<50; i++){
               var a=signalgroup1.create(0,0,'bullet');
               a.anchor.set(0.5);
               a.name='wave'+i;
               a.exists=false;
               a.visible=false;
               a.checkWorldBounds=true;
               a.events.onOutOfBounds.add(resetWave1,this);
          }
          signalgroup2 =game.add.group();
          signalgroup2.enableBody=true;
          signalgroup2.physicsBodyType=Phaser.Physics.ARCADE;
          for(var i=0; i<50; i++){
               var b=signalgroup2.create(0,0,'bullet');
               b.anchor.set(0.5);
               b.name='wave'+i;
               b.exists=false;
               b.visible=false;
               b.checkWorldBounds=true;
               b.events.onOutOfBounds.add(resetWave2,this);
          }

               game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT]);
               this.leftplayer=game.add.sprite(170,game.height-280,'leftsheet');
               this.leftplayer.anchor.set(0.5);
               var stayani1=this.leftplayer.animations.add('stay1',[0],6,false);
               var leftani=this.leftplayer.animations.add('left',[0,1,2,3,4,5,6,7,8,9,10,11],24,false);

               game.input.keyboard.addKeyCapture([Phaser.Keyboard.RIGHT]);
               this.rightplayer=game.add.sprite(game.width-170,game.height-280,'rightsheet');
               this.rightplayer.anchor.set(0.5);
               var stayaniplayer2=this.rightplayer.animations.add('stay2',[0],6,false);
               var rightani=this.rightplayer.animations.add('right',[0,1,2,3,4,5,6,7,8,9,10,11],24,false);


          socket.on('player1shake',function(shakedata1){
               if (shakedata1.value>1){
                    leftmovement=true
                    console.log('left'+shakedata1.value)
               }else {
                    leftmovement=false
                    console.log('left'+shakedata1.value)
               }
          });
          socket.on('player2shake',function(shakedata2){
               if (shakedata2.value>1){
                    rightmovement=true
                    
                    console.log('right'+shakedata2.value)
               }else {
                    rightmovement=false
                    console.log('right'+shakedata2.value)
               }
          });

     },
     update: function(){
          game.physics.arcade.overlap(signalgroup1,signalgroup2,collisionHandler,null,this)

          if(leftcollidepos+49>target.position.x-72&& leftcollidepos+49<target.position.x+72){
               score=score+1;
               target.reset(game.rnd.between(500,game.width-500),game.height/2-90);
               hitSound2.play();
          }
          
          if(leftmovement==true){
               fireWave1();
               this.leftplayer.animations.play('left'); 
          }

          if(rightmovement==true){
               fireWave2();
               this.rightplayer.animations.play('right');
          }

          if(timer.running){
               ticktoc.setText(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)));
          }else{

               ticktoc.setText('FIN');
               game.time.events.add(Phaser.Timer.SECOND * 2, function(){
                    game.state.start("GameOverScreen");
               }, this);
          }
          scoretext.setText(score.toString())
         
     },
     endTimer:function(){
          timer.stop();
     },
     formatTime:function(s){
          var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);  

     }
}

function fireWave1(){ 
          if(game.time.now>waveTime1){
          wave1=signalgroup1.getFirstExists(false);
          if(wave1){
               wave1.anchor.x=0.5;
               wave1.anchor.y=0.5;
               wave1.reset(100,game.height/2-90);
               wave1.body.velocity.x=300;
               waveTime1=game.time.now+350;
               }
          }
     }

function fireWave2(){
          if(game.time.now>waveTime2){
          wave2=signalgroup2.getFirstExists(false);
          if(wave2){
               wave2.anchor.x=0.5;
               wave2.anchor.y=0.5;
               wave2.reset(game.width-100,game.height/2-90);
               wave2.body.velocity.x=-300;
               waveTime2=game.time.now+350;
               }
          }
     }

function resetWave1(signalgroup1){
     signalgroup1.kill();
}

function resetWave2(signalgroup2){
     signalgroup2.kill();
}
function collisionHandler(signalgroup1,signalgroup2){
     leftcollidepos=signalgroup1.position.x;
     rightcollidepos=signalgroup2.position.x;
     signalgroup1.kill();
     signalgroup2.kill();
}

var gameOverScreen = function(game){};
gameOverScreen.prototype = {
     create:function(){
          bgMusic.mute = false;
          leftagainsellect=false;
          rightagainsellect=false;
          var bestScore = Math.max(score, savedData.score);

          var scoretitle = game.add.sprite(game.width / 2, game.height/2-150, "scoretitle");
          scoretitle.anchor.set(0.5);
          var shake = scoretitle.animations.add('shake');
          scoretitle.animations.play('shake',6,true);

          leftplayer=game.add.sprite(170,game.height-200,'dancesheet');
          leftplayer.anchor.set(0.5)
          var player1=leftplayer.animations.add('shake1');
          leftplayer.animations.play('shake1',24,true);

          rightplayer=game.add.sprite(game.width-170,game.height-200,'dancesheet');
          rightplayer.anchor.set(0.5)
          var player2=rightplayer.animations.add('shake2');
          rightplayer.animations.play('shake2',24,true);

          leftretrybutton=game.add.button(150,250,'againbutton',this.leftready);
          leftretrybutton.anchor.set(0.5);

          rightretrybutton=game.add.button(game.width-150,250,'againbutton',this.rightready);
          rightretrybutton.anchor.set(0.5);

          var child = game.add.image(game.width / 2-100,game.height+100 ,"child");
          child.anchor.set(0.5);
          scoretext=game.add.bitmapText(game.width / 2+10, game.height/2+100 ,"font",  '', 100);
          scoretext.anchor.set(0.5);
          game.add.bitmapText(game.width / 2-80, game.height-140 , "font", "best", 40);
          game.add.bitmapText(game.width / 2+80, game.height-140, "font", savedData.score.toString(), 40).anchor.x = 0.5;

          localStorage.setItem(localStorageName,JSON.stringify({
          score: bestScore
          }));
     },
     leftready: function(){
          leftagainsellect=true;
          var returnleft=game.add.tween(leftretrybutton).to({width:200,height:200},500,"Linear",true,0,-1);
          returnleft.yoyo(true);
          leftretrybutton.inputEnabled = false;
          hitSound1.play();
          if(rightagainsellect==true){
               game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                    game.state.start("PlayGame");   
               }, this);
          }


     },
     rightready: function(){
          rightagainsellect=true;
          var returnright=game.add.tween(rightretrybutton).to({width:200,height:200},500,"Linear",true,0,-1);
          returnright.yoyo(true);          
          rightretrybutton.inputEnabled = false;
          hitSound2.play();
          if(leftagainsellect==true){
               game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                    game.state.start("PlayGame");   
               }, this);
          }

     },

     update: function(){
          scoretext.setText(score.toString())
     }

}