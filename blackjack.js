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

// TODO handle scoring of higher numbers
// TODO assign suits and card values

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
var dealerRevealButton = document.getElementsByName("dealer-reveal")[0];
var dealerHitButton = document.getElementsByName("dealer-hit")[0];
var dealerStandButton = document.getElementsByName("dealer-stand")[0];

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
	hasAce: false
}

var dealer = {
	hand: [],
	sum: 0,
	isBust: false,
	isWin: false,
	isStand: false,
	hasAce: false
}

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

dealerRevealButton.addEventListener("click", function(event) {
	console.log('dealer reveal btn clicked');
	revealCard();
	updateDealerDisplays();	
});

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
	// pHand = player.hand;
	// pSum = player.sum;
	// pIsBust = player.isBust;
	// pIsWin = player.isWin;
	// dHand = dealer.hand;
	// dSum = dealer.sum;
	// dIsBust = dealer.isBust;
	// dIsWin = dealer.isWin;
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
	console.log("deck:", cards);
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
	// console.log("player:", player.hand.join(", "), `(total: ${player.sum})`);
	// console.log("dealer:", dealer.hand.join(", "), `(total: ${dealer.sum})`);	
	// console.log("dealer:", dealer.hand[0]);	

	updatePlayerDisplays();
	updateDealerDisplays();	
}

function initialDisplay() {
	var suit = "";
	var string = "";
	var cardName = "";

	// display's dealer's total points on initial round
	dealerHand.innerText = dealer.hand[0];
	if (dealer.hand[0] == 1) {
		dealerTotal.innerText = 11;
	} else if(dealer.hand[0] >= 10) {
		dealerTotal.innerText = 10;
	} else {
		dealerTotal.innerText = dealer.hand[0];
	}

	// display dealer's first card only
	var oneCard = {
		hand: []
	}
	oneCard.hand.push(dealer.hand[0]);
	displaySuitsAndName(oneCard.hand, dealerHand);
	addPointValues(oneCard);
	// addPointValues(player);
	updatePlayerDisplays();
}

// var testHand = {
// 	hand: [10, 9, 1, 14],
// 	sum: 0,
// 	hasAce: false
// }
// displaySuitsAndName(testHand.hand, testDisplay);
// addPointValues(testHand);
// testTotal.innerText = testHand.sum;

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
				console.log("card: ", hand[i]);
				console.log("points: ", deck.ace.pointValue1);
				accPoints += deck.ace.pointValue1;
			} else if(accPoints + 11 <= 17 && turn == dealer) {
				console.log("card: ", hand[i]);
				console.log("points: ", deck.ace.pointValue2);
				accPoints += deck.ace.pointValue2;
			// player rules for Ace Handling
			} else if(accPoints + 11 > 21 && turn == player) {
				// console.log("turn: ", turn);
				console.log("card: ", hand[i]);
				console.log("points: ", deck.ace.pointValue1);
				accPoints += deck.ace.pointValue1;
			} else if(accPoints + 11 <= 21 && turn == player) {
				console.log("card: ", hand[i]);
				console.log("points: ", deck.ace.pointValue2);
				accPoints += deck.ace.pointValue2;
			} 
		}
		// tens
		else if(Object.values(deck.tenCards.ten).includes(hand[i])) {
			accPoints += deck.tenCards.pointValue;
		}
		// jack
		 else if(Object.values(deck.tenCards.jack).includes(hand[i])) {
			accPoints += deck.tenCards.pointValue;
		}
		// queen
		else if(Object.values(deck.tenCards.queen).includes(hand[i])) {
			accPoints += deck.tenCards.pointValue;
		}
		// king
		else if(Object.values(deck.tenCards.king).includes(hand[i])) {
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
			console.log("card: ", hand[i]);
			console.log("points: ", hand[i] - 13);
			accPoints += (hand[i] - 13);
			console.log("accPoints: ", accPoints);
		} 
		// diamond non-tendcards
		else if(hand[i] >= 28 && hand[i] <= 35) {
			console.log("card: ", hand[i]);
			console.log("points: ", hand[i] - 26);
			accPoints += (hand[i] - 26);
			console.log("accPoints: ", accPoints);
		} 
		// club non-tendcards
		else if(hand[i] >= 41 && hand[i] <= 48) {
			console.log("card: ", hand[i]);
			console.log("points: ", hand[i] - 39);
			accPoints += (hand[i] - 39);
			console.log("accPoints: ", accPoints);
		}
	}

		// below attempting to account for Ace as first element always getting 
		if(accPoints > 21 && turn.hasAce == true) {
			console.log("change ace point value from 11 to 1");
			accPoints -= 10;
		}

	console.log("accPoints: ", accPoints);
	turn.sum = accPoints;
	checkScore(turn);
}

function hit(turn) {
	var hand = turn.hand;

	if((turn == player) && player.isStand == false) {
		dealCard(player);
		addPointValues(player);
		// console.log("Dealt 1 card to player.");
		// console.log("player:", player.hand.join(", "), `(total: ${player.sum})`);
		updatePlayerDisplays();
		playerUpdate.innerText = "Dealt 1 card to player.";
		checkScore(player);
	}
	if(turn == dealer && dealer.isStand == false) {
		if(dealer.sum >= 17) {
			// if total >= 17, dealer stands
			// console.log(dealer.sum + " >= 17: dealer stands");
			// console.log("dealer:", dealer.hand.join(", "), `(total: ${dealer.sum})`);	
			stand(dealer);
			checkScore(dealer);
		} else if(dealer.sum <= 16) {
			// if total <= 16, dealer hits until 17 >= 17
			// console.log(dealer.sum + " <= 16: dealer hits until 17 or greater");
			dealCard(dealer);
			addPointValues(dealer);
			// console.log("Dealt 1 card to dealer.");
			// console.log("dealer:", dealer.hand.join(", "), `(total: ${dealer.sum})`);	
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
	}		
}

function revealCard() {
	// dealerHand.innerText = dealer.hand.join(", ");
	displaySuitsAndName(dealer.hand, dealerHand);	
	disableButton(dealerRevealButton);
	dealerFaceDown.classList.add("inactive");
	dealerUpdate.innerText = "Dealer reveals second card."
}

function checkScore(turn) {
	if(turn.sum == 21) {
		turn.isWin = true;
		if(turn == player) {
			playerUpdate.innerText = "Blackjack!"
			disableButton(playerHitButton);	
			disableButton(playerStandButton);	
			disableButton(dealerRevealButton);
			revealCard();
			updateDealerDisplays();
			// checkWinner();
		} else {
			dealerUpdate.innerText = "Blackjack!"
			disableButton(dealerHitButton);	
			disableButton(dealerStandButton);	
			revealCard();
			updateDealerDisplays();
			disableButton(dealerRevealButton);
			// checkWinner();
		}
	} else if(turn.sum > 21) {
		turn.isBust = true;
		if(turn == player) {
			playerUpdate.innerText = "Bust!"
			disableButton(playerHitButton);	
			disableButton(playerStandButton);	
			revealCard();
			updateDealerDisplays();
			disableButton(dealerRevealButton);
			// checkWinner();
		} else {
			dealerUpdate.innerText = "Bust!"
			disableButton(dealerHitButton);	
			disableButton(dealerStandButton);	
			disableButton(dealerRevealButton);
			// checkWinner();
		}
	} 
	else if(turn == dealer && turn.sum >= 17) {
		// console.log("score < 21");
		dealer.isStand == true;
		dealerUpdate.innerText = "Dealer stands.";
		disableButton(dealerHitButton);	
		disableButton(dealerStandButton);	
		disableButton(dealerRevealButton);
		checkWinner();
	}
}

function updatePlayerDisplays() {
	// playerHand.innerText = player.hand.join(", ");
	displaySuitsAndName(player.hand, playerHand);
	addPointValues(player);
	playerTotal.innerText = player.sum;	
}

function updateDealerDisplays() {
	// dealerHand.innerText = dealer.hand.join(", ");
	// dealerHand.innerText = dealer.hand[0];
	displaySuitsAndName(dealer.hand, dealerHand);
	addPointValues(dealer);
	dealerTotal.innerText = dealer.sum;
}

function displaySuitsAndName(turn, display) {
	var suit = "";
	var string = "";	
	// var heart = "&#x2661; ";
	var heart = "&#x2665;";
	var spade = "&#x2660;";
	var diamond = "&#x25c6;";
	var club = "&#x2663;";

	turn.forEach(function(card) {
		var cardClass = "";
		var cardName = "";
		if(Object.values(deck.suits.hearts).includes(card)) {
			// console.log("suit is hearts");
			suit = heart;
			cardClass = `<span class="card card-red">`;
		} else if(Object.values(deck.suits.spades).includes(card)) {
			// console.log("suit is spades");
			suit = spade;
			cardClass = `<span class="card">`;
		} else if(Object.values(deck.suits.diamonds).includes(card)) {
			// console.log("suit is diamonds");
			suit = diamond;
			cardClass = `<span class="card card-red">`;
		} else if(Object.values(deck.suits.clubs).includes(card)) {
			// console.log("suit is clubs");
			suit = club;
			cardClass = `<span class="card">`;
		}

		if(Object.values(deck.tenCards.ten).includes(card)) {
			// console.log("card is 10");
			cardName = "10";
		} else if(Object.values(deck.tenCards.jack).includes(card)) {
			// console.log("card is jack");
			cardName = "J";
		} else if(Object.values(deck.tenCards.queen).includes(card)) {
			// console.log("card is queen");
			cardName = "Q";
		} else if(Object.values(deck.tenCards.king).includes(card)) {
			// console.log("card is king");
			cardName = "K";
		} else if(Object.values(deck.ace.cardNum).includes(card)) {
			// console.log("card is ace");
			cardName = "A";
		}

		if(card >= 15 && card <= 22) {
			console.log(card - 13);
			cardName = card - 13;
		} else if(card >= 28 && card <= 35) {
			console.log(card - 26);
			cardName = card - 26;
		} else if(card >= 41 && card <= 48) {
			console.log(card - 39);
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
}

function checkWinner() {
	if(player.isWinner == true && dealer.isWinner == false) {
		console.log("win/true win/false: Player wins!");
	} else if(player.isWinner == false && dealer.isWinner == true) {
	console.log("win/false win/false: Dealer wins!");
	} else if(player.isBust == true && dealer.isBust == false) {
		console.log("bust/true bust/false: Dealer wins!")
	} else if(player.isBust == false && dealer.isBust == true) {
		console.log("bust/false bust/true: Player wins!")
	} else if(player.isBust == true && dealer.isBust == true) {
		console.log("bust/true bust/true: No winner, collect original bet.");
	} else if(player.isStand == true && dealer.isStand == true) {
			if(player.sum > dealer.sum) {
				console.log("stand/true stand/true: Player wins!");
			} else {
				console.log("stand/true stand/true: Dealer wins!");
			}
	}
}

function isGameOver() {
	if(dealer.isBust == true || dealer.isStand == true || dealer.isStand == true) {
		checkWinner();
	}
}

varSetUp();
genDeck();
initialDeal();
// displayHands();
initialDisplay();