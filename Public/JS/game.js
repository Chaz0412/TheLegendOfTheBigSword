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
var bigBullets;
var bigSword = 3;
var ship;
var enemy;
var wall;
var speed;
var enemySpeed = 10;
var stats;
var cursors;
var score = 0;
var scoreText;
var bigSwordText;
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
    this.load.image('wall', 'assets/GameAssets/Walls/walltilesheet.png');
}

function create ()
{

    this.physics.world.setFPS(120);

    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, currentSword);
                this.speed = Phaser.Math.GetSpeed(350, 1);
            },

        fire: function (x, y)
        {
            this.setPosition(x, y - 50);

            this.setActive(true);
            this.setVisible(true);
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

    var BigBullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

            function BigBullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet2');
                this.speed = Phaser.Math.GetSpeed(350, 1);
            },

        fire: function (x, y)
        {
            this.setPosition(x, y - 50);

            this.setActive(true);
            this.setVisible(true);

            bigSword = bigSword - 1;
            bigSwordText.setText('Big Sword Uses:' + bigSword);
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

    bigBullets = this.physics.add.group({
        classType: BigBullet,
        maxSize: 1,
        runChildUpdate: true
    });

    //  Create the objects in advance, so they're ready and waiting in the pool
    bullets.createMultiple({ quantity: 10, active: false });

    this.add.image(400, 300, 'background')

    wall = this.physics.add.image(400, 710, 'wall').setScale(17);

    ship = this.physics.add.sprite(400, 550, 'ship').setDepth(1);

    enemy = this.physics.add.group({
        key: 'enemy',
        repeat: 4,
        setXY: { x: 200, y: 100, stepX: 100}
    });

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFFFFF'});

    bigSwordText = this.add.text(316, 16, 'Big Sword Uses: 0', { fontSize: '32px', fill: '#FFFFFF'});

    bigSwordText.setText('Big Sword Uses:' + bigSword);

    cursors = this.input.keyboard.createCursorKeys();

    speed = Phaser.Math.GetSpeed(300, 1);

    this.physics.add.collider(bullets, enemy, enemyHit, null, this);

    this.physics.add.collider(bigBullets, enemy, enemyHit, null, this);

    this.physics.add.collider(ship, enemy, playerHit, null, this);
    this.physics.add.collider(wall, enemy, playerHit, null, this);

    ship.setCollideWorldBounds(true);
}

function update (time, delta)
{


    if (gameOver)
    {
        return;
    }

    //enemy.y += enemySpeed;
    enemy.setVelocity(Phaser.Math.Between(1, 1), enemySpeed);

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
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(ship.x, ship.y);

            lastFired = time + 50;
        }
    }

    if(bigSword >= 1)
    {
        if (cursors.down.isDown && time > lastFired)
        {

            var bigBullet = bigBullets.get();

            if (bigBullet)
            {
                bigBullet.fire(ship.x, ship.y);

                lastFired = time + 50;
            }

        }

    }

}

function enemyHit(bullet, enemys)
{
    enemys.disableBody(true, true);
    bullet.destroy(true);
    score += 10;
    scoreText.setText('Score: ' + score);
    //bullets.setVisible(false);
    //bullets.disableBody(true, true);
    enemySpeed = enemySpeed + 1;

    if (enemy.countActive(true) === 0)
    {
        enemy.children.iterate(function (child){
        child.enableBody(true, child.x, 0, true, true);
        });
        bigSword = bigSword + 1;
        bigSwordText.setText('Big Sword Uses:' + bigSword);
    }




}

function playerHit()
{
    this.physics.pause();

    ship.setTint(0xff0000);

    var gameOverText = this.add.text(200, 200, 'GAME OVER', { fontSize: '72px', fill: '#FFFFFF'});

    gameOver = true;
}