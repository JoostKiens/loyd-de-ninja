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

export class PlayLevel extends Phaser.Scene {
	constructor() {
		super("PlayGame")
	}
	create() {
		var map = this.make.tilemap({ key: "level1" })
		var tileset = map.addTilesetImage("main_tiles", "mainTileset")
		var platform = map.createLayer("platform", tileset, 0, 300, )
		map.setCollisionFromCollisionGroup(true, true, platform)
		this.isRunning = false

		this.playerJumps = 0
		this.addPlayer({
			posX: gameOptions.playerStartPosition,
			posY: this.sys.canvas.height / 2,
		})

		this.player.setOnCollide((e) => {
      if (this.isRunning || e.collision.depth < 0.3) return
      console.log(e)
			// we needd to detect the proper object (platforms)
      this.isRunning = true
			this.run()
		})

		this.player.setOnCollideEnd((e) => {
			// this.stopRunning()
      if (!this.isRunning || e.collision.depth < 0.3) return
      console.log('stop', e)
      this.isRunning = false
		})

		this.matter.world.convertTilemapLayer(platform)
    console.log(map)
		this.matter.world.setBounds(map.widthInPixels, map.heightInPixels)

    var camera = this.cameras.main
    camera.startFollow(this.player)

		this.input.on("pointerdown", this.jump, this)
	}

	addPlayer({ posX, posY }) {
		const initrinsicNinjaHeight = 483
		const scale = (this.sys.canvas.height * 0.15) / initrinsicNinjaHeight
		this.player = this.matter.add
			.sprite(posX, posY, "ninja", "run/Run__000.png", {
        label: 'player'
				// restitution: 0,
				// chamfer: 10,
			})
			.setScale(scale)
			.setFixedRotation()
	}

	run() {
		this.player.anims.play("idle")
	}

	run() {
		this.player.anims.play("run")
		this.isRunning = true
	}

	// the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
	jump() {
		console.log(this.player)
		if (
			this.isRunning ||
			(this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
		) {
			if (this.isRunning) {
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

		this.player.x += 3
	}
}
