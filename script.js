const wordsToFind = ['JAVA', 'HTML', 'CSS', 'JAVASCRIPT', 'PYTHON', 'REACT', 'NODE', 'EXPRESS', 'ANGULAR', 'PHP'];
let foundWords = [];
const gridSize = 15; // Increased grid size
const wordGridElement = document.getElementById('word-grid');
const wordListElement = document.getElementById('word-list');
const messageElement = document.getElementById('message');
let isDragging = false; // To track dragging state
let selectedLetters = []; // To track selected letters
let currentWord = ''; // Track the current word being dragged

// Function to generate new words
function generateNewWords() {
    const allWords = ['JAVA', 'HTML', 'CSS', 'JAVASCRIPT', 'PYTHON', 'REACT', 'NODE', 'EXPRESS', 'ANGULAR', 'PHP', 'C++', 'SQL', 'RUBY', 'SWIFT', 'GO'];
    const randomWords = [];

    while (randomWords.length < 10) { // Increased number of words to find
        const randomIndex = Math.floor(Math.random() * allWords.length);
        const word = allWords[randomIndex];
        if (!randomWords.includes(word)) {
            randomWords.push(word);
        }
    }

    return randomWords;
}

// Function to generate the word grid
function generateGrid(words) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const grid = Array.from({ length: gridSize }, () => 
        Array.from({ length: gridSize }, () => '')
    );

    // Place words in the grid
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.floor(Math.random() * 2); // 0: horizontal, 1: vertical
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);

            if (canPlaceWord(grid, word, row, col, direction)) {
                placeWord(grid, word, row, col, direction);
                placed = true;
            }
        }
    });

    // Fill empty cells with random letters
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = letters.charAt(Math.floor(Math.random() * letters.length));
            }
        }
    }

    return grid;
}

// Check if a word can be placed in the grid
function canPlaceWord(grid, word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        const r = row + (direction === 0 ? 0 : i);
        const c = col + (direction === 0 ? i : 0);
        if (r >= gridSize || c >= gridSize || grid[r][c] !== '') {
            return false;
        }
    }
    return true;
}

// Place a word in the grid
function placeWord(grid, word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        const r = row + (direction === 0 ? 0 : i);
        const c = col + (direction === 0 ? i : 0);
        grid[r][c] = word[i];
    }
}

// Render the grid in the DOM
function renderGrid(grid) {
    wordGridElement.innerHTML = '';
    grid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            const letterElement = document.createElement('div');
            letterElement.textContent = letter;

            // Add mouse events for dragging functionality
            letterElement.addEventListener('mousedown', function () {
                isDragging = true; // Start dragging
                selectedLetters = [[rowIndex, colIndex]]; // Track selected letters
                currentWord = ''; // Reset current word
                this.classList.add('selected'); // Add visual feedback
                currentWord += letter; // Start building the current word
            });

            letterElement.addEventListener('mouseover', function () {
                if (isDragging) {
                    // If dragging, add letter to selectedLetters
                    selectedLetters.push([rowIndex, colIndex]);
                    currentWord += letter; // Add letter to current word
                    this.classList.add('selected'); // Add visual feedback
                }
            });

            letterElement.addEventListener('mouseup', function () {
                isDragging = false; // Stop dragging
                validateWord(); // Check if the current word is valid
            });

            wordGridElement.appendChild(letterElement);
        });
    });
}

// Function to validate if the dragged word is correct
function validateWord() {
    const foundWordIndex = wordsToFind.indexOf(currentWord);
    if (foundWordIndex !== -1 && !foundWords.includes(currentWord)) {
        foundWords.push(currentWord); // Add to found words
        // Cross out the word in the grid
        selectedLetters.forEach(([row, col]) => {
            const letter = wordGridElement.children[row * gridSize + col];
            if (letter) {
                letter.classList.add('word-found'); // Cross out word in the grid
            }
        });
    } else {
        // If the word is invalid, cancel the selection
        cancelDragging();
    }

    // Check if all words are found
    if (foundWords.length === wordsToFind.length) {
        messageElement.textContent = 'Congratulations! All words found!';
        setTimeout(initGame, 2000); // Restart game after 2 seconds
    }
    
    renderWordsToFind(wordsToFind); // Update the word list
}

// Cancel dragging and remove selection highlights
function cancelDragging() {
    selectedLetters.forEach(([row, col]) => {
        const letter = wordGridElement.children[row * gridSize + col];
        if (letter) {
            letter.classList.remove('selected'); // Remove visual feedback
        }
    });
    selectedLetters = []; // Clear selected letters
    currentWord = ''; // Clear current word
}

// Render the words to find
function renderWordsToFind(words) {
    wordListElement.innerHTML = '';
    words.forEach(word => {
        const listItem = document.createElement('div');
        listItem.textContent = word;
        if (foundWords.includes(word)) {
            listItem.classList.add('word-found'); // Cross out found words in the list
        }
        wordListElement.appendChild(listItem);
    });
}

// Initialize the game
function initGame() {
    foundWords = []; // Reset found words
    wordsToFind.length = 0; // Clear the existing words
    const newWords = generateNewWords(); // Generate new words
    newWords.forEach(word => wordsToFind.push(word)); // Update wordsToFind
    const grid = generateGrid(wordsToFind);
    renderGrid(grid);
    renderWordsToFind(wordsToFind);
}

// Start the game
initGame();
