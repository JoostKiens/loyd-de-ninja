import Phaser from "phaser"
import { Preload } from './Preload'
import { PlayGame } from "./PlayGame"

let game


window.onload = function () {
	// object containing configuration options
	let gameConfig = {
		type: Phaser.AUTO,
		width: 1334,
		height: 750,
		scene: [Preload, PlayGame],
		backgroundColor: 0x444444,

		// physics settings
		physics: {
			default: "arcade",
			arcade: { debug: true },
		},
	}
	game = new Phaser.Game(gameConfig)
	window.focus()
	resize()
	window.addEventListener("resize", resize, false)
}

function resize() {
	let canvas = document.querySelector("canvas")
	let windowWidth = window.innerWidth
	let windowHeight = window.innerHeight
	let windowRatio = windowWidth / windowHeight
	let gameRatio = game.config.width / game.config.height
	if (windowRatio < gameRatio) {
		canvas.style.width = windowWidth + "px"
		canvas.style.height = windowWidth / gameRatio + "px"
	} else {
		canvas.style.width = windowHeight * gameRatio + "px"
		canvas.style.height = windowHeight + "px"
	}
}
