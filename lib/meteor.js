import Vec from './vec'

export default class Meteor {
  pos = null
  density = 0

  constructor(x, y) {
    this.pos = new Vec(x, y)
    this.density = Math.random() * 30 + 10
    this.radius = this.density * 5
  }

  update() {
    const spd = 15 * (1 - this.density / 50)

    this.pos.x += spd
    this.pos.y += spd * (9 / 16)
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.density, 0, Math.PI * 2)

    ctx.fillStyle = `hsl(210, 100%, 75%)`
    ctx.fill()
  }
}
