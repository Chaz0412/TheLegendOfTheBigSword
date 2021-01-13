var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bullets;
var ship;
var speed;
var stats;
var cursors;
var lastFired = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/sprites/ship.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
    this.load.image('background', 'assets/GameAssets/Background/WebDevBackground.png')
}

function create ()
{
    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

                this.speed = Phaser.Math.GetSpeed(400, 1);
            },

        fire: function (x, y)
        {
            this.setPosition(x + 50 , y - 0);

            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta)
        {
            this.x += this.speed * delta;

            if (this.x <  50)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    bullets = this.add.group({
        classType: Bullet,
        maxSize: 1000,
        runChildUpdate: true
    });

    this.add.image(400, 300, 'background');

    ship = this.add.sprite(50, 300, 'ship').setDepth(1);

    cursors = this.input.keyboard.createCursorKeys();

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    speed = Phaser.Math.GetSpeed(300, 1);

    //this.physics.add.collider(player, platforms);
}

function update (time, delta)
{
    if (cursors.up.isDown)
    {
        ship.y -= speed * delta;
    }
    else if (cursors.down.isDown)
    {
        ship.y += speed * delta;
    }

    if (spacebar.isDown && time > lastFired)
    {
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(ship.x, ship.y);

            lastFired = time + 50;
        }
    }
}
