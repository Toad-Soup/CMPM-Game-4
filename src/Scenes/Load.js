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

        this.load.spritesheet("tilemap_sheet", "yellowCrystal.png", {
            frameWidth: 32,
            frameHeight: 30
        });

        this.load.spritesheet("spike_sheet", "tilesheet_complete.png", {
            frameWidth: 32,
            frameHeight: 30
        });

        //preload the audio
        this.load.audio("jump", "proud-fart.mp3");
        this.load.audio("womp", "pepSound3.ogg");
        this.load.audio("collect", "powerUp7.ogg");

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}