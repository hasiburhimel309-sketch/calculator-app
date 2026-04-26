let currentInput = '';
let expression = '';
let justCalculated = false;

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

function updateDisplay(value) {
  resultEl.textContent = value;
}

function appendNum(num) {
  if (justCalculated) {
    currentInput = '';
    expression = '';
    justCalculated = false;
  }
  if (currentInput.length >= 12) return;
  currentInput += num;
  expressionEl.textContent = expression + currentInput;
  updateDisplay(currentInput);
}

function appendDot() {
  if (justCalculated) {
    currentInput = '0';
    expression = '';
    justCalculated = false;
  }
  if (currentInput.includes('.')) return;
  if (currentInput === '') currentInput = '0';
  currentInput += '.';
  expressionEl.textContent = expression + currentInput;
  updateDisplay(currentInput);
}

function appendOp(op) {
  justCalculated = false;
  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  if (currentInput === '' && expression !== '') {
    // Replace last operator
    expression = expression.slice(0, -3) + ` ${op} `;
    expressionEl.textContent = expression;
    return;
  }

  if (currentInput !== '') {
    expression += currentInput + ` ${op} `;
    currentInput = '';
    expressionEl.textContent = expression;
    updateDisplay(expression.replace(/\*/g, '×').replace(/\//g, '÷'));
  }
}

function calculate() {
  if (currentInput === '' && expression === '') return;
  const fullExpr = expression + currentInput;
  if (!fullExpr) return;

  try {
    const cleaned = fullExpr.replace(/÷/g, '/').replace(/×/g, '*');
    // Safe eval using Function
    const res = Function('"use strict"; return (' + cleaned + ')')();
    const formatted = parseFloat(res.toFixed(10)).toString();

    expressionEl.textContent = fullExpr + ' =';
    updateDisplay(formatted);
    popAnim();

    currentInput = formatted;
    expression = '';
    justCalculated = true;
  } catch (e) {
    updateDisplay('Error');
    currentInput = '';
    expression = '';
  }
}

function clearAll() {
  currentInput = '';
  expression = '';
  justCalculated = false;
  expressionEl.textContent = '';
  updateDisplay('0');
}

function toggleSign() {
  if (currentInput === '' || currentInput === '0') return;
  if (currentInput.startsWith('-')) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = '-' + currentInput;
  }
  updateDisplay(currentInput);
  expressionEl.textContent = expression + currentInput;
}

function percentage() {
  if (currentInput === '') return;
  const val = parseFloat(currentInput) / 100;
  currentInput = parseFloat(val.toFixed(10)).toString();
  updateDisplay(currentInput);
  expressionEl.textContent = expression + currentInput;
}

function popAnim() {
  resultEl.classList.remove('pop');
  void resultEl.offsetWidth; // reflow
  resultEl.classList.add('pop');
  setTimeout(() => resultEl.classList.remove('pop'), 200);
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNum(e.key);
  else if (e.key === '.') appendDot();
  else if (e.key === '+') appendOp('+');
  else if (e.key === '-') appendOp('-');
  else if (e.key === '*') appendOp('*');
  else if (e.key === '/') { e.preventDefault(); appendOp('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    expressionEl.textContent = expression + currentInput;
    updateDisplay(currentInput || '0');
  }
  else if (e.key === 'Escape') clearAll();
  else if (e.key === '%') percentage();
});
