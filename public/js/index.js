'use strict'
const screen = document.querySelector('#screen')
const command = document.querySelector('#commands')
let input = ''
let infix = ''
let memory = ''

document.addEventListener('DOMContentLoaded', (e) => {
  console.log('DOM Loaded')
  const numbers = document.querySelectorAll('button[data-number]')
  numbers.forEach(number => number.addEventListener('click', numberPressedHandler))

  const pointButton = document.querySelector('button[data-point]')
  pointButton.addEventListener('click', addPoint)

  const operators = document.querySelectorAll('button[data-number]')
  operators.forEach(number => number.addEventListener('click', operatorPressedHandler))

  const escapeButton = document.querySelector('button[data-escape]')
  escapeButton.addEventListener('click', acButton)

  const deleteButton = document.querySelector('button[data-delete]')
  deleteButton.addEventListener('click', ceButton)

  const equalButton = document.querySelector('button[data-equal]')
  equalButton.addEventListener('click', resolveCommand)

  document.addEventListener('keydown', keyDownEventHandler)
})

function updateDisplay () {
  screen.textContent = input === '' ? 0 : input
  command.value = infix === '' ? 0 : infix
  // command.focus()
  command.scrollLeft = command.scrollWidth
}

function numberPressedHandler (event) {
  addNumber(parseInt(event.target.dataset.number))
}

function operatorPressedHandler (event) {
  addOperator(event.target.dataset.operator)
}

function addNumber (number) {
  if (input === Infinity) return
  if (memory !== '') {
    memory = ''
    input = ''
    infix = ''
  }
  if (input === '') {
    if (number > 0) {
      input = `${number}`
      infix += `${number}`
    }
  } else {
    input += `${number}`
    infix += `${number}`
  }
  updateDisplay()
}

function addPoint () {
  if (input === Infinity) return
  if (memory !== '') {
    memory = ''
    input = ''
    infix = ''
  }
  if (/[.]/.test(input) === false && input.length < 10) {
    input += input === '' ? '0.' : '.'
    infix += input === '0.' ? input : '.'
  }
  updateDisplay()
}

function addOperator (operator) {
  if (input === Infinity) return
  if (memory !== '') {
    infix = memory
    input = ''
    memory = ''
  }
  const regexp = /[+\-*/]\s$/.exec(infix)
  if (regexp) {
    infix = `${infix.substr(0, regexp.index - 1)} ${operator} `
  } else {
    infix += ` ${operator} `
    input = ''
  }
  updateDisplay()
}

function acButton () {
  input = ''
  infix = ''
  memory = ''
  updateDisplay()
}
function ceButton () {
  if (input === Infinity) return
  if (memory !== '') return acButton()
  input = ''
  const regexp = /[+\-*/]\s\d*$/.exec(infix)
  if (regexp) {
    infix = infix.substr(0, regexp.index + 2)
  } else {
    infix = ''
  }
  updateDisplay()
}

function resolveCommand () {
  if (/[+\-*/]\s$/.test(infix)) return
  if (/[+\-*/]/.test(infix) === false) return
  const commands = infix.split(' ')
  const postfix = fromInfixToPostfix(commands)
  const result = evaluatePostFix(postfix)
  if (result === Infinity) {
    input = result
    memory = ''
  } else {
    memory = result
    input = result
  }
  updateDisplay()

  function formatResult (number) {
    if (/[.]/.test(number)) {
      const [integer, decimal] = String(number).split('.')
      return 'number.toFixed(decimal.length>10 ? )'
    }
  }
}

function fromInfixToPostfix (commands) {
  const output = []
  const operators = []
  while (commands.length > 0) {
    const token = commands.shift()
    if (/[+\-*/]/.test(token)) {
      let top = operators.length - 1
      while (operators.length > 0 && checkPrecende(token, operators[top])) {
        output.push(operators.pop())
        top = operators.length - 1
      }
      operators.push(token)
    } else {
      output.push(token)
    }
  }
  while (operators.length > 0) {
    output.push(operators.pop())
  }
  return output

  function checkPrecende (newOperator, topOperator) {
    let result = false
    if (/[+-]/.test(newOperator)) {
      result = /[+\-*/]/.test(topOperator)
    } else if (/[*/]/.test(newOperator)) {
      result = /[*/]/.test(topOperator)
    }
    return result
  }
}

function evaluatePostFix (postfix) {
  let result
  let operands = []
  while (postfix.length > 0) {
    const operator = postfix.shift()
    if (/[+\-*/]/.test(operator)) {
      const b = Number(operands.pop())
      const a = Number(operands.pop())
      switch (operator) {
        case '+':
          result = a + b
          break
        case '-':
          result = a - b
          break
        case '*':
          result = a * b
          break
        case '/':
          if (b === 0) return Infinity
          result = a / b
          break
      }
      if (postfix.length > 0) {
        operands.push(result)
      }
    } else {
      operands.push(operator)
    }
  }
  return result
}

function keyDownEventHandler (event) {
  if (/^\d$/.test(event.key)) {
    addNumber(parseInt(event.key))
  } else if (event.key === '.') {
    addPoint()
  } else if (/[+\-*/]/.test(event.key)) {
    addOperator(event.key)
  } else if (event.key === 'Enter') {
    resolveCommand()
  } else if (event.key === 'Delete') {
    ceButton()
  } else if (event.key === 'Escape') {
    acButton()
  }
}
