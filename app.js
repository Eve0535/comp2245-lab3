

const fruits = [
    { name: "apple", symbol: "🍎" },
    { name: "banana", symbol: "🍌" },
    { name: "cherry", symbol: "🍒" },
    { name: "coconut", symbol: "🥥" },
    { name: "grapes", symbol: "🍇 " },
    { name: "mango", symbol: "🥭" },
    { name: "pineapple", symbol: "🍍" },
    { name: "watermelon", symbol: "🍉" },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const deck = shuffle ([...fruits,...fruits]);

function buildBoard(){
    const board = document.querySelector("#board");

    board.innerHTML = "";

    deck.forEach((fruit, index) => {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${index + 1}, face down`);
        card.dataset.index = index;

        board.appendChild(card);
    });
}

const flippedCards = [];
let moves = 0;
let waiting = false;

const movesDisplay = document.querySelector("#moves");
const statusDisplay = document.querySelector("#status");
const board = document.querySelector("#board");


board.addEventListener("click", (event) => {
    const card = event.target;

    if (waiting) {
    return;
}

    if (!card.classList.contains("card")) {
        return;
    }

    if (card.classList.contains("flipped") || card.classList.contains("matched")) {
        return;
    }

    if (flippedCards.length === 2) {
        return;
    }

   
    const fruit = deck[card.dataset.index];
    card.textContent = fruit.symbol;
    card.classList.add("flipped");
    card.setAttribute(
        "aria-label",
        `Card ${Number(card.dataset.index) + 1}, ${fruit.name}`
    );


    flippedCards.push(card);
   
    if (flippedCards.length < 2) {
        return;
    }

    moves++;
    movesDisplay.textContent = moves;

    const firstFruit = deck[flippedCards[0].dataset.index];
    const secondFruit = deck[flippedCards[1].dataset.index];

    if (firstFruit.name === secondFruit.name) {
        flippedCards.forEach((card) => {
            card.classList.add("matched");
            card.disabled = true;
        });

        statusDisplay.textContent = "That's a pair!";
        flippedCards.length = 0;

        const matchedCards = board.querySelectorAll(".matched");

        if (matchedCards.length === 16) {
            statusDisplay.textContent = `You found all the pairs in ${moves} moves!`;

            statusDisplay.classList.add("you-won");
        }

    } else {
        statusDisplay.textContent = "Not a pair. Try again.";
        waiting = true;

        setTimeout(() => {
            flippedCards.forEach((card) => {
                card.textContent = "";
                card.classList.remove("flipped");

                card.setAttribute(
                    "aria-label",
                    `Card ${Number(card.dataset.index) + 1}, face down`
                );
            });

            flippedCards.length = 0;
            waiting = false;
            statusDisplay.textContent = "Turn over two cards to find a matching pair.";
        }, 1000);
    }
});

buildBoard();
