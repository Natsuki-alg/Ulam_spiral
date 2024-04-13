const { createCanvas } = require('canvas')
const fs = require('fs')

const buffer = drawUlamSpiral(300)
fs.writeFileSync('ulam-spiral.png', buffer)

function drawUlamSpiral(size) {
  const drawSize = size * 5
  const canvas = createCanvas(drawSize, drawSize)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, drawSize, drawSize)

  const maxCount = maxDivisors(size * size)
  let x = size / 2, y = size / 2
  let step = 1, stepChanges = 0
  let dx = 0, dy = -1
  let num = 1

  for (let i = 0; i < size * size; i++) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      const divisorCount = countDivisors(num)
      const brightness = divisorCount / maxCount
      const squareSize = Math.pow(divisorCount / maxCount, 1.5) * size / 4
      ctx.fillStyle = `rgba(0, 0, ${(Math.pow(brightness, 2) * 0.5 + 0.5) * 255}, ${Math.pow(brightness, 0.7) / 3})`
      ctx.fillRect(x * 5 - squareSize / 2, y * 5 - squareSize / 2, squareSize, squareSize)
    }
    num++
    x += dx
    y += dy
    stepChanges++

    if (stepChanges == step) {
      stepChanges = 0
      const temp = dy
      dy = dx
      dx = -temp
      if (dx === 0) {
        step++
      }
    }
  }

  return canvas.toBuffer()
}

function countDivisors(n) {
  let count = 0
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      if (n / i === i) {
        count++
      } else {
        count += 2
      }
    }
  }
  return count
}

function maxDivisors(n) {
  let maxCount = 0
  for (let i = 1; i <= n; i++) {
    const currentCount = countDivisors(i)
    if (currentCount > maxCount) {
      maxCount = currentCount;
    }
  }
  return maxCount
}