import Phaser from "phaser"

let gameOptions = {
	jumpForce: 9,
	jumps: 2,
}

// @TODO
// V. prevent stop on smooth surface
// V. properly detect onCollide and setOnCollideEnd
  // detect is on platform
  // set platform to isStatic
// V. load other layers
// V. properly scale
// V. fix size of world
// V. create a dead zone
// 5. implement parallax
// V. add Noa's artwork to tilemap
// V. Fix flicker
// V. Fix grid

export class PlayLevel extends Phaser.Scene {
	constructor() {
		super("PlayGame")
    this.playerJumps = 0
    this.isRunning = false
    this.hasStarted = false
	}
	create() {
    var map = this.make.tilemap({ key: "level2" })
    const width = map.widthInPixels

    this.add
			.image(0, 0, "sky")
			.setOrigin(0, 0)
			.setDisplaySize(width, this.sys.canvas.height)
		const tileset = map.addTilesetImage("bg_tileset", "mainTileset")
    const sea = map.addTilesetImage("sea", "sea")
    const clouds = map.addTilesetImage("clouds", "clouds")
    const noaArtwork = map.addTilesetImage("noaArtwork", "noaArtwork")
    const farGrounds = map.addTilesetImage("farGrounds", "farGrounds")
    map.createLayer("clouds", clouds, 0, 0)
    map.createLayer("sea", sea, 0, 0)
    map.createLayer("noaLayer2", noaArtwork, 0, 0)
    map.createLayer("noaLayer1", noaArtwork, 0, 0)
    map.createLayer("trees", tileset, 0, 0)
    map.createLayer("farGrounds", farGrounds, 0, 0)
    map.createLayer("rocky_bg", tileset, 0, 0)
		const platform = map.createLayer("platform", tileset, 0, 0)

		platform.setCollisionFromCollisionGroup()
		this.matter.world.convertTilemapLayer(platform)
    this.matter.world.setBounds(map.widthInPixels, this.sys.canvas.height)

		this.addPlayer({
			posX: this.sys.canvas.width / 7,
			posY: this.sys.canvas.height / 2,
		})

		this.player.setOnCollide(() => {
      // we need to filter platform
      if (!this.isRunning) {
        this.run()
        this.hasStarted = true
      }
		})

    const camera = this.cameras.main
    camera.setBounds(0, 0, width, this.sys.canvas.height)
    camera.startFollow(
			this.player,
			true,
			0.05,
			1,
			-this.sys.canvas.width / 4,
			0
		)
		this.input.on("pointerdown", this.jump, this)
	}

	addPlayer({ posX, posY }) {
		const initrinsicNinjaHeight = 483
		const scale = (this.sys.canvas.height * 0.1) / initrinsicNinjaHeight
		this.player = this.matter.add
			.sprite(posX, posY, "ninja", "run/Run__000.png", {
        label: 'player',
        chamfer: { radius: [160, 80, 160, 80] },
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
		if (this.player.y > this.sys.canvas.height) {
      this.isRunning = false
			this.scene.start("PlayGame")
		} else {
      if (this.hasStarted) this.player.x += 3
    }
	}
}
