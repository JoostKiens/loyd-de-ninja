import Phaser from "phaser"
import platform from "./assets/platform.png"
import sky from "./assets/sky.png"
import sea from "./assets/sea.png"
import clouds from "./assets/clouds.png"
import farGrounds from "./assets/far-grounds.png"

export class Preload extends Phaser.Scene {
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
    this.load.multiatlas("bg", "bg_sprites.json", ".")
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

		this.scene.start("PlayGame")
	}
}
