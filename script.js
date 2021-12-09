const numButtons = [...document.querySelectorAll('.num')];
const operatorButtons = [...document.querySelectorAll('.operator')];
const displayText = document.querySelector('#display-text')
const clearButton = document.querySelector('#clear-button')
const deleteButton = document.querySelector('#delete-button')
const equalButton = document.querySelector('#equal-button')
const historyArea = document.querySelector('#history-entries')
const clearHistoryButton = document.querySelector('#clear-history-button')
const dotButton = document.querySelector('#dot-button')


const DISPLAY_LIMIT = 20;
const OPERATORS = '+-×÷'
const NUMBERS = '0123456789'


function displayOperator(operatorElem) {
    if (!reachedTextLimit() && lastCharIsNumber()) {
        displayText.textContent += ' ' + operatorElem.target.textContent + ' ';
    }
}

function lastCharIsNumber() {
    for (num of NUMBERS) {
        if (displayText.textContent.at(-1) === num) return true;
    }
    return false;
}

function displayNum(numElem) {
    if (!reachedTextLimit()) {
        displayText.textContent += numElem.target.textContent;
    }
}


function reachedTextLimit() {
    return displayText.textContent.length >= DISPLAY_LIMIT;
}


function lastCharIsOperator() {
    for (const op of OPERATORS) {
        if(displayText.textContent.slice(-3) === ' ' + op + ' ') return true;
    }
    return false;
}

function clearDisplay() {
    displayText.innerHTML = '&nbsp';
}

function deleteChar() {
    if(lastCharIsOperator()) {
        displayText.textContent = displayText.textContent.slice(0, -3)
    }
    else {
        displayText.textContent = displayText.textContent.slice(0, -1)
    }   

    if (displayText.textContent.length === 0) {
        displayText.innerHTML = '&nbsp'
    }
}


function calc(operation) {

    let finalResult = 0

    let addOperands = operation.split('+')

    for (let i = 0; i < addOperands.length; i++) {
    
        addOperands[i] = addOperands[i].split('-')
    
    }

    for (let i = 0; i < addOperands.length; i++) {

        if (addOperands[i].length != 1) {
            finalResult += minus(addOperands[i])
        }
        else {
            finalResult += multiplyDivide(addOperands[i])
        }

    }

    return finalResult
}


function minus(operation) {

    let finalResult = multiplyDivide(operation.splice(0, 1))

    for (let i = 0; i < operation.length; i++) {

        finalResult -= multiplyDivide(operation[i])
    }

    return finalResult
}


function multiplyDivide(operation) {
    operation = operation.toString()
    let finalResult = 1
    let subOperation = ''
    operation = operation.split('×')

    for (let i = 0; i < operation.length; i++) {

        subOperation = operation[i]
        
        if (subOperation.includes('÷')) {
            operation[i] = operation[i].split('÷')
            operation[i] = divide(operation[i])
        }

    }

    for (let i = 0; i < operation.length; i++) {
        finalResult *= operation[i]
    }

    return finalResult
}


function divide(operation) {

    let finalResult = operation.splice(0, 1)

    for (let i = 0; i < operation.length; i++) {
        finalResult /= operation[i]
    }
    
    return finalResult

}
  

function outputCalcResult() {

    if (displayText.textContent.length === 1) {
        return
    }
    if (lastCharIsOperator()) deleteChar();

    const result = calc(displayText.textContent)

    if (result == Infinity) {
        const originalText = displayText.innerHTML
        displayText.innerHTML = '&nbspCan\'t Divide By Zero!'

        setTimeout(() => {
            displayText.innerHTML = originalText
        }, 500);
    }

    else if (isNaN(result)) {
        
    }
    else {
        
        addHistoryEntry(displayText.textContent, result)
        displayText.innerHTML = '&nbsp' + Math.round(result * 1000) / 1000
    }
}



function addHistoryEntry(operation, result) {

    const entry = document.createElement('p')
    entry.innerHTML = operation.trim() + ' = ' + result

    const lastEntry = document.querySelector('#history-entries').lastChild
    
    if (lastEntry && lastEntry.innerHTML === entry.innerHTML) return;
    if(displayText.innerHTML.replace('&nbsp;', '').trim() == result) return;

    historyArea.appendChild(entry)
    historyArea.scrollTop = historyArea.scrollHeight;
}


function clearHistory() {
    historyArea.innerHTML = '';
}

function keyboadrdShorcuts(e) {

    if (e.key === 'Backspace') {
        deleteChar()
        return
    }

    if (e.key === 'Delete') {
        clearDisplay()
        return
    }
    if (e.key === '=' || e.key === 'Enter') {

        outputCalcResult(e)
        return
    }

    if(!reachedTextLimit()) {
        for (const num of NUMBERS) {
            if (num === e.key) {
                displayText.innerHTML += e.key.toString()
                return
            }
        }

        if (lastCharIsNumber()) {
            switch(e.key) {

                case '*':
                    displayText.textContent += ' × '
                    return
                case '/':
                    displayText.textContent += ' ÷ '
                    return
                case '+':
                    displayText.textContent += ' + '
                    return
                case '-':
                    displayText.textContent += ' - '
                    return
            }
        }
    }
}



function addDecimalPoint() {
    if(!displayText.textContent.split(' ').at(-1).includes('.')) {
        displayText.textContent += '.'
    }
}

    
numButtons.forEach(num => {
    num.addEventListener('click', displayNum)
})

operatorButtons.forEach(operator => {
    operator.addEventListener('click', displayOperator)
})

clearButton.addEventListener('click', clearDisplay)
deleteButton.addEventListener('click', deleteChar)
equalButton.addEventListener('click', outputCalcResult)
clearHistoryButton.addEventListener('click', clearHistory)
dotButton.addEventListener('click', addDecimalPoint)


document.addEventListener('keydown', keyboadrdShorcuts)