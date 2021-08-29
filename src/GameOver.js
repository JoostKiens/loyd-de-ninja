import Phaser from "phaser"

export class GameOver extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0)
    const width = scene.cameras.main.width
		const height = scene.cameras.main.height

    const bg = new Phaser.GameObjects.Graphics(scene)
		bg.fillStyle(0x212121, 0.3)
		bg.fillRect(0, 0, width, height)

    this.scene.sound.play("dieSound")

    const text = new Phaser.GameObjects.Text(scene, width / 2, height / 2, "Game Over", {
			font: "160px VT323, monospace",
			fill: "#ffffff",
			stroke: "#000",
			strokeThickness: 10,
		}).setOrigin(0.5)

    const restart = new Phaser.GameObjects.Text(
			scene,
			width / 2,
			height / 2 + 100,
			"Restart",
			{
				font: "40px VT323, monospace",
				fill: "#ffffff",
				stroke: "#000",
				strokeThickness: 8,
			}
		)
			.setOrigin(0.5)
			.setInteractive({
				useHandCursor: true,
			})

    this.add([bg, text, restart])
    this.setScrollFactor(0)
		scene.input.on("pointerdown", () => {
			window.location.reload()
		})

    scene.add.existing(this)
  }
}