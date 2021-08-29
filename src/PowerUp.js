import Phaser from "phaser"



export class PowerUp extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y)
		this.name = "powerUp"
    this.isHit = false

		this.fireball = new Fireball(scene, 0, 0)
    this.explosion = new Explosion(scene, 0, 0)
    this.explosion.visible = false
		this.add([this.fireball, this.explosion])

		scene.add.existing(this)
		scene.physics.world.enable(this)
		this.body.allowGravity = false
	}

  hit() {
    console.log('hit')
    this.isHit = true
    this.explosion.visible = true
    this.explosion.anims.play('explode')
    this.fireball.visible = false
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