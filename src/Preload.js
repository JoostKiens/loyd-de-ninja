import Phaser from "phaser"
import farGrounds from "./assets/farGrounds.png"
import noaArtwork from "./assets/noaArtwork.png"
import mainTileset from './assets/main_tileset.extruded.png'
import fruitSound from "./assets/fruit.mp3"
import dieSound from "./assets/die.mp3"
import powerUpSound from "./assets/powerUp.mp3"
import logo from "./assets/logo.png"

export class Preload extends Phaser.Scene {
	constructor() {
		super("Preload")
	}

	preload() {
		const width = this.sys.canvas.width
		const height = this.sys.canvas.height
		this.contentBg = this.add.graphics()
		this.contentBg.fillStyle(0x212121)
		this.contentBg.fillRect(
			(width - width / 2.5) / 2,
			height / 3,
			width / 2.5,
			height / 3
		)

		console.log(this.contentBg)

		this.loadingUI()

		this.load.image("logo", logo)
		this.load.image("farGrounds", farGrounds)
		this.load.image('mainTileset', mainTileset)
		this.load.image("noaArtwork", noaArtwork)
		this.load.multiatlas("sprites", "sprites.json", ".")
		this.load.multiatlas("fireball", "fireball.json", ".")
		this.load.multiatlas("explosion1", "explosion1.json", ".")
		this.load.tilemapTiledJSON("level1", "level_3.json")
		this.load.audio("powerUpSound", powerUpSound)
		this.load.audio("fruitSound", fruitSound)
		this.load.audio("dieSound", dieSound)
	}

	create() {
		// console.log(this.powerUpSound)
		//this.sound.decodeAudio(this.powerUpSound)
		// this.sound.decodeAudio("powerUpSound")
		// this.sound.decodeAudio(powerUp)
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

		// Move to PowerUp
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

		const runframes = this.anims.generateFrameNames("sprites", {
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

		this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNames("sprites", {
				start: 0,
				end: 9,
				zeroPad: 3,
				prefix: "idle/Idle__",
				suffix: ".png",
			}),
			frameRate: 24,
			repeat: -1,
		})

		const jumpFrames = this.anims.generateFrameNames("sprites", {
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

		// const jumpThrowFrames = this.anims.generateFrameNames("sprites", {
		// 	start: 0,
		// 	end: 9,
		// 	zeroPad: 3,
		// 	prefix: "jumpThrow/Jump_Throw__",
		// 	suffix: ".png",
		// })

		// this.anims.create({
		// 	key: "jumpThrow",
		// 	frames: jumpThrowFrames,
		// 	frameRate: 10,
		// 	repeat: 0,
		// })
	}

	loadingUI() {
		const width = this.cameras.main.width
		const height = this.cameras.main.height

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
			this.startUI()
		})
	}

	startUI() {
		// Make this a button component which extends a custom uiText component
		this.button = new GradientText({
			scene: this,
			x: this.sys.canvas.width / 2,
			y: 300,
			text: "Start",
			onClick: () => {
				this.button.destroy()
				this.scene.start("PlayGame")
			},
		})

		this.add.existing(this.button)

		// this.add.register('myButton', Button)
		// this.add.myButton({
		// 	scene: this,
		// 	x: this.sys.canvas.width / 2,
		// 	y: 300,
		// 	text: "Start",
		// 	onClick: () => {
		// 		this.button.destroy()
		// 		this.scene.start("PlayGame")
		// 	},
		// })

		console.log(this.add)

	}
	// 	const startText = this.make
	// 		.text({
	// 			x: this.sys.canvas.width / 2,
	// 			y: 300,
	// 			text: "Start",
	// 			style: {
	// 				font: "50px ArmorPiercing",
	// 				fill: "#ffffff",
	// 				stroke: "#000",
	// 				strokeThickness: 8,
	// 				///shadow: new Phaser.GameObjects.Text.TextShadow(0, 0, '#fff', 20)
	// 				// .G0, 0, '#ffffff', 4
	// 			},
	// 		})
	// 		.setOrigin(0.5, 0.5)
	// 		.setInteractive({
	// 			useHandCursor: true,
	// 		})
	// 		.on("pointerdown", () => {
	// 			startText.destroy()
	// 			this.scene.start("PlayGame")
	// 		})

	// 		var grd = startText.context.createLinearGradient(
	// 			0,
	// 			0,
	// 			0,
	// 			startText.height
	// 		)

	// 		//  Add in 2 color stops
	// 		grd.addColorStop(0, "#8ED6FF")
	// 		grd.addColorStop(1, "#004CB3")
	// 		startText.setFill(grd)
	// }
}

class GradientText extends Phaser.GameObjects.Text {
	constructor({scene, x, y, text, onClick}) {
		super(scene, x, y, text, {
			font: "50px ArmorPiercing",
			fill: "#ffffff",
			stroke: "#000",
			strokeThickness: 8,
		})

		this.setOrigin(0.5, 0.5)

		if (onClick) {
			this.setInteractive({
				useHandCursor: true,
			})
			this.on("pointerover", () => {
				this.scale = 1.1
			})
			this.on("pointerout", () => {
				this.scale = 1
			})
			this.on("pointerdown", onClick)
		}

		const grd = this.context.createLinearGradient(
			0,
			0,
			0,
			this.height
		)

		//  Add in 2 color stops
		grd.addColorStop(0, "#8ED6FF")
		grd.addColorStop(1, "#004CB3")
		this.setFill(grd)
	}
}