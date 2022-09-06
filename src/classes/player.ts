import { Input, Scene } from "phaser"
import { Level1 } from "../scenes"
import { EVENTS_NAME, GameStatus } from "../consts"
import { Actor } from "./actor"
import { Enemy } from "./enemy"
import { Text } from "./text"
import Bullet from "./bullet"

export class Player extends Actor {
  private keyW: Input.Keyboard.Key
  private keyA: Input.Keyboard.Key
  private keyS: Input.Keyboard.Key
  private keyD: Input.Keyboard.Key
  private keySpace: Input.Keyboard.Key
  private hpValue: Text

  private pointer: Phaser.Input.Pointer

  private reticle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "king")

    this.keyW = this.scene.input.keyboard.addKey("W")
    this.keyA = this.scene.input.keyboard.addKey("A")
    this.keyS = this.scene.input.keyboard.addKey("S")
    this.keyD = this.scene.input.keyboard.addKey("D")

    this.keySpace = this.scene.input.keyboard.addKey(32)

    this.reticle = this.scene.physics.add
      .sprite(100, 100, "crosshair")
      .setDepth(1)
      .setDisplaySize(20, 20)
      .setTint(0x85ff00)

    this.keySpace.on("down", (event: KeyboardEvent) => {
      this.anims.play("attack", true)
      this.scene.game.events.emit(EVENTS_NAME.attack)
    })

    this.setDepth(1)

    const playerBullets = this.scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    })

    const sceneData: any = this.scene

    this.scene.input.setDefaultCursor("none")

    this.scene.input.on(
      "pointerdown",
      (pointer: Phaser.Input.Pointer, time: any, lastFired: any) => {
        // if (this.active === false) return;

        const bullet = playerBullets.get().setActive(true).setVisible(true)
        if (bullet) {
          bullet.fire(this, this.pointer)
          // this.scene.physics.add.collider(sceneData.enemies, bullet, enemyHitCallback)
        }
      },
    )

    this.pointer = this.scene.input.activePointer

    this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
      .setFontSize(12)
      .setOrigin(0.8, 0.5)

    this.getBody().setSize(30, 30).setOffset(8, 0)

    this.initAnimations()

    this.on("destroy", () => {
      this.keySpace.removeAllListeners()
    })
  }

  update(): void {
    this.getBody().setVelocity(0)

    if (this.keyW.isDown) {
      this.body.velocity.y = -110
      !this.anims.isPlaying && this.anims.play("run", true)
    }

    if (this.keyA.isDown) {
      this.body.velocity.x = -110
      this.checkFlip()
      this.getBody().setOffset(48, 15)
      !this.anims.isPlaying && this.anims.play("run", true)
    }

    if (this.keyS.isDown) {
      this.body.velocity.y = 110
      !this.anims.isPlaying && this.anims.play("run", true)
    }

    if (this.keyD.isDown) {
      this.body.velocity.x = 110
      this.checkFlip()
      this.getBody().setOffset(15, 15)
      !this.anims.isPlaying && this.anims.play("run", true)
    }

    this.hpValue.setPosition(this.x, this.y - this.height * 0.4)
    this.hpValue.setOrigin(0.8, 0.5)

    this.reticle.x = this.pointer.worldX
    this.reticle.y = this.pointer.worldY

    this.pointer.updateWorldPoint(this.scene.cameras.main)
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

    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNames("walk", {
        prefix: "walk_",
        start: 0,
        end: 7,
      }),
      frameRate: 12,
    })
  }

  public getDamage(value?: number): void {
    super.getDamage(value)
    this.hpValue.setText(this.hp.toString())

    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE)
    }
  }
}

const enemyHitCallback = (enemyHit: any, bulletHit: any) => {
  enemyHit.takeDamage()
  bulletHit.destroy()
}
