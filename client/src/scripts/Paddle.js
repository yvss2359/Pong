import Mobile from "./Mobile.js";

const PADDLE_IMAGE_SRC = './images/paddle.png';
const SHIFT_X = 0;
const SHIFT_Y = 6;

export default class Paddle extends Mobile {

    /**
     *
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @param {Game} theGame the Game this paddle belongs to
     */
    constructor(x, y, theGame) {
        super(x, y, PADDLE_IMAGE_SRC, SHIFT_X, SHIFT_Y);
        this.moveState = { UP : 0, DOWN : 1, NONE: 2 };
        this.moving = this.moveState.NONE;
        this.theGame = theGame;
    }

    move() {

        if (this.moving == this.moveState.UP ){
            //this.y -=8;
            this.y = Math.max(0, this.y - 8);
        }
        if (this.moving == this.moveState.DOWN && this.y + this.img.height <= this.theGame.canvas.height ){
            this.y = Math.max(0, this.y + 8);;
        }

    }

    moveUp() {
      this.moving = this.moveState.UP;
    }

    moveDown() {
      this.moving = this.moveState.DOWN;
    }

    stopMoving(){
      this.moving = this.moveState.NONE;
    }

}
