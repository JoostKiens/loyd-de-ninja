import Phaser from "phaser"
import sky from "./assets/sky.png"
import sea from "./assets/sea.png"
import clouds from "./assets/clouds.png"
// import fruits from "./assets/fruits.png"
import farGrounds from "./assets/farGrounds.png"
import noaArtwork from "./assets/noaArtwork.png"
import mainTileset from './assets/main_tileset.png'

export class Preload extends Phaser.Scene {
	constructor() {
		super("Preload")
	}

	preload() {
		this.load.image("sky", sky)
		this.load.image("sea", sea)
		this.load.image("clouds", clouds)
		// this.load.image("fruits", fruits)
		this.load.image("farGrounds", farGrounds)
		this.load.image('mainTileset', mainTileset)
		this.load.image("noaArtwork", noaArtwork)
		this.load.multiatlas("ninja", "ninja_sprites.json", ".")
		this.load.multiatlas("fireball", "fireball.json", ".")
		this.load.multiatlas("explosion1", "explosion1.json", ".")
		this.load.tilemapTiledJSON("level2", "level_2.json")
	}

	create() {
		const explosion1 = this.anims.generateFrameNames("explosion1", {
			start: 0,
			end: 70,
			zeroPad: 4,
			prefix: "frame",
			suffix: ".png",
		})
		this.anims.create({
			key: "explode",
			frames: explosion1,
			frameRate: 60,
			repeat: 0,
		})

		const fireballFrames = this.anims.generateFrameNames("fireball", {
			start: 1,
			end: 8,
			zeroPad: 3,
			prefix: "fireball_",
			suffix: ".png",
		})
		this.anims.create({
			key: "play",
			frames: fireballFrames,
			frameRate: 24,
			repeat: -1,
		})

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
			frameRate: 24,
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

		this.scene.start("PlayGame")
	}
}
