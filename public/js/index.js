'use strict'
const screen = document.querySelector('#screen')
const command = document.querySelector('#commands')
let memory

document.addEventListener('DOMContentLoaded', (e) => {
  console.log('DOM Loaded')
  const numbers = document.querySelectorAll('button[data-number]')
  numbers.forEach(number => number.addEventListener('click', numberPressedHandler))

  const operators = document.querySelectorAll('button[data-number]')
  operators.forEach(number => number.addEventListener('click', operatorPressedHandler))

  const escapeButton = document.querySelector('button[data-escape]')
  escapeButton.addEventListener('click', acButton)

  const deleteButton = document.querySelector('button[data-delete]')
  deleteButton.addEventListener('click', ceButton)

  const pointButton = document.querySelector('button[data-point]')
  pointButton.addEventListener('click', addPoint)

  document.addEventListener('keydown', keyDownEventHandler)
})

function numberPressedHandler (event) {
  addNumber(parseInt(event.target.dataset.number))
}

function operatorPressedHandler (event) {
  addOperator(event.target.dataset.operator)
}

function addNumber (number) {
  if (memory) {
    memory = undefined
    screen.textContent = '0'
  }
  const value = parseInt(screen.textContent)
  if (value === 0 && /[.]/.test(screen.textContent) === false) {
    screen.textContent = number
    if (/[+\-*/]/.test(command.textContent) === true) {
      command.textContent += number
    } else {
      command.textContent = number
    }
  } else if (screen.textContent.length < 10) {
    screen.textContent += number
    command.textContent += number
  }
}

function addPoint () {
  if (memory) {
    memory = undefined
    screen.textContent = '0'
  }
  if (/[.]/.test(screen.textContent) === false && screen.textContent.length < 10) {
    screen.textContent += '.'
    command.textContent += '.'
  }
}

function acButton () {
  screen.textContent = '0'
  command.textContent = '0'
}
function ceButton () {
  screen.textContent = '0'
  const regexp = /[+\-*/]\s\d*$/.exec(command.textContent)
  if (regexp) {
    command.textContent = command.textContent.substr(0, regexp.index + 2)
  } else {
    command.textContent = '0'
  }
}

function addOperator (operator) {
  if (memory) {
    command.textContent = memory
    memory = undefined
  }
  const regexp = /[+\-*/]\s$/.exec(command.textContent)
  if (regexp) {
    command.textContent = `${command.textContent.substr(0, regexp.index - 1)} ${operator} `
  } else {
    command.textContent += ` ${operator} `
    screen.textContent = '0'
  }
}

function resolveCommand () {
  if (/[+\-*/]\s$/.test(command.textContent)) return
  if (/[+\-*/]/.test(command.textContent) === false) return
  const commands = command.textContent.split(' ')
  const postfix = fromInfixToPostfix(commands)
  const result = evaluatePostFix(postfix)
  memory = result
  command.textContent = '0'
  screen.textContent = result
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
  while (postfix.length > 0) {
    const a = Number(postfix.shift())
    const b = Number(postfix.shift())
    const operator = postfix.shift()
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
        result = a / b
        break
    }
    if (postfix.length > 0) {
      postfix.unshift(result)
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
