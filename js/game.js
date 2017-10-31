const height = 600;
const width = 800;

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var platforms;
var player;
var cursors;
var stars;

function create() {
  // initialize Physics and world
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'sky')

  platforms = game.add.group();
  platforms.enableBody = true
  var ground = platforms.create(0, game.world.height - 64, 'ground')
  ground.scale.setTo(2, 2)
  ground.body.immovable = true
  var ledge = platforms.create(400, 400, 'ground')
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground')
  ledge.body.immovable = true;

  // initialize player
  player = game.add.sprite(32, game.world.height - 150, 'dude')
  game.physics.arcade.enable(player)

  player.body.bounce.y = 0.2
  player.body.gravity.y = 2000
  player.body.collideWorldBounds = true

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true)
  player.animations.add('right', [5, 6, 7, 8], 10, true)

  cursors = game.input.keyboard.createCursorKeys();
  stars = game.add.group();

  stars.enableBody = true;

  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++) {
      var star = stars.create(i * 70, 0, 'star');
      star.body.gravity.y = 100;
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }
}

function collectStar (player, star) {
    star.kill();
}

function update() {
  var hitPlatform = game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(stars, platforms);
  var collected = game.physics.arcade.overlap(player, stars, collectStar, null, this);

  player.body.velocity.x = 0;
  const travelSpeed = 300

  if (cursors.left.isDown) {
      player.body.velocity.x = -travelSpeed;
      player.animations.play('left');
  } else if (cursors.right.isDown) {
    player.body.velocity.x = travelSpeed;
    player.animations.play('right');
  } else {
    player.animations.stop();
    player.frame = 4;
  }

  if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
    player.body.velocity.y = -1000;
  }
}

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', { preload, create, update })
