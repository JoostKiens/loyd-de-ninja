import Phaser from "phaser"

// global game options
// we need to make all these relative to height
let gameOptions = {
	platformStartSpeed: 350,
	spawnRange: [100, 350],
	platformSizeRange: [50, 550],
	playerGravity: 900,
	jumpForce: 9,
	playerStartPosition: 200,
	jumps: 3,
}

// @TODO
// V. prevent stop on smooth surface
// V. properly detect onCollide and setOnCollideEnd
  // detect is on platform
  // set platform to isStatic
// 2. load other layers
// V. properly scale
// 4. create a dead zone
// 5. implement parallax
// 6. add Noa's artwork to tilemap
// 7. Fix flicker
// 8. Fix grid

export class PlayLevel extends Phaser.Scene {
	constructor() {
		super("PlayGame")
    this.playerJumps = 0
    this.isRunning = false
	}
	create() {
    var map = this.make.tilemap({ key: "level2" })
    const scaleFactor = this.sys.canvas.height / map.heightInPixels
    this.add
			.image(0, 0, "sky")
			.setOrigin(0, 0)
			.setDisplaySize(map.widthInPixels, this.sys.canvas.height)
		const tileset = map.addTilesetImage("bg_tileset", "mainTileset")
    const sea = map.addTilesetImage("sea", "sea")
    const clouds = map.addTilesetImage("clouds", "clouds")
    map.createLayer("clouds", clouds, 0, 0).setScale(scaleFactor, scaleFactor)
    map.createLayer("sea", sea, 0, 0).setScale(scaleFactor, scaleFactor)
    map.createLayer("trees", tileset, 0, 0).setScale(scaleFactor, scaleFactor)
    map
			.createLayer("rocky_bg", tileset, 0, 0)
			.setScale(scaleFactor, scaleFactor)
		const platform = map
			.createLayer("platform", tileset, 0, 0)
			.setScale(scaleFactor, scaleFactor)

		platform.setCollisionFromCollisionGroup()
		this.matter.world.convertTilemapLayer(platform)
    this.matter.world.setBounds(map.widthInPixels, map.heightInPixels)

		//playerJumps = 0
		this.addPlayer({
			posX: gameOptions.playerStartPosition,
			posY: this.sys.canvas.height / 2,
		})

		this.player.setOnCollide(() => {
      if (!this.isRunning) this.run()
		})

    var camera = this.cameras.main
    camera.startFollow(this.player)
    camera.setLerp(1, 0)
    camera.setBounds(0, 0, map.widthInPixels, this.sys.canvas.height)
		this.input.on("pointerdown", this.jump, this)
	}

	addPlayer({ posX, posY }) {
		const initrinsicNinjaHeight = 483
		const scale = (this.sys.canvas.height * 0.15) / initrinsicNinjaHeight
		this.player = this.matter.add
			.sprite(posX, posY, "ninja", "run/Run__000.png", {
        label: 'player',
        chamfer: { radius: 80 },
				restitution: 0.25,
			})
			.setScale(scale)
			.setFixedRotation()
	}

	run() {
		this.player.anims.play("run")
		this.isRunning = true
	}

	// the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
	jump() {
		if (
			this.isRunning ||
			(this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
		) {
			if (this.isRunning) {
				this.playerJumps = 0
			}
      this.isRunning = false
			this.player.setVelocityY(gameOptions.jumpForce * -1)
			this.player.anims.play("jump")
			this.playerJumps++
		}
	}

	update() {
		// game over, need to improve ths
		if (this.player.y > this.sys.canvas.height) {
			this.scene.start("PlayGame")
		}

		this.player.x += 5
	}
}
