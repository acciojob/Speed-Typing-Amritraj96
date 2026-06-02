//your JS code here. If required.
const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

let timerInterval;
let startTime;

// Event listener to check input correctness in real-time
quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    let correct = true;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        
        if (character == null) {
            // Character has not been typed yet
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            // Typed correctly
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            // Typed incorrectly
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    // If everything is typed perfectly
    if (correct) {
        handleSuccess();
    }
});

// Function to fetch a random quote from API
async function getRandomQuote() {
    try {
        const response = await fetch(RANDOM_QUOTE_API_URL);
        const data = await response.json();
        return data.content;
    } catch (error) {
        // Fallback quote in case the public API is down or blocked by CORS
        return "The quick brown fox jumps over the lazy dog.";
    }
}

// Function to render a new quote to screen
async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    
    // Split quote into individual characters inside spans for target styling
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    
    quoteInputElement.value = null;
    startTimer();
}

// Function handling the successful completion setup
function handleSuccess() {
    // Stop the timer
    clearInterval(timerInterval);
    
    // Disable input while waiting for the next quote
    quoteInputElement.disabled = true;

    // Wait 3 seconds before resetting
    setTimeout(() => {
        timerElement.innerText = 0; // Set timer to zero
        quoteInputElement.value = ''; // Clear input area
        quoteInputElement.disabled = false;
        renderNewQuote(); // Fetch another random quote
    }, 3000);
}

// Timer Logic
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

// Initialize the game on load
renderNewQuote();