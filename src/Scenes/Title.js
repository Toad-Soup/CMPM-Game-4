class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }

    preload() {
    //this.load.image('titlescreen1', 'titleScreen.png');
    //this.load.image('titlescreen2', 'titleScreen2.png');

    }

    create() {
        const sprite = this.add.sprite(0, 0, 'titlescreen').setOrigin(0, 0).setScale(4);

    this.anims.create({
        key: 'flash',
        frames: [
            { key: 'titlescreen' },
            { key: 'titlescreen2' }
        ],
        frameRate: 2,
        repeat: -1 // Loop indefinitely
        });

        sprite.play('flash');

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.scene.start('platformerScene');
        }

    }
}