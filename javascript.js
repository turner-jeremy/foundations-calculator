let runningTotal = 0;
let currentNumber = 0;
let currentOperator = "";
let displayString = "";
let repeatedOperator = false;
let repeatedDecimal = false;
let resetNumbers = false;
let numberOfCalculations = 0;
let clearDisplay = false;
let calculate = false;
let calcLocked = false;


const screenDigits = document.getElementById('screen-digits');
const operatorButtons = Array.from(document.querySelectorAll('.operator'));
const calcButtons = Array.from(document.querySelectorAll('.button'));
const background = document.querySelector('.container');

calcButtons.forEach(btn => btn.addEventListener('click', buttonClicked));
window.addEventListener('keydown', buttonClicked);

function buttonClicked(button) {
    let keyCode;
    if (button.type === 'click') {
        keyCode = button.currentTarget.dataset.key;
    } else {
        keyCode = button.key;
    }
    // Treat enter or return key as equals
    keyCode == 'Enter' || keyCode == 'Return' ? keyCode = '=' : keyCode = keyCode;

    const currentButton = document.querySelector(`button[data-key="${keyCode}"]`);
    const key = document.querySelector(`button[data-key="${keyCode}"]`);
    if (!currentButton) return; // Exit function if pressed key not assigned
      
    if (calcLocked) {
        fadeButton(key.id);
        return;
    };

    if (key.classList.contains('number')) {
       numberClicked(key.id);
    } else if (key.classList.contains('operator')) {
        operatorClicked(key.id);
    } else if (key.id == 'btn-decimal') {
        decimalClicked();
    } else if (key.id == 'btn-c') {
        clearClicked();
    } else if (key.id == 'btn-ce') {
        clearEntryClicked();
    } else if (key.id == 'btn-equals') {
        equalsClicked();
    } else if (key.id == 'btn-percent') {
        percentageClicked();
    };
};

function numberClicked(key) {
    if (resetNumbers) {
        clearEntryClicked();
    }

    let numberKey = document.getElementById(key);
    if (clearDisplay ) { 
        displayString = numberKey.textContent;
        clearDisplay = false; // Will continue adding digits to GUI rather than wiping it.
    } else {
        displayString += (numberKey.textContent);
    };
    currentNumber = Number(displayString);
    updateDisplay(displayString);
    repeatedOperator = false;
    resetNumbers = false;
}

function operatorClicked(operatorBtn) {
    clearOperatorHighlights();
    document.getElementById(operatorBtn).classList.add('current-operator');
    if (repeatedOperator) {return};

    if (calculate) {
        calculateTotal();
    } else {
        runningTotal = currentNumber;
    };
    repeatedOperator = true;
    repeatedDecimal = false;
    updateDisplay(String(runningTotal));
    currentOperator = operatorBtn;
    calculate = true;
    clearDisplay = true; // Will reset GUI display next time a number is clicked.
};

function decimalClicked() {
    if (!repeatedDecimal) {
        if (displayString == "") {
            displayString = "0.";
            clearDisplay = false;
        } else {
            displayString += ".";
        }
    }
    repeatedDecimal = true;
    repeatedOperator = false;
    updateDisplay(displayString);
}

function equalsClicked() {
    currentNumber = Number(displayString);
   calculateTotal();
   currentNumber = runningTotal;
    calculate = false;
    repeatedDecimal = false;
    repeatedOperator = false;
    resetNumbers = true;
}

function percentageClicked() {
    
    currentNumber = Number(displayString);
    percentage = (runningTotal / (100 / currentNumber));
    switch (currentOperator) {
        case 'btn-plus':
            runningTotal = runningTotal + (runningTotal / (100 / currentNumber));
            break;
        case 'btn-minus':
            runningTotal = runningTotal - (runningTotal / (100 / currentNumber));
            break;
        case 'btn-multiply':
            runningTotal = runningTotal + (runningTotal / (100 / currentNumber));
            break;
        case 'btn-divide':
            runningTotal = (runningTotal / currentNumber) * 100;
            break;
    }
    updateDisplay(String(runningTotal));
    currentNumber = runningTotal;
    calculate = false;
    resetNumbers = true;
}

function calculateTotal() {
    switch (currentOperator) {
        case 'btn-plus':
            runningTotal += currentNumber;
            break;
        case 'btn-minus':
            runningTotal -= currentNumber;
            break;
        case 'btn-multiply':
            runningTotal *= currentNumber;
            break;
        case 'btn-divide':
            if (currentNumber === 0) {
                dividedByZero();
                return;
            } else {
                runningTotal /= currentNumber;
            };
            break;
    };
    clearOperatorHighlights();
    updateDisplay(String(runningTotal));
}

function clearClicked() {
    runningTotal = 0;
    currentNumber = 0;
    currentOperator = "";
    repeatedOperator = false;
    displayString = "";
    repeatedOperator = false;
    repeatedDecimal = false;
    numberOfCalculations = 0;
    clearDisplay = false;
    resetNumbers = false;
    calculate = false;
    restoreCalculator();
    updateDisplay(displayString);
}

function clearEntryClicked() {
    currentNumber = 0;
    displayString = "";
    repeatedDecimal = false;
    repeatedOperator = false;
    clearDisplay = false;
    resetNumbers = false;
    updateDisplay(displayString);
}

function updateDisplay(currentString) {
    currentString.length <= 8 ?
    screenDigits.innerHTML = currentString :
    screenDigits.innerHTML = roundNumber(currentString);
}

function roundNumber(currentString) {
    let decimalPlaces = 0;
    const currentNumber = Number(currentString);
    if (Math.abs(currentNumber) >= 100000000) {
        return `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
    } else if (currentNumber < 1 && currentNumber > -1) {
        return String(currentNumber.toFixed(7))
    } else {
        return String(currentNumber.toPrecision(8));
    };
}

function dividedByZero() {
    errorMessage = 
    lockCalc();
    screenDigits.innerHTML = "OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO OH NO";
    calcButtons.forEach(btn => btn.classList.add('btn-fade-out'));
    screenDigits.classList.add('glitch');
    background.classList.add('fade-to-black');
    setTimeout(clearClicked, 9900);
}

function lockCalc() {
    calcLocked = true;
}

function unlockCalc() {
    calcLocked = false;
}

function fadeButton(key) {
    let uKey = document.getElementById(key);
    uKey.classList.add('locked');
}

function slowFadeCalculator() {
    calcButtons.forEach(btn => btn.classList.add('btn-fade-out'));
}

function restoreCalculator() {
    unlockCalc();
    clearOperatorHighlights();
    calcButtons.forEach(btn => btn.classList.remove('locked'));
    calcButtons.forEach(btn => btn.classList.remove('btn-fade-out'));
    screenDigits.classList.remove('glitch');
    background.classList.remove('fade-to-black');
}

function clearOperatorHighlights() {
    operatorButtons.forEach(btn => btn.classList.remove('current-operator'));
}