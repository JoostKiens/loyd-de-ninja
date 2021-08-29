import Phaser from "phaser"



export class PowerUp extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y)
		this.name = "powerUp"
    this.isHit = false

		this.fireball = new Fireball(scene, 0, 0)
    this.explosion = new Explosion(scene, 0, 0)
    this.explosion.visible = false

    this.text = new Phaser.GameObjects.Text(scene, 0, 0, 'Power Up', {
			font: "24px VT323, monospace",
			fill: "#ffffff",
			stroke: "#000",
			strokeThickness: 4,
		})
    this.text.setOrigin(0, 1)

		this.add([this.fireball, this.explosion, this.text])

		scene.add.existing(this)
		scene.physics.world.enable(this)
		this.body.allowGravity = false
	}

  hit() {
    this.isHit = true
    this.explosion.visible = true
    this.explosion.anims.play('explode')
    this.fireball.visible = false

    	this.scene.tweens.add({
				targets: this.text,
				alpha: 0,
        scale: 3,
        x: -100,
				ease: "Sine.easeIn",
				duration: 200,
			})
  }
}

class Fireball extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "fireball")
		this.name = "fireball"
		this.anims.play("play")
		this.setScale(0.5)
    this.setOrigin(0)

		scene.add.existing(this)
	}
}

class Explosion extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "explosion1")
		this.name = "explosion"
    // this.anims.play("explode")
		this.setOrigin(0.2)

		scene.add.existing(this)
	}
}