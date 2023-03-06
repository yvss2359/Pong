import Mobile from './Mobile.js';


// default values for a Ball : image and shifts
const BALL_IMAGE_SRC = './images/balle24.png';
const SHIFT_X = 8;
const SHIFT_Y = 0;



/**
 * a Ball is a mobile with a ball as image and that bounces in a Game (inside the game's canvas)
 */
export default class Ball extends Mobile {

  /**  build a ball
   *
   * @param  {number} x       the x coordinate
   * @param  {number} y       the y coordinate
   * @param  {Game} theGame   the Game this ball belongs to
   */
  constructor(x, y, theGame) {
    super(x, y, BALL_IMAGE_SRC , SHIFT_X, SHIFT_Y);
    this.theGame = theGame;
    this.ballMoving = true;
    this.gauche=false;
    this.droite=false;
  }


  /**
   * when moving a ball bounces inside the limit of its game's canvas
   */
  move() {
    if (this.y <= 0 || (this.y+this.height >= this.theGame.canvas.height)) {
      this.shiftY = - this.shiftY;    // rebond en haut ou en bas
    }
    else if (this.x + this.width >= this.theGame.canvas.width ) {
      //this.shiftX = - this.shiftX;
      this.droite = true;
      this.stopMoving(); // arret de la balle au contact de la paroie droite
    }
    else if(this.x <= 0){
      this.gauche = true;
      this.stopMoving(); // arret de la balle au contact de la paroie gauche

    }
    super.move();
    if(this.x==(this.theGame.canvas.width/2)-1){
       this.theGame.centerBall();
     }
  }

  stopMoving(){
    super.stopMoving();
    this.ballMoving = false;
    this.theGame.gameHasStarted = false;
  }

  /**
   * handle the collision of the ball with a mobile
   *
   * @param  {Mobile} mobile the mobile to hit
   */
  collisionWith(mobile){
    const padLeft=Math.max(this.x, mobile.x) <= Math.min(this.x + this.width, mobile.x + mobile.width)
            && (Math.max(this.y, mobile.y) <= Math.min(this.y + this.width, mobile.y + mobile.height));
    const padRight=Math.max(this.x, mobile.x) <= Math.min(this.x + this.width, mobile.x + mobile.width)
            && (Math.max(this.y, mobile.y) <= Math.min(this.y + this.width, mobile.y + mobile.height));
    if ((padLeft && mobile.x<this.theGame.canvas.width/2)||(padRight && mobile.x>this.theGame.canvas.width/2)){
      const impact=(this.y+12)-mobile.y;
      const n = this.impactZone(mobile,impact);
    }
  }

  /**
   * defines the impact zone of the ball on a mobile and determines the new direction of the ball
   *
   * @param  {Mobile} mobile the mobile to hit
   * @param  {int} y the impactZone
   */
  impactZone(mobile,y){
    let n;
    const tab = new Array(2);
    if (0<=y<11||77<=y<=88 ){
      n=-3;
    }
    else if (11<=y<22||66<=y<77){
      n= -2;
    }
    else if (22<=y<33||55<=y<66){
      n=-1;
    }
    else if (33<=y<44 || 44<=y<55){
      n = 0;
    }
    this.updateShifts(y,n,mobile.height);
    return n;
  }

  /**
   * update Shifts (speeds) of the ball after a collision
   *
   * @param  {int} val the new speed (shiftY) of the ball
   * @param  {int} y the impactZone
   * @param {int} h the height of the mobile
   */
  updateShifts(y,val,h){
    // console.log("shiftx avant rebond "+this.shiftX);
    // console.log("shifty avant rebond "+this.shiftY);

    if(y>h/2){
        if (this.x<this.theGame.canvas.width/2){
          this.shiftY=-val;
          this.shiftX=7-Math.abs(val);
        }
        else{
          this.shiftY=-val;
          this.shiftX=-this.shiftX;

        }
    }
    else{
      if (this.x<this.theGame.canvas.width/2){
        this.shiftY=val;
        this.shiftX=7-Math.abs(val);
        }
      else{
        this.shiftY=val;
        this.shiftX=-this.shiftX;
      }
  }
    this.theGame.socket.emit('collision',this.shiftX,this.shiftY);
    // console.log("shiftx apres rebond "+this.shiftX);
    // console.log("shifty apres rebond "+this.shiftY);

  }




}
