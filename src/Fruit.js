import Phaser from "phaser"

const fruitsMap = {
  broccoli: -100,
  orange: 50,
  chilli: 150,
  strawberry: 100,
	cheery: 75
}

export class Fruit extends Phaser.GameObjects.Container {
	constructor(scene, x, y, type) {
    super(scene, x - 32, y - 32)
    this.sprite = new Phaser.GameObjects.TileSprite(scene, 32, 32, 0, 0, "sprites", `${type}.png`)

    this.text = new Phaser.GameObjects.Text(scene, 0, 0, fruitsMap[type], {
			font: "30px ArmorPiercing, monospace",
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
		this.scene.sound.play("fruitSound")

		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			y: this.y -20,
			ease: "Sine.easeIn",
			duration: 600,
			delay: 500,
			onComplete: () => {
				this.destroy()
			}
		})
	}
}
