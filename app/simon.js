// SIMON SOUNDS -----------------------------------------------------------------------------------------------------------------
// create sounds ----------------------------------------------
var soundOne = document.createElement('audio');
var soundTwo = document.createElement('audio');
var soundThree = document.createElement('audio');
var soundFour = document.createElement('audio');

// assign sound attributes ------------------------------------
if (soundOne.canPlayType('audio/mpeg')) {
  soundOne.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3?raw=1');
}
if (soundTwo.canPlayType('audio/mpeg')) {
  soundTwo.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3?raw=1');
}
if (soundThree.canPlayType('audio/mpeg')) {
  soundThree.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3?raw=1');
}
if (soundFour.canPlayType('audio/mpeg')) {
  soundFour.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3?raw=1');
}

// load simon sounds -------------------------------------------  
soundOne.load();
soundTwo.load();
soundThree.load();
soundFour.load();

// array of choices -------------------------------------------
var choices = [{
  color: 'green',
  sound: soundOne
}, {
  color: 'red',
  sound: soundTwo
}, {
  color: 'blue',
  sound: soundThree
}, {
  color: 'yellow',
  sound: soundFour
}];

// GAME OBJECT -------------------------------------------------------------------------------------------------------------------
var Simon = function(roundCount, random, selection, sequence, playerChoice, playerSequence, playSoundSequence, strict, speed, EMH, newRound) {
  this.roundCount = 0;
  this.random = undefined;
  this.selection = undefined;
  this.sequence = [];
  this.playerChoice = undefined;
  this.playerSequence = undefined;
  this.strict = false;
  this.speed = 1000;
  this.EMH = undefined;

  // play sound sequence method --------------------------------
  this.playSoundSequence = function() {
    if (this.roundCount < 6) {
      this.speed = 1000;
    }
    if (this.roundCount > 5 && this.roundCount < 12) {
      this.speed = 800;
    }
    if (this.roundCount > 11 && this.roundCount < 19) {
      this.speed = 600;
    }
    if (this.roundCount > 18) {
      this.speed = 400;
    }
    // timeout play sequence-------------------------------------
    var delaySpeed = this.speed;
    $.each(this.sequence, function(i, sound) {
      setTimeout(function() {
        sound.sound.play();

        function backToOrg() {
          $('#green').css('opacity', 0.5).addClass('innerShadow');
          $('#red').css('opacity', 0.5).addClass('innerShadow');
          $('#blue').css('opacity', 0.5).addClass('innerShadow');
          $('#yellow').css('opacity', 0.5).addClass('innerShadow');
        }
        // sequence color changes --------------------------------
        if (sound.color === 'green') {
          $('#green').css('opacity', 1).removeClass('innerShadow');
          window.setTimeout(backToOrg, delaySpeed / 5);
        }
        if (sound.color === 'red') {
          $('#red').css('opacity', 1).removeClass('innerShadow');
          window.setTimeout(backToOrg, delaySpeed / 5);
        }
        if (sound.color === 'blue') {
          $('#blue').css('opacity', 1).removeClass('innerShadow');
          window.setTimeout(backToOrg, delaySpeed / 5);
        }
        if (sound.color === 'yellow') {
          $('#yellow').css('opacity', 1).removeClass('innerShadow');
          window.setTimeout(backToOrg, delaySpeed / 5);
        }
      }, i * delaySpeed)
    })
    window.setTimeout($('#green, #red, #blue, #yellow').removeClass('disabled'), delaySpeed / 5);
  };

  // setTimeout for soundDelay --------------------------------
  this.delaySound = function() {
    window.setTimeout(this.playSoundSequence.bind(this), 1800);
  };

  // setTimeout for  roundCount refresh -----------------------
  this.resetRound = function() {
    $('#round').html(this.roundCount);
  };

  this.roundReset = function() {
    window.setTimeout(this.resetRound.bind(this), 2500);
  }

  // new round method ------------------------------------------
  this.newRound = function() {
    this.roundCount += 1;
    this.random = Math.floor(Math.random() * (4 + 0)) - 0;
    this.selection = choices[this.random];
    this.sequence.push(this.selection);
    this.playerSequence = [];
    $('#round').html(this.roundCount);
    //console logs
    this.delaySound();
    console.log('roundCount', this.roundCount);
    console.log('random', this.random);
    console.log('selection', this.selection);
    console.log('sequence', this.sequence);
    console.log('player sequence', this.playerSequence);
  };

  // compare sequence/playerSequence ---------------------------
  this.compare = function() {
    var indexToCompare;
    // back to original/lights off -------------------------
    function backToOrg() {
      $('#green').css('opacity', 0.5).addClass('innerShadow');
      $('#red').css('opacity', 0.5).addClass('innerShadow');
      $('#blue').css('opacity', 0.5).addClass('innerShadow');
      $('#yellow').css('opacity', 0.5).addClass('innerShadow');
    };

    // winning sequence -------------------------------------
    function win() {
      $('#round').html('WIN');
      currentGame = new Simon();
      $('#green, #red, #blue, #yellow').css('opacity', 1).removeClass('innerShadow');
      window.setTimeout(backToOrg, 200);
      window.setTimeout(function() {
        $('#green, #red, #blue, #yellow').css('opacity', 1).removeClass('innerShadow');
      }, 300);
      window.setTimeout(backToOrg, 400);
      window.setTimeout(function() {
        $('#green, #red, #blue, #yellow').css('opacity', 1).removeClass('innerShadow');
      }, 500);
      window.setTimeout(backToOrg, 600);
      window.setTimeout(this.newRound.bind(this), 2500);
    }

    indexToCompare = currentGame.playerSequence.indexOf(this.playerChoice);
    if (currentGame.playerSequence[indexToCompare] !== currentGame.sequence[indexToCompare]) {
      $('#green, #red, #blue, #yellow').addClass('disabled');
      if (this.strict !== true) {
        this.playerChoice = undefined;
        this.playerSequence = [];
        $('#round').html('--');
        this.roundReset();
        this.delaySound();
      } else {
        $('#round').html('--');
        this.roundCount = 0;
        this.random = undefined;
        this.selection = undefined;
        this.sequence = [];
        this.playerChoice = undefined;
        this.playerSequence = undefined;
        this.roundReset();
        window.setTimeout(this.newRound.bind(this), 2500);
      }
      // EMH -------------------------------
      if ($('#slideE').hasClass('selected')) {
        this.EMH = 'easy';
      } else if ($('#slideM').hasClass('selected')) {
        this.EMH = 'med';
      } else if ($('#slideH').hasClass('selected')) {
        this.EMH = 'hard';
      }

    } else {
      if (this.playerSequence.length === this.sequence.length) {
        $('#green, #red, #blue, #yellow').addClass('disabled');
        if (this.sequence.length === 6) {
          $('#round').html(' * ');
          $('#green, #red, #blue, #yellow').css('opacity', 1).removeClass('innerShadow');
          window.setTimeout(backToOrg, 200);
          window.setTimeout(this.newRound.bind(this), 2500);
        } else if (this.sequence.length === 11) {
          // Easy win ---------------------------
          if (this.EMH === 'easy') {
            win();
          } else {
            $('#round').html(' ** ');
            $('#green, #red, #blue, #yellow').css('opacity', 1).removeClass('innerShadow');
            window.setTimeout(backToOrg, 200);
            window.setTimeout(this.newRound.bind(this), 2500);
          }
        } else if (this.sequence.length === 20) {
          if (this.EMH === 'med') {
            win();
          } else {
            $('#round').html('***');
            $('#green, #red, #blue, #yellow').css('opacity', 1).removeClass('innerShadow');
            window.setTimeout(backToOrg, 200);
            window.setTimeout(this.newRound.bind(this), 2500);
          }
        } else if (this.sequence.length === 32) {
          win();
        } else {
          this.newRound();
        }
      }
    }
  };
};

// QUEREY EVENTS -----------------------------------------------------------------------------------------------------------------
$(document).ready(function() {

  $('#playSimon').click(function() {
    $('#tutorial').addClass('hidden');
    $('main').removeClass('hidden');
  })
  $('#inst').click(function() {
    $('main').addClass('hidden');
    $('#tutorial').removeClass('hidden');
  })

  // on and off switch -----------------------------------------
  // turn on -------------------------------------------
  $('#slideOff').click(function() {
      soundOne.load();
      soundTwo.load();
      soundThree.load();
      soundFour.load();
      $('#slideOff').css('background-color', 'black');
      $('#slideOn').css('background-color', 'blue');
      $('#round').html('00');
      $('#startBtn, #strictBtn').removeClass('disabled');
      currentGame = new Simon();
      if ($('#slideE').hasClass('selected')) {
        currentGame.EMH = 'easy';
      } else if ($('#slideM').hasClass('selected')) {
        currentGame.EMH = 'med';
      } else if ($('#slideH').hasClass('selected')) {
        currentGame.EMH = 'hard';
      }
    })
    // turn off ----------------------------------------
  $('#slideOn').click(function() {
      $('#slideOn').css('background-color', 'black');
      $('#slideOff').css('background-color', 'blue');
      $('#round').html('');
      $('#startBtn, #strictBtn, #green, #red, #blue, #yellow').addClass('disabled');
      $('#strictLight').addClass('hidden');
      currentGame.sequence = [];
      currentGame.playerSequence = [];
      currentGame = undefined;
    })
    // strict mode button ---------------------------------
  $('#strictBtn').click(function() {
      if (currentGame.strict === false) {
        currentGame.strict = true;
        $('#strictLight').removeClass('hidden');
      } else {
        currentGame.strict = false;
        $('#strictLight').addClass('hidden');
      }
    })
    // easy med hard button -----------------------------------------
  $('#slideE').click(function() {
    currentGame.EMH = 'med';
    $(this).removeClass('selected').addClass('disabled');
    $('#slideM').removeClass('disabled').addClass('selected');

  })
  $('#slideM').click(function() {
    currentGame.EMH = 'hard';
    $(this).removeClass('selected').addClass('disabled');
    $('#slideH').removeClass('disabled').addClass('selected');
  })
  $('#slideH').click(function() {
      currentGame.EMH = 'easy';
      $(this).removeClass('selected').addClass('disabled');
      $('#slideE').removeClass('disabled').addClass('selected');
    })
    // Start button click -----------------------------------------
  $('#startBtn').click(function() {
    $(this).addClass('disabled');
    $('#round').html('00');
    currentGame.newRound();
  })

  // Main button user clicks ------------------------------------

  $('.color').click(function() {
    if ($(this).is('#green')) {
      $('#green').css('opacity', 1);
      window.setTimeout(function() {
        $('#green').css('opacity', 0.5)
      }, 200);
      soundOne.play();
      currentGame.playerChoice = choices[0];
      currentGame.playerSequence.push(currentGame.playerChoice);
      currentGame.compare();
    }
    if ($(this).is('#red')) {
      $('#red').css('opacity', 1);
      window.setTimeout(function() {
        $('#red').css('opacity', 0.5)
      }, 200);
      soundTwo.play();
      currentGame.playerChoice = choices[1];
      currentGame.playerSequence.push(currentGame.playerChoice);
      currentGame.compare();
    }
    if ($(this).is('#blue')) {
      $('#blue').css('opacity', 1);
      window.setTimeout(function() {
        $('#blue').css('opacity', 0.5)
      }, 200);
      soundThree.play();
      currentGame.playerChoice = choices[2];
      currentGame.playerSequence.push(currentGame.playerChoice);
      currentGame.compare();
    }
    if ($(this).is('#yellow')) {
      $('#yellow').css('opacity', 1);
      window.setTimeout(function() {
        $('#yellow').css('opacity', 0.5)
      }, 200);
      soundFour.play();
      currentGame.playerChoice = choices[3];
      currentGame.playerSequence.push(currentGame.playerChoice);
      currentGame.compare();
    }
  })
});