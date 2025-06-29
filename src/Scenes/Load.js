class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilesheet_complete.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        this.load.image("background_tiles", "set2_background.png");
        this.load.image("background_details", "set2_tiles.png");

        this.load.image('titlescreen', 'titleScreen.png');
        this.load.image('titlescreen2', 'titleScreen2.png');

        this.load.spritesheet("tilemap_sheet", "yellowCrystal.png", {
            frameWidth: 32,
            frameHeight: 30
        });

        this.load.spritesheet("spike_sheet", "tilesheet_complete.png", {
            frameWidth: 32,
            frameHeight: 30
        });

        this.load.spritesheet("water_sheet", "tilesheet_complete.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        //preload the audio
        //this.load.audio("jump", "proud-fart.mp3");
        this.load.audio("womp", "pepSound3.ogg");
        this.load.audio("collect", "powerUp7.ogg");
        this.load.audio("jump", "phaseJump3.ogg");

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        //load inm the atlas for the new player sprite
        this.load.atlasXML('playerAtlas', 'spritesheet_players.png', 'spritesheet_players.xml');

    }

    create() {

this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNames('playerAtlas', {
        frames: [
            'playerGreen_walk2.png',
            'playerGreen_walk3.png'
        ]
    }),
    frameRate: 15,
    repeat: -1
});

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNames('playerAtlas', {
            frames: [
                'playerGreen_up1.png'
            ]
        }),
    });

    this.anims.create({
        key: 'idle',
        frames: [
            { key: 'playerAtlas', frame: 'playerGreen_stand.png' },
        ],
        repeat: -1
    });

         // ...and pass to the next Scene
         this.scene.start('title');
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}
