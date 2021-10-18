import Vec from './vec'

export default class Particle {
  pos = null
  base = null

  size = 0
  density = 0

  alpha = 1
  light = 100

  constructor(x, y) {
    this.pos = new Vec(x, y)
    this.base = new Vec(this.pos.x, this.pos.y)

    this.size = 1
    this.density = Math.random() * 30 + 1

    this.alpha = 1
    this.light = 100
  }

  update(m) {
    const dx = m.pos.x - this.pos.x
    const dy = m.pos.y - this.pos.y
    const d = Math.sqrt(dx * dx + dy * dy)

    const fx = dx / d
    const fy = dy / d
    const mx = m.radius

    const force = (mx - d) / (mx * 1.5)
    const dirX = fx * force * this.density * m.density
    const dirY = fy * force * this.density * m.density

    if (d < mx) {
      this.light = 75

      this.pos.x -= dirX
      this.pos.y -= dirY
    } else {
      this.light += this.light / 75

      if (this.pos.x != this.base.x) {
        const dx = this.pos.x - this.base.x
        this.pos.x -= dx / 10
      }

      if (this.pos.y != this.base.y) {
        const dy = this.pos.y - this.base.y
        this.pos.y -= dy / 10
      }
    }

    if (this.light > 100) this.light = 100
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)

    ctx.fillStyle = `hsl(210, 100%, ${this.light}%)`
    ctx.fill()
  }
}
