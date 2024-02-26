const inputDiv = document.querySelector('#input')
const outputDiv = document.querySelector('#output')
const keyPad = document.querySelector('#key-pad')
const themeSlider = document.querySelector('.theme-slider')
/*expression is an array which will contain both the 
  numbers and their operators in order
  e.g ['23','+','5567']
*/
let expression = ['0']
let answer = ''
let lastValue = expression[expression.length - 1]

const isInteger = (value) => isFinite(value) && !value.includes('.')

const isOperator = (value) => ['+', '-', '*', '/'].includes(value)

const addNumberToExpression = (num) => {
  if (lastValue === '0' || lastValue === "Infinity") {
    lastValue = num
  } else if (isFinite(lastValue)) {
    lastValue += num
  } else {
    expression.push(num)
  }
}
const addOperatorToExpression = (op) => {
  //if the lastValue is a number then add the operator
  if (!isNaN(lastValue)) {
    expression.push(op)
  } else if (op === '-' && /[*/]/.test(lastValue)) {
    lastValue += op
  } else if (isOperator(lastValue[0])) {
    // else replace the lastValue with the new operator
    lastValue = lastValue.replace(/[*/+-]*/, op)
  }
}

const addDotToExpression = () => {
  if (isInteger(lastValue)) {
    lastValue += '.'
  }
}
const clearLast = () => {
  if (lastValue.length > 1) {
    lastValue = lastValue.slice(0, -1)
  } else {
    expression.pop()
  }
}

const calculateExpression = () => {
  //the replace function removes all the operators at the end of the expression
  const expressionStr = expression.join('').replace(/[*/+-]+$/, '')
  if (!isNaN(expressionStr)) {
    return ''
  }
  const answerArr = eval(expressionStr).toString().split('e')
  answerArr[0] = String(+Number(answerArr[0]).toFixed(10))
  return answerArr.join('e')
}

const modifyExpression = (key) => {
  lastValue = expression[expression.length - 1]
  const savedLength = expression.length
  if (isFinite(key)) {
    addNumberToExpression(key)
  } else if (isOperator(key)) {
    addOperatorToExpression(key)
  } else if (key === '.') {
    addDotToExpression()
  } else if (key === 'Delete') {
    clearLast()
  } else if (key === 'Reset') {
    expression = []
  } else if (key === '=') {
    if (answer !== '') expression = [answer]
  }
  if (savedLength === expression.length) {
    expression[expression.length - 1] = lastValue
  }
  if (!expression.length || expression.valueOf() == '-') {
    expression = ['0']
  }
  answer = calculateExpression()
}

const addCommaToNumber = (number) => {
  let integerLength = number.split('.')[0].length
  for (let i = 0; i < integerLength; i++) {
    if ((integerLength - i) % 3 === 0 && isFinite(number[i - 1])) {
      number = `${number.slice(0, i)},${number.slice(i)}`
      integerLength++
    }
  }
  return number
}
const updateUI = () => {

  inputDiv.textContent = expression.map((value) => {
    if (isOperator(value[0])) {
      value = value.replace(/[*/]/, (op) => op === '*' ? '×' : '÷')
    } else {
      value = addCommaToNumber(value)
    }
    return value
  }).join('')
  outputDiv.textContent = addCommaToNumber(answer)

  inputDiv.scrollLeft = outputDiv.scrollLeft = inputDiv.scrollWidth
}

keyPad.addEventListener('click', (e) => {
  modifyExpression(e.target.parentNode.dataset.key || e.target.dataset.key)
  updateUI()
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Delete' && e.repeat) {
    modifyExpression('Reset')
  }
  console.log(e.key)
  modifyExpression(e.key)
  updateUI()
})
//changing themes using js

const changeTheme = (themeNum) => {
  const themes = ['dark', 'light', 'purple']
  themeSlider.value = themeNum
  document.documentElement.className = themes[themeNum]
  localStorage.setItem('preferred-theme-num', themeNum)
}

const preferredThemeNum = localStorage.getItem('preferred-theme-num')
if (preferredThemeNum !== null) {
  changeTheme(preferredThemeNum)
} else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
  changeTheme(0)
}

themeSlider.addEventListener('change', (e) => changeTheme(e.target.value))

updateUI()