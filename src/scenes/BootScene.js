import { Scene } from "phaser";

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }

  preload() {
    // Load any assets here from your assets directory
    // this.load.image("cat-like", "assets/cat-like-creature.png");
    // Load in images and sprites
    this.load.spritesheet("player_handgun", "assets/player.png", {
      frameWidth: 66,
      frameHeight: 60,
    }); // Made by tokkatrain: https://tokkatrain.itch.io/top-down-basic-set
    this.load.image("bullet", "assets/bullet6.png");
    this.load.image("target", "assets/ball.png");
    this.load.image("background", "assets/underwater1.png");
  }

  create() {
    this.scene.start("scene-game");
  }
}

export default BootScene;
