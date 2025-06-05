class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1200;
        this.JUMP_VELOCITY = -700;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 32, 32, 121, 63);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilesheet_complete", "tilemap_tiles");
        this.backset = this.map.addTilesetImage("bacground color", "background_tiles");
        this.backset2 = this.map.addTilesetImage("background tiles", "background_details");

        this.backgroundLayer = this.map.createLayer("background", this.backset, 0, 0);
        //this.backgroundLayer.setScale(2.0);

        this.backgroundLayer = this.map.createLayer("background2", this.backset2, 0, 0);
        //this.backgroundLayer.setScale(2.0);

        this.extraLayer = this.map.createLayer("Layer-2", this.tileset, 0, 0);
        //this.extraLayer.setScale(2.0);

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        //this.groundLayer.setScale(2.0);

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.coin = this.map.createFromObjects("coins", {
            name: "coins",
            key: "tilemap_sheet",
        });

        this.spike1 = this.map.createFromObjects("spikes", {
            name: "spike",
            key: "spike_sheet",
            frame: 861
        });

        this.water1 = this.map.createFromObjects("water", {
            name: "water",
            key: "water_sheet",
            frame: 992
        });

        this.physics.world.enable(this.coin, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.spike1, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.water1, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coin);

        this.totalCoins = this.coinGroup.getChildren().length;
        this.collectedCoins = 0;

        this.spikeGroup = this.add.group(this.spike1);
        this.waterGroup = this.add.group(this.water1);

        my.vfx = {};

        this.physics.world.setBounds(0, 0, 4000, 2005);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(200, 1110, "platformer_characters", "tile_0000.png").setScale(2)
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.extraLayer);

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {       
            obj2.destroy();
            this.collectedCoins++;

            this.sound.play("collect", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });

            if (this.collectedCoins >= this.totalCoins) {
                this.gameComplete();
            }

            if (my.vfx.coins){
                my.vfx.coins.stop();
            }
            
            my.vfx.coins = this.add.particles(obj2.x, obj2.y, "kenny-particles", {
            frame: ["star_06.png"],
            lifespan: 500,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            gravityY: 300,
            scale: { start: 0.2, end: 0 },
            //alpha: { start: 1, end: 0 },
            //quantity: 10,
            on: false // Not emitting by default
        });

        this.time.delayedCall(100, () => {
            my.vfx.coins.stop();
        });
        });

        this.physics.add.overlap(my.sprite.player, this.spikeGroup, (obj1, obj2) => {       
                this.gameOver();
        });

        this.physics.add.overlap(my.sprite.player, this.waterGroup, (obj1, obj2) => {    
                this.gameOver();
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.cameras.main.setBounds(0, 0, 3600, 2005);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1.0);

        this.time.addEvent({
            delay: 500,        // Delay in milliseconds (2000ms = 2s)
            callback: () => {
                // Call your custom logic here
                my.vfx.player = this.add.particles(my.sprite.player.x + Phaser.Math.Between(-10, 10), my.sprite.player.y +Phaser.Math.Between(-20, 20), "kenny-particles", {
                    frame: "star_06.png", 
                    lifespan: 500,
                    speed: 0,                     // Stationary
                    gravityY: 0,
                    quantity: 1,
                    alpha: { start: 0, end: 1 },  // Fade out
                    scale: { start: 0.2, end: 0 }, // Optional: shrink out
                    blendMode: 'ADD'
                }).explode(1); // Emit a single particle
            },
            callbackScope: this, // Optional but recommended to use 'this' context
            loop: true           // Make sure it loops
        });

    }

    update() {

        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
           my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            //this.sound.play("jump", {
            //    volume: 1   // Can adjust volume using this, goes from 0 to 1
            //});

            if (my.vfx.jump){
                my.vfx.jump.stop();
            }
            
            my.vfx.jump = this.add.particles(my.sprite.player.x, my.sprite.player.y + 40, "kenny-particles", {
                frame: ["smoke_06.png"],
                lifespan: 300,
                //speed: { min: 100, max: 200 },
                angle: { min: 90, max: 90 },
                //gravityY: 200,
                scale: { start: 0.3, end: 0.3},
                alpha: { start: 1, end: 0 },
                quantity: 1,
                //on: false // Not emitting by default
            });

            //this.time.delayedCall(100, () => {
            //    my.vfx.jump.stop();
            //});

            my.vfx.jump.explode(1);
            

        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

    }

    gameComplete() {
        if(my.sprite.player.y < 300){
            this.add.text(my.sprite.player.x, my.sprite.player.y + 100, 'You Win!', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);
        }  
        else{
            this.add.text(my.sprite.player.x, my.sprite.player.y - 100, 'You Win!', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);
        }    
        this.physics.pause(); // Freeze the game
    }

    gameOver() {
        this.sound.play("womp", {
            volume: 1   // Can adjust volume using this, goes from 0 to 1
        });
        this.add.text(my.sprite.player.x, my.sprite.player.y - 100, 'GAME OVER!', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);  
        this.add.text(my.sprite.player.x, my.sprite.player.y - 60, 'Press R to restart', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5); 
        this.physics.pause(); // Freeze the game
    }

}