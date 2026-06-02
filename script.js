const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

let timerInterval;
let startTime;
let isWaiting = false; // Flag to prevent multi-triggering while waiting

quoteInputElement.addEventListener('input', () => {
    if (isWaiting) return; // Ignore input if we are in the 3-second transition phase

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    let correct = true;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    if (correct) {
        handleSuccess();
    }
});

async function getRandomQuote() {
    try {
        const response = await fetch(RANDOM_QUOTE_API_URL);
        const data = await response.json();
        return data.content;
    } catch (error) {
        return "The quick brown fox jumps over the lazy dog.";
    }
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    
    quoteInputElement.value = null;
    isWaiting = false; // Reset the phase flag
    startTimer();
}

function handleSuccess() {
    isWaiting = true; // Mark as waiting phase
    
    // Crucial change: Do NOT clear the interval here. 
    // Let the timer continue ticking (so it can hit 7, 8, etc. during the wait)
    
    setTimeout(() => {
        clearInterval(timerInterval); // Stop the old timer now
        timerElement.innerText = 0;   // Set the timer to zero
        quoteInputElement.value = '';  // Clear the input area
        renderNewQuote();             // Fetch another random quote
    }, 3000); // Wait exactly 3 seconds
}

function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

// Initialize the game
renderNewQuote();