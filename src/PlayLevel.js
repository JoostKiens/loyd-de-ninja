import Phaser from "phaser"

let gameOptions = {
	jumpVelocityY: 350,
	jumps: 2,
	baseVelocityX: 300,
	powerUpVelocityX: 800,
	maxVelocityX: 800,
	maxVelocityY: 800,
	decelerateInAir: 5,
	decelerateOnGround: 2.5
}
const gameHeight = 480

// TODO add a bunch more trees, logs and bushes
// TODO add points
// TODO add enemies
// TODO add fullscreen
export class PlayLevel extends Phaser.Scene {
	constructor() {
		super("PlayGame")
	}
	create() {
		this.playerJumps = 0
		this.isRunning = false
		this.hasStarted = false
		this.cameraPrevX = 0
		this.cameraVelocityX = 0
		this.speed = 0

		const map = this.make.tilemap({ key: "level2" })
		const width = map.widthInPixels
		const tileset = map.addTilesetImage(
			"bg_tileset",
			"mainTileset",
			16,
			16,
			1,
			2
		)
		const noaArtwork = map.addTilesetImage("noaArtwork", "noaArtwork")
		const farGrounds = map.addTilesetImage("farGrounds", "farGrounds")
		this.addBg()
		map.createLayer("noaLayer2", noaArtwork, 0, 0)
		map.createLayer("noaLayer1", noaArtwork, 0, 0)
		map.createLayer("trees", tileset, 0, 0)
		map.createLayer("farGrounds", farGrounds, 0, 0)
		map.createLayer("rockyBg", tileset, 0, 0)

		const platform = map.createLayer("platform", tileset, 0, 0)
		platform.setCollisionByProperty({ collides: true })

		// const debugGraphics = this.add.graphics().setAlpha(0.75)
		// platform.renderDebug(debugGraphics, {
		// 	tileColor: null, // Color of non-colliding tiles
		// 	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
		// 	faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
		// })


		const initrinsicNinjaHeight = 483
		const scale = (this.sys.canvas.height * 0.1) / initrinsicNinjaHeight
		this.player = this.physics.add
			.sprite(100, gameHeight / 2, "sprites", "run/Run__000.png", {
				label: "player",
			})
			// .setDrag(1000, 0)
			.setMaxVelocity(gameOptions.maxVelocityX, gameOptions.maxVelocityY)
			.setScale(scale)

		const powerUps = map.objects.find((x) => x.name === "powerUps")
		powerUps.objects.forEach(({ x, y }) => {
			this.addPowerUp({ posX: x, posY: y })
		})

		this.physics.add.collider(this.player, platform)

		const camera = this.cameras.main
		camera.setBounds(0, 0, width, gameHeight)
		camera.height = this.sys.canvas.height
		camera.roundPixels = true
		camera.zoom = this.sys.canvas.height / 480
		camera.startFollow(
			this.player,
			false,
			0.05,
			1,
			-this.sys.canvas.width / 8,
			0
		)
		this.input.on("pointerdown", this.jump, this)
	}


	addPowerUp({ posX, posY }) {
		const powerUp = this.physics.add
			.sprite(posX, posY, "fireball", "fireball_001.png", {
				label: "powerUp",
			})
			.anims.play("play")
			.setScale(0.5)
			.setImmovable(true)

		powerUp.body.allowGravity = false

		this.physics.add.overlap(
			this.player,
			powerUp,
			() => {
				this.speed = gameOptions.powerUpVelocityX
				powerUp.disableBody(true, true)
			},
			null,
			this
		)
	}

	run() {
		this.player.anims.play("run")
		this.isRunning = true
	}

	// the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
	// Should we move all this to update?
	jump() {
		const onGround = this.player.body.blocked.down
		if (
			onGround ||
			(this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
		) {
			if (onGround) this.playerJumps = 0
			const jumpsLeft = gameOptions.jumps - this.playerJumps
			this.player.setVelocityY(
				-(gameOptions.jumpVelocityY / gameOptions.jumps) * jumpsLeft
			)
			this.player.anims.play("jump")
			this.playerJumps++
		}
	}

	update(x) {
		const onGround = this.player.body.blocked.down
		const isSideBlocked =
			this.player.body.blocked.right || this.player.body.blocked.lef
		this.cameraVelocityX = this.cameras.main.scrollX - this.cameraPrevX
		if (this.player.y > this.sys.canvas.height) {
			this.scene.start("PlayGame")
		} else {
			this.player.setVelocityX(this.speed)
			this.clouds.tilePositionX += 0.15 * this.cameraVelocityX
			this.sea.tilePositionX += 0.25 * this.cameraVelocityX
		}

		this.speed = Math.max(
			gameOptions.baseVelocityX,
			this.speed -
				(onGround
					? gameOptions.decelerateOnGround
					: gameOptions.decelerateInAir)
		)
		this.cameraPrevX = this.cameras.main.scrollX

		if (onGround) {
			if (this.player.body.velocity.x !== 0 && !isSideBlocked)
				this.player.anims.play("run", true)
			else this.player.anims.play("idle", true)
		}
		else if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "run") {
			this.player.anims.stop()
		}
	}

	addBg() {
		const container = this.add.container(0, 0)
		const bg = this.add
			.tileSprite(
				0,
				0,
				this.sys.canvas.width,
				this.sys.canvas.height,
				"sprites",
				"bg.png"
			)
			.setOrigin(0, 0)
		const sky = this.add
			.tileSprite(
				0,
				480 - 92 - 304,
				this.sys.canvas.width,
				304,
				"sprites",
				"sky.png"
			)
			.setOrigin(0, 0)
		this.clouds = this.add
			.tileSprite(
				0,
				480 - 92 - 240,
				this.sys.canvas.width,
				240,
				"sprites",
				"clouds.png"
			)
			.setOrigin(0, 0)
		this.sea = this.add
			.tileSprite(0, 480 - 96, this.sys.canvas.width, 96, "sprites", "sea.png")
			.setOrigin(0, 0)

		container.add([bg, sky, this.clouds, this.sea]).setScrollFactor(0, 1)
	}
}
