let runningTotal = 0;
let currentNumber = 0;
let currentOperator = "";
let displayString = "";
let repeatedDecimal = false;
let numberOfCalculations = 0;
let clearDisplay = false;
let calculate = false;
let repeatedOperator = false;


const calcDisplay = document.getElementById('screen-digits');
const calcButtons = Array.from(document.querySelectorAll('.button'));


calcButtons.forEach(btn => btn.addEventListener('click', buttonClicked));
window.addEventListener('keydown', buttonClicked);

function buttonClicked(button) {
    let keyCode;
    if (button.type === 'click') {
        keyCode = button.currentTarget.dataset.key;
    } else {
        keyCode = button.key;
    }

        keyCode == 'Enter' || keyCode == 'Return' ? keyCode = '=' : keyCode = keyCode;

    const currentButton = document.querySelector(`button[data-key="${keyCode}"]`);
    const key = document.querySelector(`button[data-key="${keyCode}"]`);
    if (!currentButton) return; // Exit function if pressed key not assigned
      
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
    }
};

function numberClicked(key) {
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
}

function operatorClicked(operatorBtn) {
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
    updateDisplay(displayString);
}

function clearEntryClicked() {
    currentNumber = 0;
    displayString = "";
    repeatedDecimal = false;
    repeatedOperator = false;
    clearDisplay = false;
    updateDisplay(displayString);
}

function updateDisplay(currentString) {
    console.log(currentString);
    currentString.length <= 8 ?
    calcDisplay.textContent = currentString :
    calcDisplay.textContent = roundNumber(currentString);
}

function roundNumber(currentString) {
    let decimalPlaces = 0;
    const currentNumber = Number(currentString);
    return String(Number.parseFloat(currentNumber).toExponential(3));
}

function dividedByZero() {
    console.log("YOU DIVIDED BY ZERO");
    updateDisplay("NOOOO");
}