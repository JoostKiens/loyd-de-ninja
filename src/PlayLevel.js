import Phaser from "phaser"

let gameOptions = {
	jumpForce: 9,
	jumps: 2,
}

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
		const tileset = map.addTilesetImage("bg_tileset", "mainTileset", 16, 16, 1, 2)
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

    const powerUps = map.objects.find((x) => x.name === "powerUps")
		powerUps.objects.forEach(({ x, y }) => {
			this.addPowerUp({ posX: x, posY: y })
			console.log(x)
		})

		this.addPlayer({
			posX: 100,
			posY: 100,
		})

		this.player.setOnCollide(() => {
      // we need to filter platform
      if (!this.isRunning) {
        this.run()
        this.hasStarted = true
      }
		})

    const camera = this.cameras.main
    camera.height = this.sys.canvas.height
    camera.roundPixels = true
    camera.zoom = this.sys.canvas.height / 480
    camera.setBounds(0, 0, width, 480)
    camera.startFollow(
			this.player,
			false,
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

  addPowerUp({ posX, posY }) {
    const powerUp = this.matter.add
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
          }
        }
			})
			.setScale(0.5)
			.anims.play("play")
      console.log("powerUp", powerUp)
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

	update(x) {
		if (this.player.y > this.sys.canvas.height) {
      this.isRunning = false
			this.scene.start("PlayGame")
		} else {
      if (this.hasStarted) this.player.x += 3
    }
	}
}
