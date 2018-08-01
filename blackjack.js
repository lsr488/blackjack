// BLACKJACK RULES
// 52 cards
// goal: get as close to 21 as possible without going over
// scoring: face cards = 10, 2-10 = number, ace = 1 or 11
// play
	// deal 1 card to each player (face up), then dealer (face up)
	// deal second card to each player (face up), then dealer (face down)
	// player
		// player can "hit" or "stand"
			// can hit multiple times per term, until stand
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

var deck = {
	cards: [],
	numOfCards: 13,
}

// maybe player1 should be an object that holds ALL players...?
var player1 = {
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
	pHand = player1.hand;
	// pSum = player1.sum;
	// pIsBust = player1.isBust;
	pIsWin = player1.isWin;
	dHand = dealer.hand;
	dSum = dealer.sum;
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
}

function initialDeal() {
	dealCard(pHand);
	dealCard(dHand);
	dealCard(pHand);
	dealCard(dHand);
	// displayHands();
}

function dealCard(hand) {
	hand.push(cards.pop());
}

function displayHands() {
	addCards(pHand);
	addCards(dHand);
	console.log("player1:", pHand.join(", "), `(total: ${pSum})`);
	console.log("dealer:", dHand.join(", "), `(total: ${dSum})`);	
}

function addCards(hand) {
	sum = hand.reduce(function(accum, currVal) {
		return accum + currVal;
	}, 0);

	// need to re-sync dealer.sum and dSum
	if(hand == dHand) {
		dealer.sum = sum;
		dSum = sum;	
	}

	if(hand == pHand) {
		player1.sum = sum;
		pSum = sum;	
	}
}

function hit(hand) {
	if(hand == pHand) {
		dealCard(hand);
		addCards(hand);
		console.log("player1:", hand.join(", "), `(total: ${pSum})`);
		checkScore(player1);
	}
	if(hand == dHand) {
		if(dSum >= 17) {
			// if total >= 17, dealer stands
			console.log(dSum + " >= 17: dealer stands");
			console.log("dealer:", hand.join(", "), `(total: ${dSum})`);	
			checkScore(dealer);
		} else if(dSum <= 16) {
			// if total <= 16, dealer hits until 17 >= 17
			console.log(dSum + " <= 16: dealer hits until 17 or greater");
			dealCard(hand);
			addCards(hand);
			console.log("dealer:", hand.join(", "), `(total: ${dSum})`);	
			checkScore(dealer);
		}
		// if ace card, counts as 11 if brings total >= 17 (and dealer must stand then)

	}
}

function checkScore(player) {
	if(player.sum == 21) {
		console.log("Blackjack!");
		player.isWin = true;
	} else if(player.sum > 21) {
		console.log("Bust!");
		player.isBust = true;
	} else {
		console.log("score < 21");
	}
}

function checkWinner() {
	
}

varSetUp();
genDeck();
initialDeal();
// addCards(dHand);
// addCards(pHand);
displayHands();
checkScore(player1);
checkScore(dealer);

