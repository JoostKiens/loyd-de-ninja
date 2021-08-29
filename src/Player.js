import Phaser from "phaser"

const initialJumpVelocityY = 350
const maxJumps = 2
const decelerateInAir = 3.5
const decelerateOnGround = 5.5
const baseVelocityX = 300
const powerUpVelocityX = 50

export class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "sprites", "run/Run__000.png")
		this.name = "player"
		this.isRunning = false
		this.currentJumps = 0
		this.speed = 0
		this.isDead = false

		scene.add.existing(this)
		scene.physics.world.enable(this)
	}

	update() {
		const onGround = this.body.blocked.down
		const isSideBlocked = this.body.blocked.right || this.body.blocked.left

		if (onGround) {
			if (this.body.velocity.x !== 0 && !isSideBlocked)
				this.anims.play("run", true)
			else this.anims.play("idle", true)
		} else if (this.anims.currentAnim?.key === "run") {
			this.anims.stop()
		}

		this.speed = this.isDead ? 0 : Math.max(
			baseVelocityX,
			this.speed - (onGround ? decelerateOnGround : decelerateInAir)
		)

		this.body.setVelocityX(this.speed)
	}

	powerUp() {
		this.speed += powerUpVelocityX
	}

	jump() {
		const onGround = this.body.blocked.down
		if (onGround || (this.currentJumps > 0 && this.currentJumps < maxJumps)) {
			if (onGround) this.currentJumps = 0
			this.body.setVelocityY(
				-(initialJumpVelocityY / maxJumps) * (maxJumps - this.currentJumps)
			)
			this.anims.play("jump", true)
			this.currentJumps++
		}
	}

	die() {
		if (this.isDead) return

		this.isDead = true
		this.active = false
		this.body.setVelocityX(0)
	}
}