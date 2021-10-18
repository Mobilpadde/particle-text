import Vec from './lib/vec'
import Particle from './lib/particle'
import Meteor from './lib/meteor'

import './style.css'

const c = document.getElementById('board')
const ctx = c.getContext('2d')

let w = window.innerWidth
let h = window.innerHeight

c.width = w
c.height = h

ctx.font = 'bold 30px monospace'
ctx.fillStyle = 'white'
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'

ctx.fillText('Particle', 90, 35)
ctx.fillText('Space', 90, 65)

ctx.rect(0, 0, 180, 90)
ctx.strokeStyle = 'red'
ctx.stroke()
const textCoords = ctx.getImageData(0, 0, 180, 90)

let particles = []
let meteors = []

const init = () => {
  particles = new Array(500)
    .fill(null)
    .map(() => new Particle(Math.random() * w, Math.random() * h))

  const yMax = textCoords.height
  const xMax = textCoords.width

  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < xMax; x++) {
      const alpha = textCoords.data[y * 4 * textCoords.width + x * 4 + 3]
      if (alpha > 128 && Math.random() > 0.5) {
        let tx = x * 10
        let ty = y * 10

        particles.push(new Particle(tx, ty))
      }
    }
  }
}
init()

const shoot = () => {
  const m = new Meteor(0, 0)
  m.pos.x = -m.density * 2
  m.pos.y = -m.density * 2

  if (Math.random() < 0.5) {
    m.pos.x = Math.random() * w
  } else {
    m.pos.y = Math.random() * h
  }

  meteors.push(m)
}

const render = () => {
  ctx.clearRect(0, 0, w, h)

  connect()
  meteors.filter((m) => {
    m.update()
    m.draw(ctx)

    particles.forEach((p) => {
      p.update(m)
    })

    return m.pos.x > w || m.pos.y > h
  })

  particles.forEach((p) => {
    if (meteors.length === 0)
      p.update({ radius: 0, density: 0, pos: new Vec(0, 0) })
    p.draw(ctx)
  })

  if (Math.random() < 0.0075) shoot()
  requestAnimationFrame(render)
}
requestAnimationFrame(render)

function connect() {
  for (let aIdx = 0; aIdx < particles.length; aIdx++) {
    for (let bIdx = aIdx + 1; bIdx < particles.length; bIdx++) {
      const a = particles[aIdx]
      const b = particles[bIdx]

      const dx = a.pos.x - b.pos.x
      const dy = a.pos.y - b.pos.y
      const d = Math.sqrt(dx * dx + dy * dy)

      if (d < 25) {
        ctx.beginPath()
        ctx.moveTo(a.pos.x, a.pos.y)
        ctx.lineTo(b.pos.x, b.pos.y)

        const alpha = 1 - d / 60
        ctx.strokeStyle = `hsla(210, 100%, ${Math.min(
          a.light,
          b.light,
        )}%, ${alpha})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }
  }
}
