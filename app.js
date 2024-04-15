const { createCanvas } = require('canvas')
const fs = require('fs')

const buffer = drawUlamSpiral(384)
fs.writeFileSync('ulam-spiral.png', buffer)

function drawUlamSpiral(size) {
  const scale = 10
  const drawSize = size * scale
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
      const squareSize = moddifyValueUpper(divisorCount / maxCount, 1, 1) * size * 0.3
      ctx.fillStyle = `rgba(0, 0, ${(moddifyValueUpper(brightness, 1, 1)) * 255}, ${moddifyValueUpper(brightness, 1, 1) * 1})`
      ctx.fillRect(x * scale - squareSize / 2, y * scale - squareSize / 2, squareSize, squareSize)
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
      maxCount = currentCount
    }
  }
  return maxCount
}

function moddifyValue(value, exp, gain, bias) {
  let modValue = Math.pow(value, exp)
  modValue = modValue * gain
  modValue = modValue + bias
  return modValue
}

function moddifyValueUpper(value, exp, gain) {
  return moddifyValue(value, exp, gain, 1 - gain)
}
