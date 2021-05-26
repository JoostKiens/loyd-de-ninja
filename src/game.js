import Phaser from "phaser"
import { Preload } from './Preload'
import { PlayLevel } from "./PlayLevel"

let game
window.onload = function () {
	let gameConfig = {
		type: Phaser.AUTO,
		width: window.innerWidth,
		height: window.innerHeight,
		scene: [Preload, PlayLevel],
		transparent: true,
		autoFocus: true,
		physics: {
			default: "matter",
			matter: {
				gravity: { y: 1 },
				enableSleep: true,
				debug: true,
			},
		},
	}
	game = new Phaser.Game(gameConfig)
	resize()
	window.addEventListener("resize", resize, false)
}

function resize() {
	game.scale.resize(
		Math.round((window.innerWidth / window.innerHeight) * window.innerHeight),
		window.innerHeight
	)
}
