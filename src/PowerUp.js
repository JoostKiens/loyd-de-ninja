import Phaser from "phaser"

export class PowerUp extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
    super(scene, x, y, "fireball")
		this.name = 'powerUp'
		this.anims.play("play")
		this.setScale(0.5)

    scene.add.existing(this)
    scene.physics.world.enable(this)
    this.body.allowGravity = false
    // console.log(this.body)
  }
}