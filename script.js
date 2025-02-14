let levels = [
    { 
        scrambled: ["b = 10", "a, b = b, a", "a = 5", 'print("a:", a, "b:", b)'],
        correct: ["a = 5", "b = 10", "a, b = b, a", 'print("a:", a, "b:", b)']
    },
    { 
        scrambled: ["num1 = 10", 'print("The sum is:", result)', "result = num1 + num2", "num2 = 5"],
        correct: ["num1 = 10", "num2 = 5", "result = num1 + num2", 'print("The sum is:", result)']
    },
    { 
        scrambled: ["if num % 2 == 0:", 'print("The number is odd")', "else:", "num = 7", 'print("The number is even")'],
        correct: ["num = 7", "if num % 2 == 0:", 'print("The number is even")', "else:", 'print("The number is odd")']
    },
    { 
        scrambled: ["result = 1", "n = 5", "for i in range(1, n + 1):", 'print("Factorial of", n, "is", result)', "result *= i"],
        correct: ["n = 5", "result = 1", "for i in range(1, n + 1):", "result *= i", 'print("Factorial of", n, "is", result)']
    },
    { 
        scrambled: ['reversed_string = ""', "for char in original_string:", 'print("Reversed string:", reversed_string)', 'original_string = "hello"', "reversed_string = char + reversed_string"],
        correct: ['original_string = "hello"', 'reversed_string = ""', "for char in original_string:", "reversed_string = char + reversed_string", 'print("Reversed string:", reversed_string)']
    }
];

let currentLevel = 0;
let timer;
let timeLeft = 30;

// Function to start the game
function startGame() {
    document.getElementById("intro-screen").style.display = "none"; // Hide intro screen
    document.getElementById("game-container").style.display = "block"; // Show game UI

    loadLevel(); // Start Level 1
}

// Function to start a 30-second countdown
function startTimer() {
    clearInterval(timer); // Clear any existing timer
    timeLeft = 30;
    document.getElementById("timer").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);

            if (currentLevel < levels.length - 1) {
                currentLevel++; // Move to the next level if time runs out
                loadLevel();
            } else {
                // If time runs out on Level 5 without answering correctly, hide game elements
                document.getElementById("code-container").style.display = "none";
                document.getElementById("check-answer").style.display = "none"; 
                document.getElementById("next-level").style.display = "none";
                document.getElementById("result").innerText = "Time's up! You didn't complete all levels ⑉";
                document.getElementById("restart").style.display = "block"; // Show Restart button
            }
        }
    }, 1000);
}

// Function to load a level
function loadLevel() {
    let codeContainer = document.getElementById("code-container");
    codeContainer.innerHTML = ""; // Clear previous content

    document.getElementById("level-number").innerText = currentLevel + 1;
    document.getElementById("result").innerText = ""; // Clear previous result
    document.getElementById("program-results").innerText = ""; // Clear output result
    document.getElementById("program-results").style.display = "none"; // Hide program output
    document.getElementById("next-level").style.display = "none"; // Hide next level button
    document.getElementById("check-answer").style.display = "block"; // Show check answer button

    levels[currentLevel].scrambled.forEach((line, index) => {
        let div = document.createElement("div");
        div.classList.add("code-line");
        div.setAttribute("draggable", "true");
        div.setAttribute("id", "line" + index);
        div.innerText = line;
        codeContainer.appendChild(div);
    });

    enableDragAndDrop();
    startTimer(); // Start the timer when the level loads
}

// Function to check if order is correct
let correctAnswers = 0; // Track the number of correct answers

function checkOrder() {
    let lines = document.querySelectorAll('.code-line');
    let userOrder = Array.from(lines).map(line => line.innerText);
    let correctOrder = levels[currentLevel].correct;
    let programOutputs = [
        "a: 10 b: 5",
        "The sum is: 15",
        "The number is odd",
        "Factorial of 5 is 120",
        "Reversed string: olleh"
    ];

    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
        correctAnswers++;
        clearInterval(timer);

        document.getElementById("result").innerText = "Correct! Well done! ☑";
        document.getElementById("program-results").innerText = " Output │ " + programOutputs[currentLevel]; 
        document.getElementById("program-results").style.display = "block"; // Show program output
        document.getElementById("check-answer").style.display = "none"; // Hide "Check Answer" button
        document.getElementById("next-level").style.display = "block";

        if (correctAnswers === 5) { 
            nextLevel(); 
        }
    } else {
        document.getElementById("result").innerText = "Incorrect ☒\nTry again!";
    }
}

// Function to move to next level
function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        loadLevel();
    } else {
        if (correctAnswers === 5) { // Only show the prize screen if all 5 were correct
            document.getElementById("code-container").style.display = "none";
            document.getElementById("next-level").style.display = "none";
            document.getElementById("check-answer").style.display = "none";
            document.getElementById("result").style.display = "none";
            document.getElementById("program-results").style.display = "none";
            document.getElementById("prize-screen").style.display = "block"; // Show Prize Screen
        } else {
            // Hide game elements and show failure message
            document.getElementById("code-container").style.display = "none";
            document.getElementById("check-answer").style.display = "none";
            document.getElementById("next-level").style.display = "none";
            document.getElementById("result").innerText = "⏳ You didn't get all correct answers!";
            document.getElementById("restart").style.display = "block"; // Show Restart button
        }
    }
}

// Function to restart the game
function restartGame() {
    currentLevel = 0;
    correctAnswers = 0; // Reset correct answers
    document.getElementById("restart").style.display = "none"; // Hide Restart button after clicking
    document.getElementById("prize-screen").style.display = "none"; // Hide Prize Screen
    document.getElementById("code-container").style.display = "block"; // Show game again
    document.getElementById("next-level").style.display = "none"; // Hide "Next Level" button
    document.getElementById("check-answer").style.display = "block"; // Show "Check Answer" button
    document.getElementById("result").style.display = "block"; // Show result section
    document.getElementById("program-results").style.display = "none"; // Hide program output
    loadLevel(); // Reload the game from Level 1
}

let draggedItem = null;

// Enable drag and drop for both mouse and touch
function enableDragAndDrop() {
    let items = document.querySelectorAll('.code-line');

    items.forEach(item => {
        // Mouse Events
        item.addEventListener('dragstart', (event) => {
            draggedItem = item;
            event.dataTransfer.setData('text/plain', item.innerText);
        });

        item.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        item.addEventListener('drop', (event) => {
            event.preventDefault();
            if (draggedItem !== item) {
                let parent = item.parentNode;
                let current = Array.from(parent.children).indexOf(item);
                let dragged = Array.from(parent.children).indexOf(draggedItem);

                if (dragged < current) {
                    parent.insertBefore(draggedItem, item.nextSibling);
                } else {
                    parent.insertBefore(draggedItem, item);
                }
            }
        });

        // Touch Events (For Mobile & Tablets)
        item.addEventListener('touchstart', (event) => {
            draggedItem = item;
            event.target.classList.add('dragging');
        });

        item.addEventListener('touchmove', (event) => {
            event.preventDefault();
            let touchLocation = event.touches[0];
            let hoveredElement = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);

            if (hoveredElement && hoveredElement.classList.contains('code-line') && hoveredElement !== draggedItem) {
                let parent = hoveredElement.parentNode;
                let current = Array.from(parent.children).indexOf(hoveredElement);
                let dragged = Array.from(parent.children).indexOf(draggedItem);

                if (dragged < current) {
                    parent.insertBefore(draggedItem, hoveredElement.nextSibling);
                } else {
                    parent.insertBefore(draggedItem, hoveredElement);
                }
            }
        });

        item.addEventListener('touchend', () => {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
        });
    });
}

// Run function when loading a level
enableDragAndDrop();

// Load the first level when the page starts
loadLevel();