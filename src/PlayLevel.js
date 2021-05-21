import Phaser from "phaser"

// global game options
// we need to make all these relative to height
let gameOptions = {
	platformStartSpeed: 350,
	spawnRange: [100, 350],
	platformSizeRange: [50, 550],
	playerGravity: 900,
	jumpForce: 400,
	playerStartPosition: 200,
	jumps: 3,
}

export class PlayLevel extends Phaser.Scene {
	constructor() {
		super("PlayGame")
	}
	create() {
    //this.addBackgroundTiles()

		this.map = this.add.tilemap("level1")
    this.map.addTilesetImage("main_tiles", "mainTileset")
    this.map.addTilesetImage("fruits", "fruits")

    var map = this.make.tilemap({ key: "level1" })
		var tileset = map.addTilesetImage("main_tiles", "mainTileset")
		var layer = map.createLayer("platform", tileset, 0, 300)
    console.log(layer)
    map.setCollisionFromCollisionGroup(true, true, layer)


		this.playerJumps = 0
		this.addPlayer({
			posX: gameOptions.playerStartPosition,
			posY: this.sys.canvas.height / 2,
		})

		// setting collisions between the player and the platform group
    this.physics.add.collider(this.player, layer, () => this.run())

		// checking for input
		this.input.on("pointerdown", this.jump, this)
    //this.platformLayer.resizeWorld()
	}

	addPlayer({ posX, posY }) {
		const initrinsicNinjaHeight = 483
		const scale = (this.sys.canvas.height * 0.15) / initrinsicNinjaHeight
		this.player = this.physics.add
			.sprite(posX, posY, "ninja", "run/Run__000.png")
			.setScale(scale)
		this.player.setGravityY(gameOptions.playerGravity)
	}

	run() {
		if (
			this.player.anims?.currentAnim?.key !== "run" &&
			!this.player.anims?.isPlaying
		) {
			this.player.anims.play("run")
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

	addBackgroundTiles() {
		// this.textures.get('sky')
		const initrinsicSkyHeight = this.textures.list.sky.source[0].height
		const skyScale = (this.sys.canvas.height * 0.5) / initrinsicSkyHeight
		this.add
			.tileSprite(
				0,
				0,
				this.sys.canvas.width / skyScale,
				initrinsicSkyHeight,
				"sky"
			)
			.setOrigin(0, 0)
			.setScale(skyScale)

		const initrinsicSeaHeight = this.textures.list.sea.source[0].height
		const seaScale = (this.sys.canvas.height * 0.25) / initrinsicSeaHeight
		this.seaBg = this.add
			.tileSprite(
				0,
				this.sys.canvas.height,
				this.sys.canvas.width / seaScale,
				initrinsicSeaHeight,
				"sea"
			)
			.setOrigin(0, 1)
			.setScale(seaScale)

		const initrinsicCloudHeight = this.textures.list.clouds.source[0].height
		const cloudScale = (this.sys.canvas.height * 0.5) / initrinsicCloudHeight
		this.cloudBg = this.add
			.tileSprite(
				0,
				this.sys.canvas.height * 0.75,
				this.sys.canvas.width / cloudScale,
				initrinsicCloudHeight,
				"clouds"
			)
			.setOrigin(0, 1)
			.setScale(cloudScale)
	}

	update() {
		// game over
		if (this.player.y > this.sys.canvas.height) {
			this.scene.start("PlayGame")
		}
		this.player.x = gameOptions.playerStartPosition
	}
}
