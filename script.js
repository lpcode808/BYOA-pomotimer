let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;

// DOM elements
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeButtons = document.querySelectorAll('.mode-btn');
const darkModeToggle = document.getElementById('darkModeToggle');
const accentColorPicker = document.getElementById('accentColor');
const timerContainer = document.querySelector('.timer-container');
const modeSelector = document.querySelector('.mode-selector');
const themeControls = document.querySelector('.theme-controls');
const todoList = document.getElementById('todoList');
const todoItems = document.querySelectorAll('.todo-item');
const currentTask = document.getElementById('currentTask');
const activeTask = document.querySelector('.active-task');

// Timer functions
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        showOnlyTimer();
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                isRunning = false;
                showAllControls();
                alert('Time is up!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    isRunning = false;
    showAllControls();
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    showAllControls();
    const activeButton = document.querySelector('.mode-btn.active');
    timeLeft = parseInt(activeButton.dataset.time) * 60;
    updateDisplay();
}

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        timeLeft = parseInt(button.dataset.time) * 60;
        resetTimer();
    });
});

// Theme controls
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

accentColorPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--accent-color', e.target.value);
});

function showOnlyTimer() {
    // Hide everything except timer and pause button
    modeSelector.classList.add('hidden');
    themeControls.classList.add('hidden');
    startButton.classList.add('hidden');
    resetButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
    
    // Show only top task if it exists
    const firstTask = todoList.querySelector('.todo-item input');
    if (firstTask && firstTask.value.trim()) {
        activeTask.classList.remove('hidden');
        currentTask.textContent = firstTask.value;
    }
    todoList.parentElement.classList.add('hidden');
}

function showAllControls() {
    // Show all controls
    modeSelector.classList.remove('hidden');
    themeControls.classList.remove('hidden');
    startButton.classList.remove('hidden');
    resetButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
    
    todoList.parentElement.classList.remove('hidden');
    activeTask.classList.add('hidden');
}

// Add these new functions for drag and drop
function initializeDragAndDrop() {
    todoItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...todoList.querySelectorAll('.todo-item:not(.dragging)')];
    
    const nextSibling = siblings.find(sibling => {
        const box = sibling.getBoundingClientRect();
        return e.clientY < box.top + box.height / 2;
    });

    todoList.insertBefore(draggingItem, nextSibling);
}

function handleDrop(e) {
    e.preventDefault();
}

// Initialize drag and drop
initializeDragAndDrop();

// Initial display
updateDisplay(); 