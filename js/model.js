var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
        't', 'u', 'v', 'w', 'x', 'y', 'z'];
var game_id ;           // Game_Key
  // Get elements


var game = new Phaser.Game(1600, 600, Phaser.AUTO);
var button;
var backgroundImg;
var userName;
var bgm;
var movespeed = 4;
var lives;
var heart;
var phrases;
var state;
var heartBeat;
var hm;
var dead;
var flip;
var GameState = function(){
};


GameState.prototype = {
  preload: function(){
      this.load.image('background','../asset/img/background.jpg');
      this.load.image('button','../asset/img/button.png');
      this.load.audio('bgm','../asset/music/bgm.mp3');
      this.load.image('heart','../asset/img/heart.png');
      this.load.image('hmfull','../asset/img/hmfull.png');
      this.load.image('hm0','../asset/img/hm1.png');
      this.load.image('hm1','../asset/img/hm2.png');
      this.load.image('hm2','../asset/img/hm3.png');
      this.load.image('hm3','../asset/img/hm4.png');
      this.load.image('hm4','../asset/img/hm5.png');
      this.load.audio('pencil','../asset/music/pencil.wav');
      this.load.audio('win','../asset/music/win.wav');
      this.load.audio('lost','../asset/music/lost.wav');
  },
  create: function(){
      backgroundImg = this.game.add.sprite(0,0,'background');
      //buttonImg = this.game.add.sprite(0,0,'button')
      backgroundImg.width = this.game.width;
      backgroundImg.height= this.game.height;
      this.background = backgroundImg;
      bgm = game.add.audio('bgm',1,true);
      bgm.play('',0,1,true);
      bgm.loop = true;
      heartBeat = 1;
      flip = 1;
      lives = [];
      hm = [];
      drawhm();
      dead = game.add.sprite(670,100,'hmfull');
  },
  update: function(){
    //userName.position.x +=5;
    if(userName!=null){
      userName.position.x +=movespeed;
      if(userName.position.x>game.width-50||userName.position.x<50){
        movespeed = -movespeed;
      }
    }

    if(heartBeat <= 1){
        heartBeat = 1.5;
    } else {
      heartBeat -=0.01;
    }
    for(var i = 0; i<lives.length;i++){
      lives[i].anchor.setTo(heartBeat*0.1,heartBeat*0.1);
      lives[i].scale.setTo(heartBeat*0.1,heartBeat*0.1);
    }
    if(dead!=null){
      dead.anchor.setTo(0.5,0);
      if(dead.angle>35||dead.angle<-35) flip = -flip;
      dead.angle += flip;
    }

  }
};

game.state.add('GameState',GameState);
game.state.start('GameState');

  
function drawHeart(life){
  if(life == -1) {
    lose();
  } else if(life<lives.length) {
    lives[life].kill();
    lives = lives.slice(0,life);
    showhm();
  } else if(life > lives.length) { 
    for(i = 0; i<life;i++){
      lives[i]= game.add.sprite(100+i*40,80,'heart');
      lives[i].width = 30;
      lives[i].height = 30;
    }
  }

}

function drawhm(){
  hm[0] = game.add.sprite(670,100,'hm0');
  hm[1] = game.add.sprite(620,150,'hm1');
  hm[2] = game.add.sprite(650,220,'hm2');
  hm[3] = game.add.sprite(600,270,'hm3');
  hm[4] = game.add.sprite(680,260,'hm4');
  hidehm();
}

function hidehm(){
  for(i = 0; i<hm.length;i++) hm[i].visible = false;
}

function showhm(){
  pencil = game.add.audio('pencil',1,true);
  pencil.loop = false;
  pencil.play();
  i = 0;
  while(hm[i].visible) i++;
  hm[i].visible = true;f
}

function lose(){
  lost = game.add.audio('lost',1,true);
  lost.loop = false;
  lost.play();
  bgm.stop();
  phrases.visible = false;
  alert("You Lose  the Game!");
  
  hidehm();
  dead.visible = true;
  //uploadEmail();
}

function win(word){
  win = game.add.audio('win',1,true);
  win.loop = false;
  win.pause();
  phrases.visible = false;
  alert("You Win! The phrase is "+ word);
  
  uploadEmail();
}

function uploadEmail(){
  var email = document.getElementById("userEmail").value;
  if(email==""||email=="Enter here"){
    alert("You need to have a valid user name before start the game");
  } else {
    newHangMan(email);
  }
}


function newHangMan ($test){
    bgm.play();
    dead.visible = false;
    lives= [];
    hidehm();
    $.post('http://hangman.coursera.org/hangman/game', JSON.stringify({email:$test}), function(data) {
      updateData(data);
    }, "json" ).fail( function(jqXHR, textStatus, errorThrown) {
      alert(textStatus + errorThrown+" here");
    });
    var style = { font: "32px serif", fill: "#ff0044", wordWrap: true, wordWrapWidth: game.width, align: "center" };
    if(userName==null){
      userName  = game.add.text(100, 20, "Hello! "+ $test, style);
    }
    if(phrases==null){
      phrases=game.add.text(100, 150, "", style);
    }

    userName.text  = "Hello! "+ $test;
    phrases.text = "";
    userName.anchor.set(0.5);
    phrases.visible = true;
    buttons();
}

function updateHangMan ($key){
    document.getElementById('letter'+$key).disabled = true;
    $.post('http://hangman.coursera.org/hangman/game/'+ game_id, JSON.stringify({guess:$key}), function(data) {
      updateData(data);
    }, "json" ).fail( function(jqXHR, textStatus, errorThrown) {
      alert(textStatus + errorThrown+" here");
    });
}

function updateData(data){
  game_id = data.game_key;
  drawHeart(data.num_tries_left);
  //lives.text = "Heart : "+ data.num_tries_left;
  phrases.text = data.phrase;
  if(data.state == "won") win(data.phrase);
}

//<a href="#" class="myButton">green</a>
  // create alphabet ul
function buttons() {
    myButtons = document.getElementById('buttons');
    myButtons.innerHTML = "";
    letters = document.createElement('ul');
    letters.id = 'alphabet';
    for (var i = 0; i < alphabet.length; i++) {
      list = document.createElement('button');
      list.className += "myButtons";
      //list.addClass('myButtons')
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
    
  
//   // Select Catagory
//   var selectCat = function () {
//     if (chosenCategory === categories[0]) {
//       catagoryName.innerHTML = "The Chosen Category Is Premier League Football Teams";
//     } else if (chosenCategory === categories[1]) {
//       catagoryName.innerHTML = "The Chosen Category Is Films";
//     } else if (chosenCategory === categories[2]) {
//       catagoryName.innerHTML = "The Chosen Category Is Cities";
//     }
//   }

//   // Create geusses ul
//    result = function () {
//     wordHolder = document.getElementById('hold');
//     correct = document.createElement('ul');

//     for (var i = 0; i < word.length; i++) {
//       correct.setAttribute('id', 'my-word');
//       guess = document.createElement('li');
//       guess.setAttribute('class', 'guess');
//       if (word[i] === "-") {
//         guess.innerHTML = "-";
//         space = 1;
//       } else {
//         guess.innerHTML = "_";
//       }

//       geusses.push(guess);
//       wordHolder.appendChild(correct);
//       correct.appendChild(guess);
//     }
//   }
  
//   // Show lives
//    comments = function () {
//     showLives.innerHTML = "You have " + lives + " lives";
//     if (lives < 1) {
//       showLives.innerHTML = "Game Over";
//     }
//     for (var i = 0; i < geusses.length; i++) {
//       if (counter + space === geusses.length) {
//         showLives.innerHTML = "You Win!";
//       }
//     }
//   }

//       // Animate man
//   var animate = function () {
//     var drawMe = lives ;
//     drawArray[drawMe]();
//   }

  
//    // Hangman
//   canvas =  function(){

//     myStickman = document.getElementById("stickman");
//     context = myStickman.getContext('2d');
//     context.beginPath();
//     context.strokeStyle = "#fff";
//     context.lineWidth = 2;
//   };
  
//     head = function(){
//       myStickman = document.getElementById("stickman");
//       context = myStickman.getContext('2d');
//       context.beginPath();
//       context.arc(60, 25, 10, 0, Math.PI*2, true);
//       context.stroke();
//     }
    
//   draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
    
//     context.moveTo($pathFromx, $pathFromy);
//     context.lineTo($pathTox, $pathToy);
//     context.stroke(); 
// }

//    frame1 = function() {
//      draw (0, 150, 150, 150);
//    };
   
//    frame2 = function() {
//      draw (10, 0, 10, 600);
//    };
  
//    frame3 = function() {
//      draw (0, 5, 70, 5);
//    };
  
//    frame4 = function() {
//      draw (60, 5, 60, 15);
//    };
  
//    torso = function() {
//      draw (60, 36, 60, 70);
//    };
  
//    rightArm = function() {
//      draw (60, 46, 100, 50);
//    };
  
//    leftArm = function() {
//      draw (60, 46, 20, 50);
//    };
  
//    rightLeg = function() {
//      draw (60, 70, 100, 100);
//    };
  
//    leftLeg = function() {
//      draw (60, 70, 20, 100);
//    };
  
//   drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1]; 


  // //OnClick Function
  //  check = function () {
  //   list.onclick = function () {
  //      var geuss = (this.innerHTML);
  //      this.setAttribute("class", "active");
  //      this.onclick = null;
  //      for (var i = 0; i < alphabet.length; i++) {
  //        if (word[i] === geuss) {
  //         geusses[i].innerHTML = geuss;
  //         counter += 1;
  //       } 
  //     }
  //     // var j = (word.indexOf(geuss));
  //     // if (j === -1) {
  //     //   lives -= 1;
  //     //   comments();
  //     //   animate();
  //     // } else {
  //     //   comments();
  //     // }
  //   }
  // }
  
    
//   // Play
//   play = function () {
//     categories = [
//         ["everton", "liverpool", "swansea", "chelsea", "hull", "manchester-city", "newcastle-united"],
//         ["alien", "dirty-harry", "gladiator", "finding-nemo", "jaws"],
//         ["manchester", "milan", "madrid", "amsterdam", "prague"]
//     ];

//     chosenCategory = categories[Math.floor(Math.random() * categories.length)];
//     word = chosenCategory[Math.floor(Math.random() * chosenCategory.length)];
//     word = word.replace(/\s/g, "-");
//     console.log(word);
//     buttons();

//     geusses = [ ];
//     lives = 10;
//     counter = 0;
//     space = 0;
//     result();
//     comments();
//     selectCat();
//     canvas();
//   }

//   play();
  
//   // Hint

//     hint.onclick = function() {

//       hints = [
//         ["Based in Mersyside", "Based in Mersyside", "First Welsh team to reach the Premier Leauge", "Owned by A russian Billionaire", "Once managed by Phil Brown", "2013 FA Cup runners up", "Gazza's first club"],
//         ["Science-Fiction horror film", "1971 American action film", "Historical drama", "Anamated Fish", "Giant great white shark"],
//         ["Northern city in the UK", "Home of AC and Inter", "Spanish capital", "Netherlands capital", "Czech Republic capital"]
//     ];

//     var catagoryIndex = categories.indexOf(chosenCategory);
//     var hintIndex = chosenCategory.indexOf(word);
//     showClue.innerHTML = "Clue: - " +  hints [catagoryIndex][hintIndex];
//   };

//    // Reset

//   document.getElementById('reset').onclick = function() {
//     correct.parentNode.removeChild(correct);
//     letters.parentNode.removeChild(letters);
//     showClue.innerHTML = "";
//     context.clearRect(0, 0, 400, 400);
//     play();
//   }
// }



