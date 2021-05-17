import Phaser from 'phaser'

// global game options
let gameOptions = {
	platformStartSpeed: 350,
	spawnRange: [100, 350],
	platformSizeRange: [50, 250],
	playerGravity: 900,
	jumpForce: 400,
	playerStartPosition: 200,
	jumps: 2,
}

export class PlayGame extends Phaser.Scene {
	constructor() {
		super("PlayGame")
	}
	create() {
    this.addBackgroundTiles()
		// we need to add this in a group and animate it
		const intrinsicFarGroundsHeight = this.textures.list.farGrounds.source[0].height
		this.farGroundsBg = this.add
			.image(this.sys.canvas.width / 2, this.sys.canvas.height, "farGrounds")
			.setOrigin(0, 1)
			.setScale((this.sys.canvas.height * 0.2) / intrinsicFarGroundsHeight)

		// group with all active platforms.
		this.platformGroup = this.add.group({
			// once a platform is removed, it's added to the pool
			removeCallback: function (platform) {
				platform.scene.platformPool.add(platform)
			},
		})

		// pool
		this.platformPool = this.add.group({
			// once a platform is removed from the pool, it's added to the active platforms group
			removeCallback: function (platform) {
				platform.scene.platformGroup.add(platform)
			},
		})

		// number of consecutive jumps made by the player
		this.playerJumps = 0
		this.isMoving = false

		// adding a platform to the game, the arguments are platform width and x position
		this.addPlatform(this.sys.canvas.width, this.sys.canvas.width / 2)
		this.addPlayer({
			posX: gameOptions.playerStartPosition,
			posY: this.sys.canvas.height / 2,
		})

		// setting collisions between the player and the platform group
		this.physics.add.collider(this.player, this.platformGroup, () => this.run())

		// checking for input
		this.input.on("pointerdown", this.jump, this)
	}

	addPlayer({ posX, posY }) {
		// adding the player;
		this.player = this.physics.add.sprite(
			posX,
			posY,
			"ninja",
			"run/Run__000.png"
		)
		this.player.setScale(0.25)
		this.player.setGravityY(gameOptions.playerGravity)
	}

  addBackgroundTiles() {
    const initrinsicSkyHeight = this.textures.list.sky.source[0].height
		this.add
			.tileSprite(0, 0, this.sys.canvas.width, initrinsicSkyHeight, "sky")
			.setOrigin(0, 0)
			.setScale(this.sys.canvas.height / initrinsicSkyHeight)

		const initrinsicSeaHeight = this.textures.list.sea.source[0].height
		this.seaBg = this.add
			.tileSprite(
				0,
				this.sys.canvas.height,
				this.sys.canvas.width,
				initrinsicSeaHeight,
				"sea"
			)
			.setOrigin(0, 1)
			.setScale((this.sys.canvas.height * 0.25) / initrinsicSeaHeight)

		const intrinsicCloudsHeight = this.textures.list.clouds.source[0].height
		this.cloudBg = this.add
			.tileSprite(
				0,
				this.sys.canvas.height * 0.75,
				this.sys.canvas.width,
				intrinsicCloudsHeight,
				"clouds"
			)
			.setOrigin(0, 1)
			.setScale((this.sys.canvas.height * 0.5) / intrinsicCloudsHeight)

  }

	// the core of the script: platform are added from the pool or created on the fly
	addPlatform(platformWidth, posX) {
		let platform
		if (this.platformPool.getLength()) {
			platform = this.platformPool.getFirst()
			platform.x = posX
			platform.active = true
			platform.visible = true
			this.platformPool.remove(platform)
		} else {
			platform = this.physics.add.sprite(
				posX,
				this.sys.canvas.height * 0.8,
				"platform"
			)
			platform.setImmovable(true)
			platform.setVelocityX(gameOptions.platformStartSpeed * -1)
			this.platformGroup.add(platform)
		}
		platform.displayWidth = platformWidth
		this.nextPlatformDistance = Phaser.Math.Between(
			gameOptions.spawnRange[0],
			gameOptions.spawnRange[1]
		)
	}

	run() {
		if (
			this.player.anims?.currentAnim?.key !== "run" &&
			!this.player.anims?.isPlaying
		) {
			console.log("run")
			this.player.anims.play("run")
			this.isMoving = true
		}
	}

	// the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
	jump() {
		if (
			this.player.body.touching.down ||
			(this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
		) {
			if (this.player.body.touching.down) {
				this.playerJumps = 0
			}
			this.player.setVelocityY(gameOptions.jumpForce * -1)
			this.player.anims.play("jump")
			this.playerJumps++
		}
	}

	update() {
		// game over
		if (this.player.y > this.sys.canvas.height) {
			this.scene.start("PlayGame")
		}
		this.player.x = gameOptions.playerStartPosition

		// recycling platforms
		let minDistance = this.sys.canvas.width
		this.platformGroup.getChildren().forEach(function (platform) {
			let platformDistance =
				this.sys.canvas.width - platform.x - platform.displayWidth / 2
			minDistance = Math.min(minDistance, platformDistance)
			if (platform.x < -platform.displayWidth / 2) {
				this.platformGroup.killAndHide(platform)
				this.platformGroup.remove(platform)
			}
		}, this)

		// adding new platforms
		if (minDistance > this.nextPlatformDistance) {
			var nextPlatformWidth = Phaser.Math.Between(
				gameOptions.platformSizeRange[0],
				gameOptions.platformSizeRange[1]
			)
			this.addPlatform(
				nextPlatformWidth,
				this.sys.canvas.width + nextPlatformWidth / 2
			)
		}

		// parallax
		this.cloudBg.tilePositionX += 0.075
		this.seaBg.tilePositionX += 0.15
		this.farGroundsBg.x -= 0.5
	}
}