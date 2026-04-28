function appendToDisplay(value) {
    document.getElementById("display").value += value;
}
function clearDisplay() {
    document.getElementById("display").value = "";
}
function calculate() {
    const display = document.getElementById("display");
    const expression = display.value;
    try {
        const tokens = tokenize(expression);
        display.value = evaluateTokens(tokens);
    } catch (error) {
        display.value = "Error";
    }
}

function tokenize(s) {
    const r = [];
    let token = '';
    for (const character of s) {
        if ('^*/+-'.includes(character)) {
            if (token === '' && character === '-') {
                token = '-';
            } else {
                r.push(parseFloat(token), character);
                token = '';
            }
        } else {
            token += character;
        }
    }
    if (token !== '') {
        r.push(parseFloat(token));
    }
    return r;
}

function evaluateTokens(tokens) {
    const operatorPrecedence = [
        { '^': (a, b) => Math.pow(a, b) },
        { '*': (a, b) => a * b, '/': (a, b) => a / b },
        { '+': (a, b) => a + b, '-': (a, b) => a - b }
    ];
    let operator;
    for (const operators of operatorPrecedence) {
        const newTokens = [];
        for (const token of tokens) {
            if (token in operators) {
                operator = operators[token];
            } else if (operator) {
                newTokens[newTokens.length - 1] = operator(newTokens[newTokens.length - 1], token);
                operator = null;
            } else {
                newTokens.push(token);
            }
        }
        tokens = newTokens;
    }
    if (tokens.length > 1) {
        throw new Error("Unable to resolve calculation");
    } else if (tokens.length === 0) {
        throw new Error("No tokens to evaluate");
    } else {
        return tokens[0];
    }
}
