import Phaser from "phaser"
import { Background } from './Background'
import { PowerUp } from './PowerUp'
import { Player } from './Player'
import { Fruit } from "./Fruit"
import { Score } from './Score'
import { JumpsLeft } from "./JumpsLeft"
import { GameOver } from './GameOver'

export class PlayLevel extends Phaser.Scene {
	constructor() {
		super("PlayGame")

		this.isGameOver = false
	}

	create() {
		this.cameraPrevX = 0
		this.scoreCount = { fruits: 0, distance: 0}

		this.background = new Background(this, 0, 0)
		const { platform, map } = this.createPlatform()
		this.player = new Player(this, 100, this.sys.canvas.height / 2)

		const fruitObjects = map.objects.find((x) => x.name === "fruits")
		this.fruits = fruitObjects.objects.map(({ x, y, type }) => new Fruit(this, x, y, type))

		const powerUpObjects = map.objects.find((x) => x.name === "powerUps")
		this.powerUps = powerUpObjects.objects.map(
			({ x, y }) => new PowerUp(this, x, y)
		)

		this.score = new Score(
			this,
			10,
			this.sys.canvas.height - 70,
			this.scoreCount.fruits + this.scoreCount.distance
		)

		this.jumpsLeft = new JumpsLeft(
			this,
			this.sys.canvas.width - 70,
			10,
			2 - this.player.currentJumps
		)

		// Player hits PowerUp
		this.physics.add.overlap(this.player, this.powerUps, (player, powerUp) => {
			player.powerUp()
			if (!powerUp.isHit) { powerUp.hit() }
		})

		// Player hits Fruit
		this.physics.add.overlap(this.player, this.fruits, (_, fruit) => {
			if (!fruit.isHit) {
				this.scoreCount.fruits += 100
				fruit.hit()
			}
		}, null, this)

		// Player walks on Platform
		this.physics.add.collider(this.player, platform)

		// Camera follows player
		const camera = this.cameras.main
		camera.setBounds(0, 0, map.widthInPixels, this.sys.canvas.height)
		camera.startFollow(this.player)

		// Jump on pointerdown
		this.input.on("pointerdown", () => {
			this.player.jump()
		})
	}

	update(x) {
		if (this.player.y > this.sys.canvas.height) {
			// Dead
			this.player.die()
			this.gameOver()
			// this.scene.start("PlayGame")
			return
		}

		this.player.update()
		this.background.update(this.cameras.main.scrollX - this.cameraPrevX)
		this.cameraPrevX = this.cameras.main.scrollX
		this.scoreCount.distance = Math.round(this.cameras.main.scrollX / 10)
		this.jumpsLeft.update(2 - this.player.currentJumps)

		this.score.update(this.scoreCount.fruits + this.scoreCount.distance)
	}

	createPlatform() {
		const map = this.make.tilemap({ key: "level1" })
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

		map.createLayer("noaLayer2", noaArtwork, 0, 0)
		map.createLayer("noaLayer1", noaArtwork, 0, 0)
		map.createLayer("trees", tileset, 0, 0)
		map.createLayer("farGrounds", farGrounds, 0, 0)
		map.createLayer("rockyBg", tileset, 0, 0)

		const platform = map.createLayer("platform", [tileset, noaArtwork], 0, 0)
		platform.setCollisionByProperty({ collides: true })
		return { platform, map }
	}

	gameOver() {
		if (!this.isGameOver) {
			this.isGameOver = true
			new GameOver(this)
		}
	}
}
