// Game configuration and state variables
const GOAL_CANS = 20;        // Total items needed to collect
const TIMER_INITIAL = 30;     // Initial time in seconds for the game
const ROCK_CHANCE = 0.25;        // Chance to spawn a rock instead of a water can
const SPAWN_INTERVAL = 850;   // Time in milliseconds between spawns
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timerInterval;          // Holds the intervals for timer ticks

// Game outcome messages
const WIN_MESSAGES = [
  "Congratulations! You've collected enough water cans and won the game!",
  "Well done! You've successfully completed the Water Quest!",
  "You did it! The water can goal is reached, you win!"
];

const LOSE_MESSAGES = [
  "Time's up! You fell short of the goal. Try again!",
  "Game over! You didn't collect enough water cans. Another round?",
  "Oh no! You ran out of time before collecting enough water cans. Let's give it another shot!"
];

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Update game instructions based on GOAL_CANS value
document.querySelector('.game-instructions').textContent = `Collect ${GOAL_CANS} water cans to complete the game!`;

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new object
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the object
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  // 60% chance to spawn a water can (+1 point on collection)
  // 40% chance to spawn a rock (-1 point on collection)
  if (Math.random() < 1 - ROCK_CHANCE) {
    randomCell.innerHTML = `
      <div class="water-can-wrapper">
        <div class="water-can"></div>
      </div>
    `;
  } else {
    randomCell.innerHTML = `
      <div class="rock-wrapper">
        <div class="rock"></div>
      </div>
    `;
  }
}

function updateTimer() {
  let timeLeft = parseInt(document.getElementById('timer').textContent);
  timeLeft -= 1;
  document.getElementById('timer').textContent = timeLeft;

  if (timeLeft == 0) {
    endGame();
  }
}

function collectItem(event) {
  if (!gameActive) return; // Ignore clicks if the game is not active
  const target = event.target;

  // Check if the clicked element is a water can or a rock
  if (target.classList.contains('water-can') || target.classList.contains('rock')) {
    // Increment or decrement score accordingly (without going below 0)
    currentCans += target.classList.contains('water-can') ? 1 : (currentCans > 0 ? -1 : 0); 
    target.parentElement.remove(); // Remove the clicked object from the grid
    document.getElementById('current-cans').textContent = currentCans; // Update the displayed score
  }
}

// Initializes and starts a new game
function startGame() {
  document.getElementById('start-game').disabled = true; // Disable the start button when the game starts
  if (gameActive) return; // Failsafe: prevent starting a new game if one is already active
  gameActive = true;

  currentCans = 0; // Reset the count of collected items
  document.getElementById('current-cans').textContent = currentCans; // Update the displayed count
  document.getElementById('timer').textContent = TIMER_INITIAL; // Reset the timer

  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, SPAWN_INTERVAL); // Spawn objects every SPAWN_INTERVAL milliseconds
  timerInterval = setInterval(updateTimer, 1000); // Decrement the timer every second
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning objects
  clearInterval(timerInterval); // Stop decrementing the timer
  document.querySelectorAll('.grid-cell').forEach(cell => (cell.innerHTML = '')); // Clear all cells

  // Show game over message based on the player's results
  if (currentCans >= GOAL_CANS) {
    const message = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
    showMessageBox(message);
    showConfetti(); // Show confetti animation for winning
  } else {
    const message = LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)];
    showMessageBox(message);
  }

  document.getElementById('start-game').disabled = false; // Re-enable the start button
}

// Displays a message to the user in a special message box
// AI-generated, used for game over message
function showMessageBox(message) {
  let box = document.getElementById('game-messagebox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'game-messagebox';
    box.className = 'messagebox';
    box.innerHTML = `
      <div class="messagebox-content">
        <span id="messagebox-text"></span>
        <button id="messagebox-close">OK</button>
      </div>
    `;
    document.body.appendChild(box);
    document.getElementById('messagebox-close').addEventListener('click', () => {
      box.style.display = 'none';
    });
  }
  document.getElementById('messagebox-text').textContent = message;
  box.style.display = 'flex';
}

// Creates a confetti animation on the screen to celebrate winning the game
// AI-generated.
function showConfetti() {
  for (let i = 0; i < 120; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.background = `hsl(${Math.random()*360},100%,60%)`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
document.querySelector('.game-grid').addEventListener('click', collectItem);