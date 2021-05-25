import Phaser from "phaser"
import { Preload } from './Preload'
import { PlayLevel } from "./PlayLevel"

let game
window.onload = function () {
	let gameConfig = {
		type: Phaser.AUTO,
		width: window.innerWidth,
		height: 480,
		scene: [Preload, PlayLevel],
		transparent: true,
		physics: {
			default: "matter",
			matter: {
				gravity: { y: 1 },
				enableSleep: true,
				debug: false,
			}
		},
	}
	game = new Phaser.Game(gameConfig)
	window.focus()
	resize()
	window.addEventListener("resize", resize, false)
}

function resize() {
	const ratio = window.innerWidth / window.innerHeight
  game.scale.resize(Math.round(ratio * 480), 480)
}
