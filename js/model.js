//Phaser.Game object        
var game = new Phaser.Game(1600, 600, Phaser.AUTO);
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
        't', 'u', 'v', 'w', 'x', 'y', 'z'];

var backgroundImg ;    
var hm ;                // Hangman part list
var dead ;              // Hangman full image

//controller
var bgm ;               // Background music 
var flip ;              // Hangman rotate speed 
var music ;             // Game sound 
var movespeed ;         // Welcome title speed 
var heartBeat ;         // Heart Beat speed 

//API data
var game_id ;           // Game_Key
var lives ;             // Lives left
var state ;             // Game state
var phrases ;           // Guess Phrases
var userName ;          // User email/userName

var GameState = function(){
};

GameState.prototype = {
  preload: function() {
    //load image
      this.load.image('background','asset/img/background.png');
      this.load.image('button','asset/img/button.png');
      this.load.image('heart','asset/img/heart.png');
      this.load.image('hmfull','asset/img/hmfull.png');
      this.load.image('hm0','asset/img/hm1.png');
      this.load.image('hm1','asset/img/hm2.png');
      this.load.image('hm2','asset/img/hm3.png');
      this.load.image('hm3','asset/img/hm4.png');
      this.load.image('hm4','asset/img/hm5.png');
      this.load.image('music','asset/img/music.png');
    //load music
      this.load.audio('bgm','asset/music/bgm.mp3');
      this.load.audio('pencil','asset/music/pencil.wav');
      this.load.audio('win','asset/music/win.wav');
      this.load.audio('lost','asset/music/lost.wav');

  },
  create: function() {
    //Init values
      backgroundImg = this.game.add.sprite(0,0,'background');
      backgroundImg.width = this.game.width;
      backgroundImg.height= this.game.height;
      this.background = backgroundImg;

      music = this.game.add.button(10,10,'music',muteMusic,this,2,1,0);
      music.width = 70;
      music.height = 50;

      bgm = game.add.audio('bgm',1,true);
      bgm.play('',0,1,true);
      bgm.loop = true;

      dead = game.add.sprite(820,100,'hmfull');

      heartBeat = 1;
      flip = 1;
      movespeed = 4;
      lives = [];
      hm = [];
      drawhm();

  },
  
  update: function() {
  //Animation
    //Welcome title
    if(userName!=null) {
      userName.position.x +=movespeed;
      if(userName.position.x>game.width-100) {
        movespeed = -movespeed;
      }
      if(userName.position.x<200) {
        movespeed = 0;
      }
    }

    //Heart beat
    if(heartBeat <= 1) {
        heartBeat = 1.5;
    } else {
      heartBeat -=0.01;
    }
    for(var i = 0; i<lives.length;i++) {
      lives[i].anchor.setTo(heartBeat*0.1,heartBeat*0.1);
      lives[i].scale.setTo(heartBeat*0.1,heartBeat*0.1);
    }

    //Hangman
    if(dead!=null) {
      dead.anchor.setTo(0.5,0);
      if(dead.angle>35||dead.angle<-35) flip = -flip;
      dead.angle += (flip*(1-(dead.angle/36)*(dead.angle/36)));
    }

  }
};

game.state.add('GameState',GameState);
game.state.start('GameState');

  
/*
* Function :drawHeart(life) called everytime update UI 
* Input: life: Lives number left 
* Result: Update heart numbers on the screen, check for game lose
*/
function drawHeart($life,$states,$word) {
  if($life == -1) {
    lose();
  } else if ($states=="won") {
    win($word);
  } else if ($life<lives.length) {
    lives[$life].kill();
    lives = lives.slice(0,$life);
    showhm();
  } else if($life > lives.length) { 
    //new game
    for(i = 0; i<$life;i++) {
      lives[i]= game.add.sprite(100+i*40,80,'heart');
      lives[i].width = 30;
      lives[i].height = 30;
    }
  }
}


/*
* Function :drawhm() called only when init the view 
* Input: None
* Result: Draw hangman by part. 
*/
function drawhm() {
  hm[0] = game.add.sprite(820,100,'hm0');
  hm[1] = game.add.sprite(770,150,'hm1');
  hm[2] = game.add.sprite(800,220,'hm2');
  hm[3] = game.add.sprite(750,270,'hm3');
  hm[4] = game.add.sprite(830,260,'hm4');
  hidehm();
}


/*
* Function :hidehm() called when start new game
* Input: None
* Result: Hide each part of the hangman 
*/
function hidehm() {
  for(i = 0; i<hm.length;i++) {
    hm[i].visible = false;
  } 
}


/*
* Function :showhm() called when guess wrong 
* Input: None
* Result: Draw hangman by part.
*/
function showhm() {
  pencil = game.add.audio('pencil',1,true);
  pencil.loop = false;
  pencil.play();
  i = 0;
  while(hm[i].visible) i++;
  hm[i].visible = true;
}


/*
* Function :lose() called when game lose 
* Input: None
* Result: stop background music and restart the game
*/
function lose() {
  dead.visible = true;
  lost = game.add.audio('lost',1,true);
  lost.loop = false;
  lost.play();
  bgm.stop();
  phrases.visible = false;
  jConfirm('Try one more time!', 'Sorry, you lost', function(r) {
    if(r){
      uploadEmail();
    } 
  });
  hidehm();
}


/*
* Function :win() called when game win 
* Input: word : Target phrases
* Result: restart game.
*/
function win ($word) {
  alert("win");
  winMusic = game.add.audio('win',1,true);
  winMusic.loop = false;
  winMusic.play();
  bgm.stop();
  phrases.visible = false;
  jConfirm("The phrase is : " + $word, "Yeah! You win!", function(r) {
    if(r){
      uploadEmail();
    } 
  });
  hidehm();
}


/*
* Function :muteMusic() called change sound setting 
* Input: None
* Result: swtich game sound setting.
*/
function muteMusic() {
  game.sound.mute = !game.sound.mute;
}


/*
* Function :update() called when press new game button 
* Input: None
* Result: start game or alert error input.
*/
function uploadEmail() {
  var email = document.getElementById("userEmail").value;
  if(email==""||email=="Enter here") {
    jAlert("You need to have a valid user name", "Hangman");
    //alert("You need to have a valid user name before start the game");
  } else {
    newHangMan(email);
  }
}


/*
* Function :newHangMan(test) called to start new game
* Input: test :string of user name
* Result: post at server with user name.
*/
function newHangMan ($test){
    //Init game variables
    bgm.play();
    dead.angle = 0;
    dead.visible = false;
    for(i = 0; i<lives.length;i++) lives[i].kill();
    lives= [];
    hidehm();
    var style = { font: "42px Tangerine", fill: "#242a2c", wordWrap: true, wordWrapWidth: game.width, align: "center" };
    if(userName==null) {
      userName  = game.add.text(200, 45, "", style);
    }
    style = { font: "44px \"Indie Flower\"", fill: "#FF0066", wordWrap: true, wordWrapWidth: game.width, align: "center" };
    if(phrases==null) {
      phrases=game.add.text(80, 150, "", style);
    }
    userName.text  = "Hello! "+ $test;
    phrases.text = "";
    userName.anchor.set(0.5);
    userName.visible = false;
    phrases.visible = true;
    buttons();

    //jQuery Post
    $.post('http://hangman.coursera.org/hangman/game', JSON.stringify({email:$test}), function(data) {
      updateData(data);
    }, "json" ).fail( function(jqXHR, textStatus, errorThrown) {
      jAlert("Message : " + textStatus + " " + errorThrown,"Error");
    });
}

/*
* Function :updagteHangMan(key) called to update game
* Input: key : char of user guessed key
* Result: post at server with game id and user gussed key.
*/
function updateHangMan ($key) {
  //disable pressed key
    document.getElementById('letter'+ $key).disabled = true;
  //JQuery Post
    $.post('http://hangman.coursera.org/hangman/game/'+ game_id, JSON.stringify({guess:$key}), function(data) {
      updateData(data);
    }, "json" ).fail( function(jqXHR, textStatus, errorThrown) {
      jAlert("Message : " + textStatus + " " + errorThrown,"Error");
    });
}
/*
* Function :updagteData(data) called when update game UI
* Input: data : data from server callback
* Result: Update UI conponents.
*/
function updateData(data) {
  game_id = data.game_key;
  tempharse = data.phrase;
  drawHeart(data.num_tries_left,data.state,tempharse);
  phrases.text = tempharse;
  userName.font = "Tangerine";
  userName.visible = true;
}

/*
* Function :buttons() called to draw keyboard
* Input: None
* Result: Add alphabet keyboard to html
*/
function buttons() {
    myButtons = document.getElementById('buttons');
    myButtons.innerHTML = "";
    letters = document.createElement('ul');
    letters.id = 'alphabet';
    for (var i = 0; i < alphabet.length; i++) {
      list = document.createElement('button');
      list.className += "myButtons";
      list.id = 'letter'+alphabet[i];
      list.innerHTML =alphabet[i];
      list.onclick = function (arg) {
        return function(){
                  updateHangMan(alphabet[arg]);
                }
      }(i);
      myButtons.appendChild(letters);
      letters.appendChild(list);
    }
}
    
/*
* Function :enableKeyboard called when start the gmae
* Input: None
* Result: Link alphabet keyboard with onclick funtion.
*/
// function enableKeyboard (){
//    $('body').keypress(function(event){
//     if(event.keyCode == 65){
//         updateHangMan('a');
//     }
// });