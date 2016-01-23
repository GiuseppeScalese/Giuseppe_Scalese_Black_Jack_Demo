/* Black-Jack-Prototype - v0.1.0 -2016-01-17 */
//check whether or not namespace exist
var MyApp = MyApp || {};

//create my app namespace
var MyApp = (function(){

  //set array for cards deck and dealer/user cards counters
  var randomSetCardsArray = [];
  var userCardsTotal, dealerCardsTotal, dealerHiddenCard;

  //private method - it shows customise messages
  var _showMessage = function (message) {
     $(".card-result-list .hidden").html(dealerHiddenCard).fadeIn();
     $(".gamefield__message").html(message).fadeIn();
  }; 


  //private method - resets buttons initial state and cards deck
  var _resetButtonsState = function () {

    //enable stand, hit and next-hand button to be used
    $("#hit").prop("disabled", true);
    $("#stand").prop("disabled", true); 
    $("#next-hand").prop("disabled", true);
    $("#start").prop("disabled", false);

    //clear old cards deck
    randomSetCardsArray = [];
  };


  //private method - creates and returns an array of a random set of 52 cards 
  var _createRandomDeck = function() {
    var max = 52;
    
    //creates and array of 52 cards already shuffled
    for(var i=0; i<max ; i++){
        var temp = Math.floor(Math.random() * max+1);
        
        //if the string is not contained then add it to array
        if(randomSetCardsArray.indexOf(temp) === -1){
          randomSetCardsArray.push(temp);
        }
        else{
          i--;
        }   
    }
    return randomSetCardsArray;
  };


  //private method - retrieves the value of the cards from the deal function
  var _getValue = function(card) {

      if(card % 13 === 0 || card % 13 === 11 || card % 13 === 12){
          return 10;   
      }
      if(card % 13 === 1){
          return 11;   
      }
      else{
          return card % 13;
      }
  };


  //private method - update user total score
  var _updateUserTotal = function() {
    $(".gamefield__table__user .total-number").html(userCardsTotal);
  } 


  //private method - update dealer total score
  var _updateDealerTotal = function() {
    $(".gamefield__table__dealer .total-number").html(dealerCardsTotal);
  } 


  //private method - checks the dealer score of the game
  var _checkDealerGamescore = function() {

    var resultMessage;

    if (dealerCardsTotal > 21){
      resultMessage = "Dealer bust. You win!";
      _updateDealerTotal();
      _showMessage(resultMessage);
    }

    else if (dealerCardsTotal > userCardsTotal){
      resultMessage = "You lose. Dealer wins!";
      _updateDealerTotal();
      _showMessage(resultMessage);
    }
    
    else if (dealerCardsTotal === userCardsTotal){
      resultMessage = "Push. It's a draw!";
      _updateDealerTotal();
      _showMessage(resultMessage);
    } 

    //if the dealer still losing then picks another card
    else if (dealerCardsTotal < userCardsTotal){
      _dealerHand();
    } 

  };


  //private method - checks the user score of the game
  var _checkUserGamescore = function() {

    var resultMessage;

    //sets the black jack limit for the user
    if (userCardsTotal > 21){
      resultMessage = "You went bust. Dealer wins!";
      _showMessage(resultMessage);

      //update also dealer total on screen
      _updateDealerTotal();

      //reset buttons initial state for another game
      _resetButtonsState();
    }
    //update user total on screen
     _updateUserTotal();
  };


  //private method - creates an array of random set of 52 cards 
  var _dealerHand = function() {
    
    //get dealer new card
    var newCardPicked = _getValue(randomSetCardsArray[0]);

    //remove card just used from cards deck
    randomSetCardsArray = randomSetCardsArray.splice(1);

    //calculates new dealer cards total
    dealerCardsTotal = dealerCardsTotal + newCardPicked;
  
   //update new dealer card value into the DOM
    var dealerCardsValue = $('<li>'+newCardPicked+'</li>');
    $(".gamefield__table__dealer .card-result-list").append(dealerCardsValue);

    _updateDealerTotal();

    //check the dealer score
    _checkDealerGamescore();
  };


  //private method - handles the start game event
  var _startGame = function () {

    //clear dealer/user field for a new hand
    $(".gamefield__table__dealer").empty();
    $(".gamefield__table__user").empty();
    $('.gamefield__message').fadeOut();

    //enable stand, hit and next-hand button to be used
    $("#hit").prop("disabled", false);
    $("#stand").prop("disabled", false); 
    $("#next-hand").prop("disabled", false); 

    //disable start button
    $("#start").prop("disabled", true); 

    //create random 52 cards deck
    randomSetCardsArray = _createRandomDeck();
 
    //get user first and second card
    var userFirstCard = _getValue(randomSetCardsArray[0]);
    var userSecondCard = _getValue(randomSetCardsArray[1])
    userCardsTotal = userFirstCard + userSecondCard;

    //update user cards value into the DOM
    var userCardsValue = $('<h2>User cards:</h2><ul class="card-result-list">'+'<li>'+userFirstCard+'</li>'+
    '<li>'+userSecondCard+'</li></ul>'+'<div class="total"><span class="total-label">Total: </span><span class="total-number">'+userCardsTotal+'</span>'+'</div>');
    $(".gamefield__table__user").append(userCardsValue);

    //get dealer first and second card then calculates its current total
    var dealerFirstCard = _getValue(randomSetCardsArray[2]);
    var dealerSecondCard = _getValue(randomSetCardsArray[3])
    dealerHiddenCard = dealerSecondCard;
    dealerCardsTotal = dealerFirstCard + dealerSecondCard;

    //update user cards value into the DOM
    var dealerCardsValue = $('<h2>Dealer cards:</h2><ul class="card-result-list">'+'<li>'+dealerFirstCard+'</li>'+
    '<li class="hidden">HIDDEN CARD</li></ul>'+'<div class="total"><span class="total-label">Total: </span><span class="total-number">'+dealerFirstCard+' +...?</span>'+'</div>');

    $(".gamefield__table__dealer").append(dealerCardsValue);

    //remove cards just used from cards deck
    randomSetCardsArray = randomSetCardsArray.splice(4);
  };


  //private method - handles the hit event
  var _hitMove = function () {
   
    //get user new card
    var newCardPickedValue = _getValue(randomSetCardsArray[0]);

    //remove cards just used from cards deck
    randomSetCardsArray = randomSetCardsArray.splice(1);
    
    //add new card picked in the user results
    var newCardValue = $('<li>'+newCardPickedValue+'</li>');
    $(".gamefield__table__user .card-result-list").append(newCardValue);

    //calculates new user total
    userCardsTotal = newCardPickedValue + userCardsTotal;
   
    //checks the user score
     _checkUserGamescore();
  };


   //private method - handles the stand event 
  var _standMove = function () {

    //check the current score for the dealer
    _checkDealerGamescore();

    //reset buttons initial state for another game
    _resetButtonsState();
  };

  //private method - handles the next hand event 
  var _nextHand = function () {

    //clear dealer/user field for a new hand
    $(".gamefield__table__dealer").empty();
    $(".gamefield__table__user").empty();
    $('.gamefield__message').html("Click on start to play!").fadeIn();

    //reset buttons initial state for another game
    _resetButtonsState();
  };


  //public method - handles the button click and its functionalities
  var gameEventListener = function () {

      //listens to the start button event
      $('#start').click(function() {
        _startGame();
      });

      //listens to the hit button event
      $('#hit').click(function() {
        _hitMove();
      });

      //listens to the stand button event
      $('#stand').click(function() {   
        _standMove();
      });

      //listens to the next hand button event
      $('#next-hand').click(function() {   
        _nextHand();
      });
  };

  return {
      gameEventListener: gameEventListener
  };

})();

MyApp.gameEventListener();

