import Phaser from "phaser"
import platform from "./assets/platform.png"
import sky from './assets/sky.png'
import sea from "./assets/sea.png"
import clouds from "./assets/clouds.png"
import farGrounds from "./assets/far-grounds.png"

let game

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

window.onload = function () {
	// object containing configuration options
	let gameConfig = {
		type: Phaser.AUTO,
		width: 1334,
		height: 750,
		scene: [Preload, PlayGame],
		backgroundColor: 0x444444,

		// physics settings
		physics: {
			default: "arcade",
			arcade: { debug: true },
		},
	}
	game = new Phaser.Game(gameConfig)
	window.focus()
	resize()
	window.addEventListener("resize", resize, false)
}

class Preload extends Phaser.Scene {
	constructor() {
		super("Preload")
	}

	preload() {
		this.load.image("platform", platform)
    this.load.image("sky", sky)
    this.load.image("sea", sea)
    this.load.image("clouds", clouds)
    this.load.image("farGrounds", farGrounds)
		this.load.multiatlas("ninja", "ninja_sprites.json", ".")
	}

  create() {
		const runframes = this.anims.generateFrameNames("ninja", {
			start: 0,
			end: 9,
			zeroPad: 3,
			prefix: "run/Run__",
			suffix: ".png",
		})
		this.anims.create({
			key: "run",
			frames: runframes,
			frameRate: 38,
			repeat: -1,
		})

		const jumpFrames = this.anims.generateFrameNames("ninja", {
			start: 0,
			end: 9,
			zeroPad: 3,
			prefix: "jump/Jump__",
			suffix: ".png",
		})

		this.anims.create({
			key: "jump",
			frames: jumpFrames,
			frameRate: 10,
			repeat: 0,
		})

    console.log('done')
    this.scene.start("PlayGame")
	}
}

// playGame scene
class PlayGame extends Phaser.Scene {
	constructor() {
		super("PlayGame")
	}
	create() {

    console.log(this)
    const initrinsicSkyHeight = this.textures.list.sky.source[0].height
    this.add
			.tileSprite(0, 0, game.config.width, initrinsicSkyHeight, "sky")
			.setOrigin(0, 0)
			.setScale(game.config.height / initrinsicSkyHeight)


    const initrinsicSeaHeight = this.textures.list.sea.source[0].height
    this.seaBg = this.add
			.tileSprite(
				0,
				game.config.height,
				game.config.width,
				initrinsicSeaHeight,
				"sea"
			)
			.setOrigin(0, 1)
			.setScale((game.config.height * 0.25) / initrinsicSeaHeight)

    const intrinsicCloudsHeight = this.textures.list.clouds.source[0].height
    this.cloudBg = this.add
			.tileSprite(
				0,
				game.config.height * 0.75,
				game.config.width,
				intrinsicCloudsHeight,
				"clouds"
			)
			.setOrigin(0, 1)
			.setScale((game.config.height * 0.5) / intrinsicCloudsHeight)

    // we need to add this in a group and animate it
    const intrinsicFarGroundsHeight = this.textures.list.farGrounds.source[0].height
    this.farGroundsBg = this.add
			.image(game.config.width / 2, game.config.height, "farGrounds")
			.setOrigin(0, 1)
			.setScale((game.config.height * 0.2) / intrinsicFarGroundsHeight)

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
		this.addPlatform(game.config.width, game.config.width / 2)
    this.addPlayer({ posX: gameOptions.playerStartPosition, posY:	game.config.height / 2 })

		// setting collisions between the player and the platform group
		this.physics.add.collider(this.player, this.platformGroup, () => this.run())

		// checking for input
		this.input.on("pointerdown", this.jump, this)
	}

	addPlayer({ posX, posY }) {
		// adding the player;
		this.player = this.physics.add.sprite(
			posX, posY,
			"ninja",
			"run/Run__000.png"
		)
		this.player.setScale(0.25)
		this.player.setGravityY(gameOptions.playerGravity)
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
				game.config.height * 0.8,
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
		if (this.player.y > game.config.height) {
			this.scene.start("PlayGame")
		}
		this.player.x = gameOptions.playerStartPosition

		// recycling platforms
		let minDistance = game.config.width
		this.platformGroup.getChildren().forEach(function (platform) {
			let platformDistance =
				game.config.width - platform.x - platform.displayWidth / 2
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
				game.config.width + nextPlatformWidth / 2
			)
		}

    // parallax
    this.cloudBg.tilePositionX += 0.075
    this.seaBg.tilePositionX += 0.15
    this.farGroundsBg.x -= 0.5
	}
}
function resize() {
	let canvas = document.querySelector("canvas")
	let windowWidth = window.innerWidth
	let windowHeight = window.innerHeight
	let windowRatio = windowWidth / windowHeight
	let gameRatio = game.config.width / game.config.height
	if (windowRatio < gameRatio) {
		canvas.style.width = windowWidth + "px"
		canvas.style.height = windowWidth / gameRatio + "px"
	} else {
		canvas.style.width = windowHeight * gameRatio + "px"
		canvas.style.height = windowHeight + "px"
	}
}
