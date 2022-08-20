import { Scene } from "phaser"

class BootScene extends Scene {
  constructor() {
    super("scene-boot")
  }

  preload() {
    this.load.spritesheet("player_handgun", "assets/player.png", {
      frameWidth: 66,
      frameHeight: 60,
    })
    this.load.image("bullet", "assets/bullet6.png")
    this.load.image("target", "assets/ball.png")
    this.load.image("background", "assets/underwater1.png")
  }

  create() {
    this.scene.start("scene-game")
  }
}

export default BootScene
