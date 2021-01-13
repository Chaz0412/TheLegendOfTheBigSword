var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',

    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var platforms;
var player;
var bullets;
var spacebar;
var cursors;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/test/sky.png');
    this.load.image('ground', 'assets/test/platform.png');
    this.load.image('star', 'assets/test/star.png');
    this.load.image('bomb', 'assets/test/bomb.png');
    this.load.image('bullet', 'assets/Sword.png');
    this.load.spritesheet('dude', 'assets/Player/knight.png', { frameWidth: 32, frameHeight: 32 }
    );
}

function create ()
{

    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 1, 0, 'bullet');

                this.speed = Phaser.Math.GetSpeed(600, 1);
            },

        fire: function (x, y)
        {
            this.setPosition(x, y);

            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta)
        {
            this.x += this.speed * delta;

            if (this.x > 820)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    bullets = this.add.group({
        classType: Bullet,
        maxSize: 1,
        runChildUpdate: true
    });

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.add.image(400, 300, 'sky');


    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');


    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();



}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);


    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }

    if (Phaser.Input.Keyboard.JustDown(spacebar))
    {
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(player.x, player.y);
        }
    }
    else if(Phaser.Input.Keyboard.JustDown(spacebar) && cursors.left.isDown)
    {
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(player.x, player.y);
        }
    }


}



