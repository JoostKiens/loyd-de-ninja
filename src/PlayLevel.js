import Phaser from "phaser"

let gameOptions = {
	jumpForce: 9,
	jumps: 2,
}
const gameHeight = 480

// TOD add a bunch more trees, logs and bushes
// TODO add points
// TODO add enemies

// TODO add sensors on bottpm of player
// TODO add physics to sides of tiles
// TODO make player bounce if hit from the side
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
		const tileset = map.addTilesetImage("bg_tileset", "mainTileset", 16, 16, 1, 2)
    const noaArtwork = map.addTilesetImage("noaArtwork", "noaArtwork")
		const farGrounds = map.addTilesetImage("farGrounds", "farGrounds")
		this.addBg()
    map.createLayer("noaLayer2", noaArtwork, 0, 0)
    map.createLayer("noaLayer1", noaArtwork, 0, 0)
    map.createLayer("trees", tileset, 0, 0)
    map.createLayer("farGrounds", farGrounds, 0, 0)
    map.createLayer("rockyBg", tileset, 0, 0)

		//const platform = this.physics.add.staticGroup()
		const platformLayer = map.createStaticLayer("platform", tileset, 0, 0)
		platformLayer.setCollisionByProperty({ collides: true })

		//platform.add(platformLayer)

		// this.physics.world.enable([platformLayer])
		// this.matter.world.convertTilemapLayer(platform)
    // this.matter.world.setBounds(map.widthInPixels, 480)

    const powerUps = map.objects.find((x) => x.name === "powerUps")
		powerUps.objects.forEach(({ x, y }) => {
			this.addPowerUp({ posX: x, posY: y })
		})

		this.addPlayer({
			posX: 100,
			posY: 100,
		})

		// this.physics.world.enable([this.player])

		this.physics.add.collider(platformLayer, this.player, (a, b) => {
			console.log("collide", a, b)
		})


		// this.player.setOnCollide((pair) => {
		// 	if (
		// 		!this.isRunning &&
		// 		pair.bodyA.gameObject.tile &&
		// 		pair.bodyA.gameObject.tile.layer.name === "platform"
		// 	) {
		// 		this.run()
		// 		if (!this.hasStarted) this.speed = 3
		// 		this.hasStarted = true
		// 	}
		// })

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

	addPlayer({ posX, posY }) {
		const initrinsicNinjaHeight = 483
		const scale = (this.sys.canvas.height * 0.1) / initrinsicNinjaHeight
		this.player = this.physics.add
			.sprite(posX, posY, "sprites", "run/Run__000.png", {
				label: "player",
				// chamfer: { radius: [160, 80, 160, 80] },
				// restitution: 0.25,
				// friction: 0
			})
			.setScale(scale)
			//.setFixedRotation()
	}

  addPowerUp({ posX, posY }) {
    const powerUp = this.add
			.sprite(posX, posY, "fireball", "fireball_001.png", {
				label: "powerUp",
				isStatic: true,
				isSensor: true,
				circleRadius: 50,
				onCollideCallback: ({ bodyB }) => {
          if (bodyB.label === "player") {
            powerUp.visible = false
            this.add
							.sprite(posX, posY, "explosion1", "frame_0000.png")
							.anims.play("explode")
            this.speed = 15
          }
        }
			})
			.setScale(0.5)
			.anims.play("play")
		this.physics.world.enable([powerUp])
  }

	run() {
		this.player.anims.play("run")
		this.isRunning = true
	}

	// the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
	jump() {
		console.log('jump')
		if (
			true
			// this.isRunning ||
			//(this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
		) {
			if (this.isRunning) {
				this.playerJumps = 0
			}
      this.isRunning = false
			this.player.setVelocityY(gameOptions.jumpForce * -20)
			this.player.anims.play("jump")
      //this.player.anims.play("jumpThrow")
			this.playerJumps++
		}
	}

	update(x) {
		this.cameraVelocityX = this.cameras.main.scrollX - this.cameraPrevX
		if (this.player.y > this.sys.canvas.height) {
      this.isRunning = false
			this.scene.start("PlayGame")
		} else {
      this.player.x += this.speed
			this.clouds.tilePositionX += 0.15 * this.cameraVelocityX
			this.sea.tilePositionX += 0.25 * this.cameraVelocityX
    }

		this.speed = Math.max(1.5, this.speed - 0.05)
		this.cameraPrevX = this.cameras.main.scrollX
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
