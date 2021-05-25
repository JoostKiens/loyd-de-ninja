import Phaser from "phaser"
import sky from "./assets/sky.png"
import sea from "./assets/sea.png"
import clouds from "./assets/clouds.png"
import farGrounds from "./assets/farGrounds.png"
import noaArtwork from "./assets/noaArtwork.png"
import mainTileset from './assets/main_tileset.extruded.png'
import logo from "./assets/logo.png"

export class Preload extends Phaser.Scene {
	constructor() {
		super("Preload")
	}

	// TODO: destroy everything
	preload() {
		const width = this.cameras.main.width
		const height = this.cameras.main.height
		this.contentBg = this.add.graphics()
		this.contentBg.fillStyle(0x222222, 0.8)
		this.contentBg.fillRect(
			(width - width / 2.5) / 2,
			height / 3,
			width / 2.5,
			height / 3
		)

		this.loadingUI()

		this.load.image("logo", logo)
		this.load.image("sky", sky)
		this.load.image("sea", sea)
		this.load.image("clouds", clouds)
		this.load.image("farGrounds", farGrounds)
		this.load.image('mainTileset', mainTileset)
		this.load.image("noaArtwork", noaArtwork)
		this.load.multiatlas("ninja", "ninja_sprites.json", ".")
		this.load.multiatlas("fireball", "fireball.json", ".")
		this.load.multiatlas("explosion1", "explosion1.json", ".")
		this.load.tilemapTiledJSON("level2", "level_2.json")
	}

	create() {
		const { width, height } = this.textures.get("logo").getSourceImage()
		const logo = this.add
			.image(this.cameras.main.width / 2, this.cameras.main.width / 5, "logo")
		logo.displayWidth = this.cameras.main.width / 2
		logo.displayHeight = (logo.displayWidth / width) * height

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
	}

	loadingUI() {
		const width = this.cameras.main.width
		const height = this.cameras.main.height
		const loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: "Loading...",
			style: {
				font: "20px monospace",
				fill: "#ffffff",
			},
		})
		loadingText.setOrigin(0.5, 0.5)

		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 + height / 12,
			text: "0%",
			style: {
				font: "18px monospace",
				fill: "#ffffff",
			},
		})
		percentText.setOrigin(0.5, 0.5)

		const progressBoxWidth = width / 3
		const progressBoxHeight = progressBoxWidth / 6
		const progressBarMargin = progressBoxHeight / 6
		const progressBox = this.add.graphics()
		const progressBar = this.add.graphics()

		progressBox.fillStyle(0x222222, 0.8)
		progressBox.fillRect(
			(width - progressBoxWidth) / 2,
			(height - progressBoxHeight) / 2,
			progressBoxWidth,
			progressBoxHeight
		)

		this.load.on("progress", (value) => {
			percentText.setText(parseInt(value * 100) + "%")
			progressBar.clear()
			progressBar.fillStyle(0xffffff, 1)
			progressBar.fillRect(
				(width - progressBoxWidth) / 2 + progressBarMargin,
				(height - progressBoxHeight) / 2 + progressBarMargin,
				(progressBoxWidth - progressBarMargin * 2) * value,
				progressBoxHeight - progressBarMargin * 2
			)
		})

		this.load.on("complete", () => {
			progressBar.destroy()
			progressBox.destroy()
			loadingText.destroy();
			percentText.destroy();
			this.startUI()
		})
	}

	startUI() {
		const width = this.cameras.main.width
		const height = this.cameras.main.height
		const startText = this.make.text({
			x: width / 2,
			y: height / 2,
			text: "Start",
			style: {
				font: "50px monospace",
				fill: "#ffffff",
			},
		})
		startText.setOrigin(0.5, 0.5)
		startText
			.setInteractive({
    		useHandCursor: true
			})
			.on("pointerdown", () => {
				startText.destroy()
				this.scene.start("PlayGame")
			})
	}
}
