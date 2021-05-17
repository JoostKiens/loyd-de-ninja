import Phaser from 'phaser'
import sky from "./assets/sky.png"
import mountain from "./assets/mountain.png"
import tile from "./assets/tile.png"
import ground from "./assets/ground.png"

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
  backgroundColor: '0x92D7E7',
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
	physics: {
		default: "arcade",
		arcade: { debug: true },
	},
}

new Phaser.Game(config)

function preload () {
   this.load.image("sky", sky)
   this.load.image("mountain", mountain)
   this.load.image("tile", tile)
   this.load.image("ground", ground)
   this.load.multiatlas("ninja", "ninja_sprites.json", ".")
}

let skyBg, mountainBg, groundBg, ninjaCharacter
function create () {
  skyBg = this.add.tileSprite(400, 300, 3072, 1536, "sky")
  skyBg.setScale(600 / 1536)
  mountainBg = this.add.tileSprite(400, 300, 3072, 1536, "mountain")
	mountainBg.setScale(600 / 1536)
  groundBg = this.add.tileSprite(400, 550, 3072, 208, "ground")
	groundBg.setScale(800 / 1536)

  ninjaCharacter = this.physics.add.sprite(this.sys.game.config.width / 2, 0, "ninja", "run/Run__000.png")
  ninjaCharacter.setScale(0.25)
  ninjaCharacter.setGravityY(400)
  ninjaCharacter.setBounce(0.15)

  this.physics.add.existing(groundBg)
  groundBg.body.setImmovable()
  this.isMoving = false
  this.physics.world.setFPS(120)
  console.log(groundBg)


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
		frameRate: 38,
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
		key: "jumpUp",
		frames: jumpFrames,
		frameRate: 10,
		repeat: 0,
	})

  const attackFrames = this.anims.generateFrameNames("ninja", {
		start: 0,
		end: 9,
		zeroPad: 3,
		prefix: "attack/Attack__",
		suffix: ".png",
	})
	this.anims.create({
		key: "attack",
		frames: attackFrames,
		frameRate: 10,
		repeat: 0,
	})

  this.physics.add.collider(ninjaCharacter, groundBg, () => {
		if (
			ninjaCharacter.anims?.currentAnim?.key !== "run" &&
			!ninjaCharacter.anims?.isPlaying
		) {
      console.log('run')
			ninjaCharacter.anims.play("run")
      this.isMoving = true
		}
	})

  this.input.keyboard.on('keydown-SPACE', () => {
    console.log('jump')
    ninjaCharacter.anims.play("jumpUp")
    ninjaCharacter.setVelocityY(-400)
  })

  this.input.keyboard.on("keydown-ENTER", () => {
		console.log("attack")
    console.log(ninjaCharacter.anims)
    this.isMoving = false
    //ninjaCharacter.anims.currentAnim.pause()
		ninjaCharacter.anims.play("attack")
		ninjaCharacter.setVelocityY(-100)
	})

  //this.cameras.main.setBounds(0, 0, skyBg.displayWidth, skyBg.displayHeight)
	this.cameras.main.startFollow(ninjaCharacter, false, 1, 1, 0, 140)
}

function update () {
  if (this.isMoving) {
    skyBg.tilePositionX += 0.5
		mountainBg.tilePositionX += 1
		groundBg.tilePositionX += 12
  }
}