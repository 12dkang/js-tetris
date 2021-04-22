document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    `url('./img/orange-btn.png')`,
    `url('./img/orange-btn.png')`,
    `url('./img/red-btn.png')`,
    `url('./img/red-btn.png')`,
    `url('./img/purple-btn.png')`,
    `url('./img/green-btn.png')`,
    `url('./img/blue-btn.png')`,
  ]

  // The Tetrominoes
  // UNRESOLVED: Arrays whose length < 4 will raise an error when rotate() is called via keybind.
  //             Currently need to repeat values for zTetromino, zTetrominoFlip, oTetromino, and iTetromino.
  const lTetromino = [
    [0, 1, 2, width],
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [0, width, width * 2, width * 2 + 1],
  ]

  const lTetrominoFlip = [
    [0, 1, 2, width + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [0, width, width + 1, width + 2],
    [0, 1, width, width * 2],
  ]

  const zTetromino = [
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
  ]

  const zTetrominoFlip = [
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
  ]

  const tTetromino = [
    [0, 1, 2, width + 1],
    [1, width, width + 1, width * 2 + 1],
    [1, width, width + 1, width + 2],
    [0, width, width + 1, width * 2],
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ]

  const iTetromino = [
    [width + 0, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width + 0, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
  ]

  const theTetrominoes = [
    lTetromino,
    lTetrominoFlip,
    zTetromino,
    zTetrominoFlip,
    tTetromino,
    oTetromino,
    iTetromino,
  ]

  let currentPosition = 4
  let currentRotation = 0

  // Randomly select a Tetromino and its rotation
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  // Draw the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.content = colors[random]
    })
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.content = ''
    })
  }

  // Move down function
  function moveDown() {
    freeze()
    undraw()
    currentPosition += width
    draw()
  }

  // Assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keydown', control)

  // Freeze function
  function freeze() {
    if (
      current.some((index) => squares[currentPosition + index + width].classList.contains('taken'))
    ) {
      current.forEach((index) => {
        squares[currentPosition + index].classList.add('taken')
      })
      // Drop the next Tetrino
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // Move the Tetromino left, unless it is at the edge or being blocked
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) {
      currentPosition -= 1
    }
    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  // Move the Tetromino left, unless it is at the edge or being blocked
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some((index) => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) {
      currentPosition += 1
    }
    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  // Rotate the Tetromino
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // Show next Tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  // The Tetrominos without rotations
  const nextTetrominoes = [
    [0, 1, 2, displayWidth], // lTetromino
    [0, 1, 2, displayWidth + 2], // lTetrominoFlip
    [0, 1, displayWidth + 1, displayWidth + 2], // zTetromino
    [1, 2, displayWidth, displayWidth + 1], // zTetrominoFlip
    [0, 1, 2, displayWidth + 1], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [displayWidth + 0, displayWidth + 1, displayWidth + 2, displayWidth + 3], // iTetromino
  ]

  // Display the shape in the mini-grid display
  function displayShape() {
    // First remove any trace of a Tetromino
    displaySquares.forEach((square) => {
      square.classList.remove('tetromino')
      square.style.content = ''
    })
    nextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.content = colors[nextRandom]
    })
  }

  // Add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 500)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  // Add score
  function addScore() {
    for (let i = 0; i < 200; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every((index) => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach((index) => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.content = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach((cell) => grid.appendChild(cell))
      }
    }
  }

  // Game over
  function gameOver() {
    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = score + ' (Game over)'
      clearInterval(timerId)
    }
  }
})
