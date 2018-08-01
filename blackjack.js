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
var dealerHand = document.querySelector("#dealer-hand");
var dealerTotal = document.querySelector("#dealer-total");
var dealerUpdate = document.querySelector("#dealer-update");

var deck = {
	cards: [],
	numOfCards: 10,
}

// maybe player should be an object that holds ALL players...?
var player = {
	hand: [],
	isBust: false,
	isWin: false,
}

var dealer = {
	hand: [],
	sum: 0,
	isBust: false,
	isWin: false,
}

function varSetUp() {
	cards = deck.cards;
	numOfCards = deck.numOfCards;
	// pHand = player.hand;
	// pSum = player.sum;
	// pIsBust = player.isBust;
	pIsWin = player.isWin;
	// dHand = dealer.hand;
	// dSum = dealer.sum;
	dIsBust = dealer.isBust;
	dIsWin = dealer.isWin;
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
	// displayHands();
}

function dealCard(turn) {
	var hand = turn.hand;
	hand.push(cards.pop());
}

function displayHands() {
	addCards(player);
	addCards(dealer);
	console.log("player:", player.hand.join(", "), `(total: ${player.sum})`);
	console.log("dealer:", dealer.hand.join(", "), `(total: ${dealer.sum})`);	
	updatePlayerDisplays();
	updateDealerDisplays();
}

function addCards(turn) {
	var hand = turn.hand;
	sum = hand.reduce(function(accum, currVal) {
		return accum + currVal;
	}, 0);

	// if(turn == dealer) {
		if(hand[0] === 1 || hand[1] === 1) {
			sum += 10;
			console.log("ace now 11 in dealer hand");
			if(sum > 21) {
				sum -= 10;
				console.log("ace now 1 in dealer hand");
			}
		}
		turn.sum = sum;
		// dSum = sum;	
	// }

	// if(turn == player) {
	// 	player.sum = sum;
	// 	// pSum = sum;	
	// }
}

function hit(turn) {
	var hand = turn.hand;

	if(turn == player) {
		dealCard(player);
		addCards(player);
		console.log("Dealt 1 card to player.");
		console.log("player:", player.hand.join(", "), `(total: ${player.sum})`);
		updatePlayerDisplays();
		playerUpdate.innerText = "Dealt 1 card to player.";
		checkScore(player);
	}
	if(turn == dealer) {
		if(dealer.sum >= 17) {
			// if total >= 17, dealer stands
			console.log(dealer.sum + " >= 17: dealer stands");
			console.log("dealer:", dealer.hand.join(", "), `(total: ${dealer.sum})`);	
			dealerUpdate.innerText = "Dealer stands.";
			checkScore(dealer);
		} else if(dealer.sum <= 16) {
			// if total <= 16, dealer hits until 17 >= 17
			console.log(dealer.sum + " <= 16: dealer hits until 17 or greater");
			dealCard(dealer);
			addCards(dealer);
			console.log("Dealt 1 card to dealer.");
			console.log("dealer:", dealer.hand.join(", "), `(total: ${dealer.sum})`);	
			updateDealerDisplays();
			dealerUpdate.innerText = "Dealt 1 card to dealer.";

			checkScore(dealer);
		}
		// if ace card, counts as 11 if brings total >= 17 (and dealer must stand then)

	}
}

function checkScore(turn) {
	if(turn.sum == 21) {
		console.log("Blackjack!");
		turn.isWin = true;
		if(turn == player) {
			playerUpdate.innerText = "Blackjack!"
		} else {
			dealerUpdate.innerText = "Blackjack!"
		}
	} else if(turn.sum > 21) {
		console.log("Bust!");
		turn.isBust = true;
		if(turn == player) {
			playerUpdate.innerText = "Bust!"
		} else {
			dealerUpdate.innerText = "Bust!"
		}
	} else {
		console.log("score < 21");
	}
}

function updatePlayerDisplays() {
	playerHand.innerText = player.hand.join(", ");
	playerTotal.innerText = player.sum;	
}

function updateDealerDisplays() {
	dealerHand.innerText = dealer.hand.join(", ");
	dealerTotal.innerText = dealer.sum;
}

function checkWinner() {
	
}

varSetUp();
genDeck();
initialDeal();
// addCards(dHand);
// addCards(pHand);
displayHands();
// checkScore(player);
// checkScore(dealer);

