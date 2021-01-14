var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'game',
    physics:{
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bullets;
var ship;
var enemy;
var speed;
var enemySpeed;
var stats;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;
var currentSword = 'bullet'
var lastFired = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/Player/BlueKnight_entity_000_basic attack 1_000.png');
    this.load.image('bullet2', 'assets/long-sword.png');
    this.load.image('bullet', 'assets/GameAssets/Swords/shot-sword.png');
    this.load.image('background', 'assets/Level.png');
    this.load.image('enemy', 'assets/GameAssets/Enemy/enemy.png');
}

function create ()
{

    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, currentSword);
                this.speed = Phaser.Math.GetSpeed(550, 1);
            },

        fire: function (x, y)
        {
            this.setPosition(x, y - 50);

            this.setActive(true);
            this.setVisible(true);
        },

        updateSword: function()
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, currentSword);
        },

        update: function (time, delta)
        {
            this.y -= this.speed * delta;

            if (this.y < -50)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    //  Limited to 20 objects in the pool, not allowed to grow beyond it
    // bullets = this.pool.createObjectPool(Bullet, 20);

    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 1,
        runChildUpdate: true
    });

    //  Create the objects in advance, so they're ready and waiting in the pool
    bullets.createMultiple({ quantity: 10, active: false });

    this.add.image(400, 300, 'background')

    ship = this.physics.add.sprite(400, 550, 'ship').setDepth(1);

    enemy = this.physics.add.sprite(400, 100, 'enemy');

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '72px', fill: '#FFFFFF'});

    cursors = this.input.keyboard.createCursorKeys();

    speed = Phaser.Math.GetSpeed(300, 1);

    enemySpeed = Phaser.Math.GetSpeed(30,1)

    this.physics.add.collider(bullets, enemy, enemyHit, null, this);

    this.physics.add.collider(ship, enemy, playerHit, null, this);

    ship.setCollideWorldBounds(true);
}

function update (time, delta)
{
    var bullet = bullets.get();

    if (gameOver)
    {
        return;
    }

    enemy.y += enemySpeed * delta;

    if (cursors.left.isDown)
    {
        ship.x -= speed * delta;
    }
    else if (cursors.right.isDown)
    {
        ship.x += speed * delta;
    }

    if (cursors.up.isDown && time > lastFired)
    {


        if (bullet)
        {
            bullet.fire(ship.x, ship.y);

            lastFired = time + 50;
        }
    }

    if(score >= 10)
    {
        currentSword == 'bullet2';

    }


}

function changeSword()
{

}

function enemyHit()
{
    enemy.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    bullets.setVisible(false);

}

function playerHit()
{
    this.physics.pause();

    ship.setTint(0xff0000);

    gameOver = true;
}