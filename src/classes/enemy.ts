import { Math, Scene } from "phaser"

import { EVENTS_NAME } from "../consts"
import { Actor } from "./actor"
import { Player } from "./player"
import { Text } from "./text"

export class Enemy extends Actor {
  private target: Player
  private AGRESSOR_RADIUS = 150
  private attackHandler: () => void
  private takeDamage: () => void
  private hpValue: Text

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    target: Player,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame)
    this.target = target
    this.hp = 200

    this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
      .setFontSize(10)
      .setOrigin(0.8, 0.5)

    this.attackHandler = () => {
      if (
        Math.Distance.BetweenPoints(
          { x: this.x, y: this.y },
          { x: this.target.x, y: this.target.y },
        ) < this.target.width
      ) {
        this.getDamage(75)
        this.hpValue.setText(this.hp.toString())

        this.disableBody(true, false)

        this.scene.time.delayedCall(300, () => {
          this.destroy()
        })
      }
    }

    this.takeDamage = () => {
      this.getDamage(25)
      this.hpValue.setText(this.hp.toString())
    }
    // ADD TO SCENE
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // PHYSICS MODEL
    this.getBody().setSize(16, 16)
    this.getBody().setOffset(0, 0)

    // EVENTS
    this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this)
    this.on("destroy", () => {
      this.scene.game.events.removeListener(EVENTS_NAME.attack, this.attackHandler)
    })
  }

  preUpdate(): void {
    this.hpValue.setPosition(this.x, this.y - this.height * 0.4)
    this.hpValue.setOrigin(0.8, 0.5)

    if (this.hp <= 0) {
      this.disableBody(true, false)
      this.scene.time.delayedCall(300, () => {
        this.destroy()
        this.hpValue.destroy()
      })
    }
    if (
      Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y },
      ) < this.AGRESSOR_RADIUS
    ) {
      this.getBody().setVelocityX(this.target.x - this.x)
      this.getBody().setVelocityY(this.target.y - this.y)
    } else {
      this.getBody().setVelocity(0)
    }
  }

  // update(): void {
  // }

  public setTarget(target: Player): void {
    this.target = target
  }
}
