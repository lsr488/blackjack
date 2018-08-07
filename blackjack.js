// BLACKJACK RULES
// 52 cards
// goal: get as close to 21 as possible without going over
// scoring: face cards = 10, 2-10 = number, ace = 1 or 11
// play
	// deal 1 card to each player (face up), then dealer (face up)
	// deal second card to each player (face up), then dealer (face down)
	// player
		// player can "hit" or "stand"
			// can hit multiple times per turn, until stand
		// if total > 21, goes bust (loses)
		// ace can be 1 or 11, depending on other cards/total
	// dealer play
		// face-down card revealed
			// if total >= 17, dealer stands
			// if total <= 16, dealer hits until 17 >= 17
		// if ace card, counts as 11 if brings total >= 17 (and dealer must stand then)
	// splitting hands
		// if two cards are same number, can split to create two separate hands
		// original bet halved (half per hand)
		// played separately, as if two diff people	
	// doubling down
	// insurance
	// settlement

// handling bets
	// if player's first two cards are Ace + ten-card (face card or 10) = "natural blackjack"
		// and dealer does not, player gets 1.5 points (amount of bet)
		// and dealer does, it's a tie and player gets bet back
	// if dealer has natural but no player does
		// dealer collects bets of all players who don't have naturals
	// if dealer's face-up card is a ten-card, deal looks at face-down card to see if natural
		// else doesn't look at face-down card until it's dealer's turn again


var playerHand = document.querySelector("#player-hand");
var playerTotal = document.querySelector("#player-total");
var playerUpdate = document.querySelector("#player-update");
var playerHitButton = document.getElementsByName("player-hit")[0];
var playerStandButton = document.getElementsByName("player-stand")[0];

var testDisplay = document.querySelector("#test-hand");
var testTotal = document.querySelector("#test-total");

var dealerHand = document.querySelector("#dealer-hand");
var dealerFaceDown = document.querySelector("#face-down");
var dealerTotal = document.querySelector("#dealer-total");
var dealerUpdate = document.querySelector("#dealer-update");
// var dealerRevealButton = document.getElementsByName("dealer-reveal")[0];
var dealerHitButton = document.getElementsByName("dealer-hit")[0];
var dealerStandButton = document.getElementsByName("dealer-stand")[0];

var winDisplay = document.querySelector("#winner");
var winUpdate = document.querySelector("#winner-update");

var deck = {
	cards: [],
	numOfCards: 52,
	suits: {
		hearts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
		spades: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
		diamonds: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
		clubs: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
	},
	tenCards: {
		ten: [10, 23, 36, 49],
		jack: [11, 24, 37, 50],
		queen: [12, 25, 38, 51],
		king: [13, 26, 39, 52],
		pointValue: 10
	},
	ace: {
		cardNum: [1, 14, 27, 40],
		pointValue1: 1,
		pointValue2: 11
	}
}

// maybe player should be an object that holds ALL players...?
var player = {
	hand: [],
	isBust: false,
	isWin: false,
	isStand: false,
	hasAce: false,
	acePointValue: 0
}

var dealer = {
	hand: [],
	sum: 0,
	isBust: false,
	isWin: false,
	isStand: false,
	hasAce: false,
	acePointValue: 0
}

var gameOver = false;

playerHitButton.addEventListener("click", function(event) {
	console.log('player hit btn clicked');
	hit(player);
});

playerStandButton.addEventListener("click", function(event) {
	console.log('player stand btn clicked');
	stand(player);
	revealCard();
	updateDealerDisplays();
});

// dealerRevealButton.addEventListener("click", function(event) {
// 	console.log('dealer reveal btn clicked');
// 	revealCard();
// 	updateDealerDisplays();	
// });

dealerHitButton.addEventListener("click", function(event) {
	console.log('dealer hit btn clicked');
	hit(dealer);
});

dealerStandButton.addEventListener("click", function(event) {
	console.log('dealer stand btn clicked');
	stand(dealer);
});

function varSetUp() {
	cards = deck.cards;
	numOfCards = deck.numOfCards;
}

function genNum() {
	var x = Math.floor(Math.random() * numOfCards + 1);
	return x;
}

function genDeck() {
	var tempCards = [];

	while(tempCards.length < numOfCards) {
		var newCard = genNum();
		if(!tempCards.includes(newCard)) {
			tempCards.push(newCard);
		}
	}
	tempCards.forEach(function(i) {
		cards.push(i);
	})
}

function initialDeal() {
	dealCard(player);
	dealCard(dealer);
	dealCard(player);
	dealCard(dealer);
}

function dealCard(turn) {
	var hand = turn.hand;
	hand.push(cards.pop());
}

function displayHands() {
	addPointValues(player);
	addPointValues(dealer);
	updatePlayerDisplays();
	updateDealerDisplays();	
}

function initialDisplay() {
	var suit = "";
	var string = "";
	var cardName = "";

	// display dealer's first card only
	var oneCard = {
		hand: []
	}
	oneCard.hand.push(dealer.hand[0]);
	displaySuitsAndName(oneCard.hand, dealerHand);
	addPointValues(oneCard);

	// display's dealer's total points on initial round
	dealerTotal.innerText = dealer.sum;

	// player
	updatePlayerDisplays();
}

// var testHand = {
// 	hand: [45, 2, 16, 40, 39],
// 	holding: [45, 2, 16, 40, 39, 3],
// 	sum: 0,
// 	hasAce: false,
// 	acePointValue: 0
// }
// function x() {
// 	displaySuitsAndName(testHand.hand, testDisplay);
// 	addPointValues(testHand);
// 	testTotal.innerText = testHand.sum;
// }
// x();

function addPointValues(turn) {
	var hand = turn.hand;
	var accPoints = 0;

	for(var i = 0; i < hand.length; i++) {
		// ace
		if(Object.values(deck.ace.cardNum).includes(hand[i])) {
			console.log("ace");
			turn.hasAce = true;
			// dealer rules for Ace Handling
			if(accPoints + 11 >= 17 && turn == dealer) {
				// console.log("turn: ", turn);
				console.log("points: ", deck.ace.pointValue1);
				turn.acePointValue = deck.ace.pointValue1;
				accPoints += deck.ace.pointValue1;
			} else if(accPoints + 11 <= 17 && turn == dealer) {
				console.log("card: ", hand[i]);
				console.log("points: ", deck.ace.pointValue2);
				turn.acePointValue = deck.ace.pointValue2;
				accPoints += deck.ace.pointValue2;
			// player rules for Ace Handling
			} else if(accPoints + 11 > 21 && turn == player) {
				console.log("card: ", hand[i]);
				console.log("points: ", deck.ace.pointValue1);
				turn.acePointValue = deck.ace.pointValue1;
				accPoints += deck.ace.pointValue1;
			} else if(accPoints + 11 <= 21 && turn == player) {
				console.log("card: ", hand[i]);
				console.log("points: ", deck.ace.pointValue2);
				turn.acePointValue = deck.ace.pointValue2;
				accPoints += deck.ace.pointValue2;
			} 
		}
		// tens
		else if(Object.values(deck.tenCards.ten).includes(hand[i])) {
			console.log("card: ", hand[i]);
			console.log("points: ", deck.tenCards.pointValue);
			accPoints += deck.tenCards.pointValue;
		}
		// jack
		 else if(Object.values(deck.tenCards.jack).includes(hand[i])) {
			console.log("card: ", hand[i]);
			console.log("points: ", deck.tenCards.pointValue);
			accPoints += deck.tenCards.pointValue;
		}
		// queen
		else if(Object.values(deck.tenCards.queen).includes(hand[i])) {
			console.log("card: ", hand[i]);
			console.log("points: ", deck.tenCards.pointValue);
			accPoints += deck.tenCards.pointValue;
		}
		// king
		else if(Object.values(deck.tenCards.king).includes(hand[i])) {
			console.log("card: ", hand[i]);
			console.log("points: ", deck.tenCards.pointValue);
			accPoints += deck.tenCards.pointValue;
		}
		// heart non-tendcards
		else if(hand[i] >= 2 && hand[i] <= 10) {
			console.log("card: ", hand[i]);
			console.log("points: ", hand[i]);
			accPoints += (hand[i]);
			console.log("accPoints: ", accPoints);		
		} 
		// spade non-tendcards
		else if(hand[i] >= 15 && hand[i] <= 22) {
			console.log("card: ", hand[i] - 13);
			console.log("points: ", hand[i] - 13);
			accPoints += (hand[i] - 13);
			console.log("accPoints: ", accPoints);
		} 
		// diamond non-tendcards
		else if(hand[i] >= 28 && hand[i] <= 35) {
			console.log("card: ", hand[i] - 26);
			console.log("points: ", hand[i] - 26);
			accPoints += (hand[i] - 26);
			console.log("accPoints: ", accPoints);
		} 
		// club non-tendcards
		else if(hand[i] >= 41 && hand[i] <= 48) {
			console.log("card: ", hand[i] - 39);
			console.log("points: ", hand[i] - 39);
			accPoints += (hand[i] - 39);
			console.log("accPoints: ", accPoints);
		}
	}
		// I think I resolved the issue of late-stage Aces having the wrong point value
		if(accPoints > 21 && turn.hasAce == true && turn.acePointValue == 11) {
			accPoints -= 10;
		}

	console.log("accPoints: ", accPoints);
	console.log("turn: ", turn);

	if(turn != player && turn != dealer) {
		console.log("one card");
		dealer.sum = accPoints
		console.log(dealer);
	} else {
		turn.sum = accPoints;
	}

	checkScore(turn);
}

function hit(turn) {
	var hand = turn.hand;

	if((turn == player) && player.isStand == false) {
		dealCard(player);
		addPointValues(player);
		updatePlayerDisplays();
		playerUpdate.innerText = "Dealt 1 card to player.";
		checkScore(player);
	}
	if(turn == dealer && dealer.isStand == false) {
		if(dealer.sum >= 17) {
			stand(dealer);
			checkScore(dealer);
		} else if(dealer.sum <= 16) {
			dealCard(dealer);
			addPointValues(dealer);
			updateDealerDisplays();
			dealerUpdate.innerText = "Dealt 1 card to dealer.";
			checkScore(dealer);
		}
	}
}

function stand(turn){
	turn.isStand = true;
	if(turn == player) {
		playerUpdate.innerText = "Player stands."
		disableButton(playerHitButton);	
		disableButton(playerStandButton);	
	} else {
		dealerUpdate.innerText = "Dealer stands."
		disableButton(dealerHitButton);	
		disableButton(dealerStandButton);
		isGameOver();
	}		
}

function revealCard() {
	displaySuitsAndName(dealer.hand, dealerHand);	
	// disableButton(dealerRevealButton);
	dealerFaceDown.classList.add("inactive");
	dealerUpdate.innerText = "Dealer reveals second card."
}

function declareBlackjack(turn) {
	turn.isWin = true;
	if(turn == player) {
		playerUpdate.innerText = "Blackjack!"
	} else {
		dealerUpdate.innerText = "Blackjack!"
	}
	disableButton(playerHitButton);	
	disableButton(playerStandButton);	
	disableButton(dealerHitButton);	
	disableButton(dealerStandButton);	
	revealCard();
	updateDealerDisplays();
	isGameOver();	
}

function declareBust(turn) {
	turn.isBust = true;
	if(turn == player) {
		playerUpdate.innerText = "Bust!"
		disableButton(playerHitButton);	
		disableButton(playerStandButton);	
		revealCard();
		updateDealerDisplays();
	} else {
		dealerUpdate.innerText = "Bust!"
		disableButton(dealerHitButton);	
		disableButton(dealerStandButton);	
		isGameOver();
	}
}

function checkScore(turn) {
	if(turn.sum == 21) {
		declareBlackjack(turn);
	} else if(turn.sum > 21) {
		declareBust(turn);
	}	else if(turn == dealer && turn.sum >= 17) {
		stand(dealer);
	}
}

function updatePlayerDisplays() {
	displaySuitsAndName(player.hand, playerHand);
	addPointValues(player);
	playerTotal.innerText = player.sum;	
}

function updateDealerDisplays() {
	displaySuitsAndName(dealer.hand, dealerHand);
	addPointValues(dealer);
	dealerTotal.innerText = dealer.sum;
}

function displaySuitsAndName(turn, display) {
	var suit = "";
	var string = "";	
	var heart = "&#x2665;";
	var spade = "&#x2660;";
	var diamond = "&#x25c6;";
	var club = "&#x2663;";

	turn.forEach(function(card) {
		var cardClass = "";
		var cardName = "";
		if(Object.values(deck.suits.hearts).includes(card)) {
			suit = heart;
			cardClass = `<span class="card card-red">`;
		} else if(Object.values(deck.suits.spades).includes(card)) {
			suit = spade;
			cardClass = `<span class="card">`;
		} else if(Object.values(deck.suits.diamonds).includes(card)) {
			suit = diamond;
			cardClass = `<span class="card card-red">`;
		} else if(Object.values(deck.suits.clubs).includes(card)) {
			suit = club;
			cardClass = `<span class="card">`;
		}

		if(Object.values(deck.tenCards.ten).includes(card)) {
			cardName = "10";
		} else if(Object.values(deck.tenCards.jack).includes(card)) {
			cardName = "J";
		} else if(Object.values(deck.tenCards.queen).includes(card)) {
			cardName = "Q";
		} else if(Object.values(deck.tenCards.king).includes(card)) {
			cardName = "K";
		} else if(Object.values(deck.ace.cardNum).includes(card)) {
			cardName = "A";
		}

		if(card >= 15 && card <= 22) {
			cardName = card - 13;
		} else if(card >= 28 && card <= 35) {
			cardName = card - 26;
		} else if(card >= 41 && card <= 48) {
			cardName = card - 39;
		}

		if(!cardName) {
			string += cardClass + card + suit + `</span>`;
		} else {
			string += cardClass + cardName + suit + `</span>`;
		}

		display.innerHTML = string;
	});
}

function disableButton(button) {
	button.setAttribute("disabled", "disabled");
	button.classList.remove("hover");
	button.classList.add("deactivated");
}

function checkWinner() {
	if(player.isWin == true && dealer.isWin == false) {
		console.log("win/true win/false: Player wins!");
		winUpdate.innerText = "Player!";
	} else if(player.isWin == false && dealer.isWin == true) {
	console.log("win/false win/false: Dealer wins!");
		winUpdate.innerText = "Dealer!";
	} else if(player.isBust == true && dealer.isBust == false) {
		console.log("bust/true bust/false: Dealer wins!")
		winUpdate.innerText = "Dealer!";
	} else if(player.isBust == false && dealer.isBust == true) {
		console.log("bust/false bust/true: Player wins!")
		winUpdate.innerText = "Player!";
	} else if(player.isBust == true && dealer.isBust == true) {
		console.log("bust/true bust/true: No winner, collect original bet.");
		winUpdate.innerText = "No winner.";
	} else if(player.isStand == true && dealer.isStand == true) {
			if(player.sum > dealer.sum) {
				console.log("stand/true stand/true: Player wins!");
				winUpdate.innerText = "Player!";
			} else if(player.sum == dealer.sum) {
				console.log("stand/true stand/true: It's a tie!");
				winUpdate.innerText = "It's a tie!";
			}  else {
				console.log("stand/true stand/true: Dealer wins!");
				winUpdate.innerText = "Dealer!";
			}
	}
	disableButton(playerHitButton);
	disableButton(playerStandButton);
	// disableButton(dealerRevealButton);
	disableButton(dealerHitButton);
	disableButton(dealerStandButton);
}

function isGameOver() {
	if(dealer.isBust == true || dealer.isStand == true || dealer.isWin == true || player.isWin) {
		winDisplay.classList.remove("inactive");
		winUpdate.classList.remove("inactive");
		checkWinner();
	} else {
		console.log("the game isn't over yet");
	}
}

varSetUp();
genDeck();
initialDeal();
initialDisplay();