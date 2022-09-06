import Phaser from "phaser"

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  private speed = 1
  private born = 0
  private direction = 0
  private xSpeed = 0
  private ySpeed = 0

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "bullet")

    this.speed = 0.2
    this.born = 0
    this.direction = 0
    this.xSpeed = 0
    this.ySpeed = 0
  }

  fire(shooter: any, target: any): void {
    this.setScale(0.5, 0.5)
    this.setPosition(shooter.x, shooter.y)
    this.direction = Math.atan((target.worldX - this.x) / (target.worldY - this.y))

    if (target.worldY >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction)
      this.ySpeed = this.speed * Math.cos(this.direction)
    } else {
      this.xSpeed = -this.speed * Math.sin(this.direction)
      this.ySpeed = -this.speed * Math.cos(this.direction)
    }

    this.rotation = Phaser.Math.Angle.Between(shooter.x, shooter.y, target.worldX, target.worldY)
    this.born = 0
  }

  update(time: any, delta: any): void {
    this.x += this.xSpeed * delta
    this.y += this.ySpeed * delta
    this.born += delta
    if (this.born > 2200) {
      this.setActive(false)
      this.setVisible(false)
    }
  }
}
