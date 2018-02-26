'use strict'
const screen = document.querySelector('#screen')
const command = document.querySelector('#commands')
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
  const value = parseInt(screen.textContent)
  if (value === 0 && /[.]/.test(screen.textContent) === false) {
    screen.textContent = number
    command.textContent += number
  } else if (screen.textContent.length < 10) {
    screen.textContent += number
    command.textContent += number
  }
}

function addPoint () {
  if (/[.]/.test(screen.textContent) === false && screen.textContent.length < 10) {
    screen.textContent += '.'
  }
}

function acButton () {
  screen.textContent = '0'
}
function ceButton () {
  screen.textContent = '0'
}

function addOperator (operator) {
  const operand = command.textContent
  if (/[+\-*/]$/.test(operand) === true) {
    console.log('End on operand')
  } else {
    console.log('Not operand')
    if (operand === '0') {
      command.textContent = screen.textContent + operator
    } else {
      command.textContent += screen.textContent + operator
    }
    screen.textContent = '0'
  }
}

function keyDownEventHandler (event) {
  if (/\d/.test(event.key)) {
    addNumber(parseInt(event.key))
  } else if (event.key === '.') {
    addPoint()
  } else if (/[+\-*/]/.test(event.key)) {
    addOperator(event.key)
  } else if (event.key === 'Enter') {
    console.log('Enter key pressed')
  } else if (event.key === 'Delete') {
    ceButton()
  } else if (event.key === 'Escape') {
    acButton()
  }
}
