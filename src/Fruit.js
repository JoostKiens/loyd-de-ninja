import Phaser from "phaser"

const fruitsMap = {
  broccoli: -100,
  orange: 50,
  chilli: 150,
  strawberry: 100
}

export class Fruit extends Phaser.GameObjects.Container {
	constructor(scene, x, y, type) {
    super(scene, x - 32, y - 32)
    this.sprite = new Phaser.GameObjects.Sprite(scene, 32, 32, type)
    this.text = new Phaser.GameObjects.Text(scene, 0, 0, fruitsMap[type], {
			font: "20px monospace",
			fill: "#ffffff",
			stroke: "#000",
			strokeThickness: 4,
		})
    this.text.visible = false
    this.add([this.sprite, this.text])
		this.name = `fruit - ${type}`
		this.isHit = false

		scene.add.existing(this)
		scene.physics.world.enable(this)
		this.body.allowGravity = false
	}

	hit() {
		this.isHit = true
    this.text.visible = true
    this.sprite.visible = false
	}
}
