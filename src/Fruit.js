import Phaser from "phaser"

export class Fruit extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
    super(scene, x, y, 'cherry')
		this.name = 'cherry'

    scene.add.existing(this)
    scene.physics.world.enable(this)
    this.body.allowGravity = false
    console.log(this.body)
  }
}