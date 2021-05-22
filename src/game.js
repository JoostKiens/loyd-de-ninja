import Phaser from "phaser"
import { Preload } from './Preload'
import { PlayLevel } from "./PlayLevel"

let game


// How to properly scale stuff
// - game.scale.resize
// - add a resize listener to the game and set physics bounds

window.onload = function () {
	// object containing configuration options
	let gameConfig = {
		type: Phaser.AUTO,
		width: window.innerWidth,
		height: window.innerHeight,
		scene: [Preload, PlayLevel],
		backgroundColor: 0x444444,
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
  game.scale.resize(window.innerWidth, window.innerHeight)
}
