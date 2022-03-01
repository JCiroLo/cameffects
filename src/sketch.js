let MODE = 'ascii'
let characters = '@%#*+=◦-:.'
let video
let asciiDiv
let fontSize = 8
const pxRate = 6
const windowWidth = Math.floor(window.innerWidth / pxRate)
const windowHeight = Math.floor(window.innerHeight / pxRate)
const layout = Math.min(windowWidth, windowHeight)

function stop () {
  noLoop()
}

function play () {
  loop()
}

function resize (direction) {
  if (fontSize === 1) {
    if (direction === 1) {
      fontSize *= 2
    }
  } else {
    if (direction === 1) {
      fontSize *= 2
    } else {
      fontSize /= 2
    }
  }
}

function handleInput ({ value }) {
  if (value === '') {
    characters = '@%#*+=◦-:. '
  } else {
    characters = value
  }
}

function changeMode ({ value }) {
  if (value === 'ascii') {
    characters = '@%#*+=◦-:. '
  } else {
    characters = ' '
  }
  MODE = value
}

function setup () {
  noCanvas()
  frameRate(10)
  video = createCapture(VIDEO)
  video.size(layout, layout)
  video.hide()
  asciiDiv = createDiv()
    .class('container')
    .parent('app')
}

function draw () {
  background(220)
  rect(0, 00, 100, 100)
  video.loadPixels()
  asciiDiv.style('font-size', `${8 * fontSize}px`).style('line-height', `.5`)

  let asciiImage = ''
  for (let j = 0; j < video.height; j += fontSize) {
    asciiImage += `<div class="row">`
    for (let i = 0; i < video.width; i += fontSize) {
      const pixelIndex = (i + j * video.width) * 4
      const r = video.pixels[pixelIndex + 0]
      const g = video.pixels[pixelIndex + 1]
      const b = video.pixels[pixelIndex + 2]
      const avg = (r + g + b) / 3

      const len = characters.length
      const charIndex = floor(map(avg, 0, 255, len, 0))

      if (MODE === 'ascii') {
        asciiImage += `<span style="color: rgb(${r}, ${g}, ${b})">`
        const c = characters.charAt(charIndex)
        if (c == ' ') {
          asciiImage += '&nbsp;'
        } else {
          asciiImage += c
        }
        asciiImage += '</span>'
      } else if (MODE === 'squares') {
        const avg = (r + g + b) / 3
        const rotation = floor(map(avg, 0, 255, 0, 360))

        asciiImage += `<span class="transition" style="
          background-color: rgb(${r}, ${g}, ${b}); 
          width: ${5 * fontSize}px; 
          height: ${5 * fontSize}px;
          transform: rotate(${rotation}deg);
        ">${characters[0]}</span>`
      } else if (MODE === 'circles') {
        const avg = (r + g + b) / 3
        const rotation = floor(map(avg, 0, 255, 0, 360))

        asciiImage += `<span class="transition" style="
          background-color: rgb(${r}, ${g}, ${b}); 
          width: ${5 * fontSize}px; 
          height: ${5 * fontSize}px;
          border-radius: 50%;
          transform: rotate(${rotation}deg);
        ">${characters[0]}</span>`
      }
    }
    asciiImage += `</div>`
  }
  asciiDiv.html(asciiImage)
}
