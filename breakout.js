const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
        }
    }
}

new Phaser.Game(config);

let paddle;
let keys;
let ball;
let hasBallLaunched = false;
const BALL_SPEED = -400

function preload() {
    this.load.image("paddle", "assets/paddle.png");
    this.load.image("ball", "assets/ball.png");
    this.load.image("brick", "assets/brick.png");
    // console.log(this)
}

function create() {
    const brickGroupYValues = [200, 140, 80]
    paddle = this.physics.add.image(config.width / 2, config.height - 50, "paddle")
    paddle.setCollideWorldBounds()
    paddle.setImmovable()

    keys = this.input.keyboard.createCursorKeys();
    ball = this.physics.add.image(config.width / 2, config.height - 100, "ball")
    ball.setCollideWorldBounds()
    ball.setBounce(1);
    this.physics.add.collider(ball, paddle);
    this.physics.world.checkCollision.down = false

    brickGroupYValues.forEach(value => {
        const brickGroup = this.physics.add.group({
            key: "brick",
            repeat: 8,
            immovable: true,
            setXY: {
                x: 155,
                y: value,
                stepX: 120,
            }
        });
        this.physics.add.collider(ball, brickGroup, hitBrick)
    });
}
function update() {
    if (keys.left.isDown) {
        paddle.x = paddle.x - 10
    }

    if (keys.right.isDown) {
        paddle.x = paddle.x + 10
    }

    if (!hasBallLaunched) {
        ball.x = paddle.x

        if (keys.space.isDown) {
            ball.setVelocityY(BALL_SPEED);
            // ball.setVelocityX(150)
            hasBallLaunched = true
        }
    }
}

const hitBrick = (ball, brick) => {
    if (ball.body.velocity.x === 0) {
        ball.setVelocityX(200)
    }
    brick.destroy();
}