import Phaser from "phaser"

export class Background extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y)

		const bg = scene.add
			.tileSprite(
				0,
				0,
				scene.sys.canvas.width,
				scene.sys.canvas.height,
				"sprites",
				"bg.png"
			)
			.setOrigin(0, 0)
		const sky = scene.add
			.tileSprite(
				0,
				480 - 92 - 304,
				scene.sys.canvas.width,
				304,
				"sprites",
				"sky.png"
			)
			.setOrigin(0, 0)
		this.clouds = scene.add
			.tileSprite(
				0,
				480 - 92 - 240,
				scene.sys.canvas.width,
				240,
				"sprites",
				"clouds.png"
			)
			.setOrigin(0, 0)
		this.sea = scene.add
			.tileSprite(0, 480 - 96, scene.sys.canvas.width, 96, "sprites", "sea.png")
			.setOrigin(0, 0)

		this.add([bg, sky, this.clouds, this.sea]).setScrollFactor(0, 1)

		scene.children.add(this)
	}

	update(cameraVelocityX) {
		this.clouds.tilePositionX += 0.15 * cameraVelocityX
		this.sea.tilePositionX += 0.25 * cameraVelocityX
	}
}