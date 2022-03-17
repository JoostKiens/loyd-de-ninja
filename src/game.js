import Phaser from "phaser"
import { Preload } from './Preload'
import { PlayLevel } from "./PlayLevel"
import "./styles.css"
window.onload = function () {
	new Phaser.Game({
		type: Phaser.AUTO,
		scene: [Preload, PlayLevel],
		backgroundColor: '#212121',
		scale: {
			parent: 'game-container',
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: 800,
			height: 480,
		},
		physics: {
			default: "arcade",
			arcade: {
				gravity: { y: 400 },
				debug: false,
			},
		},
	})
}
