import Phaser from "phaser"

export class Score extends Phaser.GameObjects.Container {
	constructor(scene, x, y, score) {
		super(scene, x, y)

		this.text = new Phaser.GameObjects.Text(scene, 0, 0, score, {
			font: "60px VT323",
			fill: "#ffffff",
			stroke: "#000",
			strokeThickness: 8,
		})


		this.add([this.text])
		this.name = `score`
    this.setScrollFactor(0)

		scene.add.existing(this)

	}
  update(score) {
    this.text.setText(score)
  }
}
