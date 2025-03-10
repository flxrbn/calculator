class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.memory = 0;
        this.waitingForSecondOperand = false;
        
        this.display = document.getElementById('result');
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        document.querySelectorAll('.number, .decimal').forEach(button => {
            button.addEventListener('click', () => this.appendNumber(button.textContent));
        });

        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => this.handleOperator(button.textContent));
        });

        document.querySelectorAll('.function').forEach(button => {
            button.addEventListener('click', () => this.handleFunction(button.textContent));
        });

        document.querySelectorAll('.memory').forEach(button => {
            button.addEventListener('click', () => this.handleMemory(button.textContent));
        });

        document.querySelector('.equals').addEventListener('click', () => this.calculate());
        document.querySelector('.clear').addEventListener('click', () => this.clear());
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentInput = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentInput.includes('.')) return;
        if (this.currentInput === '0' && number !== '.') {
            this.currentInput = number;
        } else {
            this.currentInput += number;
        }
        this.updateDisplay();
    }

    handleOperator(operator) {
        if (operator === '±') {
            this.currentInput = (parseFloat(this.currentInput) * -1).toString();
            this.updateDisplay();
            return;
        }

        if (operator === '%') {
            this.currentInput = (parseFloat(this.currentInput) / 100).toString();
            this.updateDisplay();
            return;
        }

        if (this.operation !== null) this.calculate();
        
        this.operation = operator;
        this.previousInput = this.currentInput;
        this.shouldResetScreen = true;
    }

    handleFunction(func) {
        const current = parseFloat(this.currentInput);
        
        switch(func) {
            case 'sin':
                this.currentInput = Math.sin(current * Math.PI / 180).toString();
                break;
            case 'cos':
                this.currentInput = Math.cos(current * Math.PI / 180).toString();
                break;
            case 'tan':
                this.currentInput = Math.tan(current * Math.PI / 180).toString();
                break;
            case 'π':
                this.currentInput = Math.PI.toString();
                break;
            case '√':
                if (current >= 0) {
                    this.currentInput = Math.sqrt(current).toString();
                } else {
                    this.currentInput = 'Error';
                }
                break;
            case 'x²':
                this.currentInput = (current * current).toString();
                break;
            case 'xʸ':
                this.operation = 'pow';
                this.previousInput = this.currentInput;
                this.shouldResetScreen = true;
                break;
            case 'e':
                this.currentInput = Math.E.toString();
                break;
        }
        this.updateDisplay();
    }

    handleMemory(operation) {
        switch(operation) {
            case 'MC':
                this.memory = 0;
                break;
            case 'MR':
                this.currentInput = this.memory.toString();
                break;
            case 'M+':
                this.memory += parseFloat(this.currentInput);
                this.shouldResetScreen = true;
                break;
            case 'M-':
                this.memory -= parseFloat(this.currentInput);
                this.shouldResetScreen = true;
                break;
        }
        this.updateDisplay();
    }

    calculate() {
        if (!this.operation || !this.previousInput) return;

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentInput = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            case 'pow':
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }

        this.currentInput = this.formatResult(result);
        this.operation = null;
        this.previousInput = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    formatResult(number) {
        if (isNaN(number)) return 'Error';
        if (!isFinite(number)) return 'Error';
        
        // Convert to string and limit decimal places
        const result = number.toString();
        if (result.includes('.')) {
            const parts = result.split('.');
            if (parts[1].length > 8) {
                return number.toFixed(8);
            }
        }
        return result;
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.value = this.currentInput;
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
}); 
