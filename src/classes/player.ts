import { Input, Scene } from "phaser"
import { Level1 } from "../scenes"

import { EVENTS_NAME, GameStatus } from "../consts"
import { Actor } from "./actor"
import { Enemy } from "./enemy"
import { Text } from "./text"

export class Player extends Actor {
  private keyW: Input.Keyboard.Key
  private keyA: Input.Keyboard.Key
  private keyS: Input.Keyboard.Key
  private keyD: Input.Keyboard.Key
  private keySpace: Input.Keyboard.Key
  private hpValue: Text

  private reticle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "king")

    this.keyW = this.scene.input.keyboard.addKey("W")
    this.keyA = this.scene.input.keyboard.addKey("A")
    this.keyS = this.scene.input.keyboard.addKey("S")
    this.keyD = this.scene.input.keyboard.addKey("D")

    this.keySpace = this.scene.input.keyboard.addKey(32)

    this.reticle = this.scene.physics.add.sprite(100, 100, "ball")

    this.keySpace.on("down", (event: KeyboardEvent) => {
      this.anims.play("attack", true)
      this.scene.game.events.emit(EVENTS_NAME.attack)
    })

    const playerBullets = this.scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    })

    this.reticle.setOrigin(0.5, 0.5).setDisplaySize(15, 15)

    const sceneData: any = this.scene

    window.game.canvas.addEventListener("mousedown", function () {
      window.game.input.mouse.requestPointerLock()
    })
    this.scene.input.on(
      "pointerdown",
      (pointer: any, time: any, lastFired: any) => {
        // if (this.active === false) return;

        const bullet = playerBullets.get().setActive(true).setVisible(true)
        if (bullet) {
          bullet.fire(this, this.reticle)
          this.scene.physics.add.collider(sceneData.enemies, bullet, enemyHitCallback)
        }
      },
      this.scene,
    )

    this.scene.input.on(
      "pointermove",
      (pointer: any) => {
        if (this.scene.input.mouse.locked) {
          this.reticle.x += pointer.movementX
          this.reticle.y += pointer.movementY
        }
      },
      this,
    )

    this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
      .setFontSize(12)
      .setOrigin(0.8, 0.5)

    this.getBody().setSize(30, 30)
    this.getBody().setOffset(8, 0)

    this.initAnimations()

    this.on("destroy", () => {
      this.keySpace.removeAllListeners()
    })
  }

  update(): void {
    this.getBody().setVelocity(0)

    if (this.keyW?.isDown) {
      this.body.velocity.y = -110
      !this.anims.isPlaying && this.anims.play("run", true)
    }

    if (this.keyA?.isDown) {
      this.body.velocity.x = -110
      this.checkFlip()
      this.getBody().setOffset(48, 15)
      !this.anims.isPlaying && this.anims.play("run", true)
    }

    if (this.keyS?.isDown) {
      this.body.velocity.y = 110
      !this.anims.isPlaying && this.anims.play("run", true)
    }

    if (this.keyD?.isDown) {
      this.body.velocity.x = 110
      this.checkFlip()
      this.getBody().setOffset(15, 15)
      !this.anims.isPlaying && this.anims.play("run", true)
    }

    this.hpValue.setPosition(this.x, this.y - this.height * 0.4)
    this.hpValue.setOrigin(0.8, 0.5)

    // this.constrainReticle()
  }

  private initAnimations(): void {
    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNames("a-king", {
        prefix: "run-",
        end: 7,
      }),
      frameRate: 8,
    })

    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNames("a-king", {
        prefix: "attack-",
        end: 2,
      }),
      frameRate: 8,
    })
  }

  public getDamage(value?: number): void {
    super.getDamage(value)
    this.hpValue.setText(this.hp.toString())

    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE)
    }
  }

  // private constrainReticle() {
  //   var distX = this.reticle.x - this.x
  //   var distY = this.reticle.y - this.y

  //   if (distX > 800) this.reticle.x = this.x + 800
  //   else if (distX < -800) this.reticle.x = this.x - 800

  //   if (distY > 600) this.reticle.y = this.y + 600
  //   else if (distY < -600) this.reticle.y = this.y - 600
  // }
}

const enemyHitCallback = (enemyHit: any, bulletHit: any) => {
  enemyHit.takeDamage()
  bulletHit.destroy()
}
class Bullet extends Phaser.Physics.Arcade.Sprite {
  private speed = 1
  private born = 0
  private direction = 0
  private xSpeed = 0
  private ySpeed = 0

  constructor(scene: Scene) {
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
    this.direction = Math.atan((target.x - this.x) / (target.y - this.y))

    if (target.y >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction)
      this.ySpeed = this.speed * Math.cos(this.direction)
    } else {
      this.xSpeed = -this.speed * Math.sin(this.direction)
      this.ySpeed = -this.speed * Math.cos(this.direction)
    }

    this.rotation = Phaser.Math.Angle.Between(shooter.x, shooter.y, target.x, target.y)
    this.born = 0
  }

  update(time: any, delta: any): void {
    this.x += this.xSpeed * delta
    this.y += this.ySpeed * delta
    this.born += delta
    if (this.born > 1800) {
      this.setActive(false)
      this.setVisible(false)
    }
  }
}
