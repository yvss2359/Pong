import Ball from './Ball.js';
import Paddle from './Paddle.js'


/**
 * a Game animates a ball bouncing in a canvas
 */
export default class Game {
  /**
   * build a Game
   *
   * @param  {Canvas} canvas the canvas of the game
   */
  constructor(canvas) {
    this.raf = null;
    this.canvas = canvas;
    this.paddle1 = new Paddle(40, (this.canvas.height/2)-44, this);
    this.paddle2 = new Paddle(this.canvas.width-70, (this.canvas.height/2)-44, this);
    this.ball = new Ball((this.canvas.width/2), (this.canvas.height/2), this);
    this.gameHasStarted=false;
    this.score1 = 0;
    this.score2 = 0;
    this.socket= null;
    this.player1=false;
    }

  /** start this game animation */
  start() {
    this.ball.ballMoving = true;
    this.animate();
  }
  /** stop this game animation */
  stop() {
    this.ball.ballMoving = false;
    window.cancelAnimationFrame(this.raf);
  }

  /** animate the game : move and draw */
  animate() {
    //this.gameHasStarted = true;
    this.moveAndDraw();
    this.raf = window.requestAnimationFrame(this.animate.bind(this));
  }
  /** move then draw the bouncing ball */
  moveAndDraw() {
    const ctxt = this.canvas.getContext("2d");
    ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //draw and move the Paddles
    this.paddle1.move();
    this.paddle1.draw(ctxt);

    this.paddle2.move();
    this.paddle2.draw(ctxt);
    if(this.gameHasStarted){
      // draw and move the ball
      this.ball.move();
      this.ball.draw(ctxt);
      if(this.ball.x===this.canvas.width/2 && this.player1){
        this.socket.emit('speed synchro', this.ball.x, this.ball.y);
      }

      this.ball.collisionWith(this.paddle1);
      this.ball.collisionWith(this.paddle2);
      this.updateScores();
    }
  }
  //Update the score of the game
  updateScores(){
   if(this.ball.droite){
     this.score1 +=1;
     this.paddle1.x=40;
     this.paddle1.y=(this.canvas.height/2)-44;
     this.paddle2.x=this.canvas.width-70;
     this.paddle2.y=(this.canvas.height/2)-44;
     document.getElementById('score1').textContent = this.score1;
     this.ball.droite=false;
   }
   if(this.ball.gauche){
     this.score2 +=1;
     this.paddle1.x=40;
     this.paddle1.y=(this.canvas.height/2)-44;
     this.paddle2.x=this.canvas.width-70;
     this.paddle2.y=(this.canvas.height/2)-44;
     document.getElementById('score2').textContent = this.score2;
     this.ball.gauche=false;
   }


 }

  // Sends a new ball if the game is already started, or stops the game
   stratAndRestart(){

       if(!this.ball.ballMoving  && this.gameHasStarted){
          this.ball = new Ball(this.paddle1.x+this.paddle1.width+1, (this.paddle1.y+this.paddle1.height/2)-12,this);

        }
          else if(!this.gameHasStarted){
            this.ball = new Ball(this.paddle1.x+this.paddle1.width+1, (this.paddle1.y+this.paddle1.height/2)-12,this);
            this.gameHasStarted = true;
          }


   }
   // Sends a new ball of the other player
   otherstratAndRestart(x,shiftX){
     this.stratAndRestart();
     if(!this.player1){
       this.ball.x=this.canvas.width-this.paddle2.width-x-1;
       this.ball.y=(this.paddle2.y+this.paddle2.height/2)-12;
       this.ball.shiftX=-shiftX;
     }
   }


   /**
    * handle the action of a key down
    *
    * @param  {Event} event the event of key down
    */
  KeyDownActionHandler(event){
    switch (event.key) {

            case "ArrowUp":
            case "Up":
                this.socket.emit('moveUp');
                this.paddle1.moveUp();
                break;

            case "ArrowDown":
            case "Down":
                this.socket.emit('moveDown');
                this.paddle1.moveDown();
                break;
            case " ":
              if(this.player1===true){
                this.stratAndRestart();
                this.socket.emit('send ball',this.ball.x,this.ball.shiftX);
              }
             break;
            default: return;
      }
        event.preventDefault();
  }

  /**
   * handle the action of a key up
   *
   * @param  {Event} event the event of key up
   */
  keyUpActionHandler(event) {
        switch (event.key) {

            case "ArrowUp":
            case "Up":
                this.socket.emit('stopMoving',this.paddle1.y);
                this.paddle1.stopMoving();
                break;
            case "ArrowDown":
            case "Down":
                this.socket.emit('stopMoving',this.paddle1.y);
                this.paddle1.stopMoving();
              break;
              default: return;
        }
        event.preventDefault();
    }


// ===============================   Partie reseau  ==================================


    //handles the reception of messages from the server to this socket
    handleSocket(){
      this.socket=io();
      this.socket.on('number', (playerNumber) => this.registerPlayer(playerNumber));
      this.socket.on('disconnect player',()=>this.handleDisconnectedPlayer());
      this.socket.on('start game',()=>this.start());
      this.socket.on('stop game',()=>this.stop());
      this.socket.on('need other player',()=>this.needAnotherPlayer());
      this.socket.on('moveUp',()=>this.paddle2.moveUp());
      this.socket.on('moveDown',()=>this.paddle2.moveDown());
      this.socket.on('stopMoving',y=>{this.paddle2.stopMoving();this.paddle2.y=y});
      this.socket.on('ball sended',(x,shiftX)=>this.otherstratAndRestart(x,shiftX));
      this.socket.on('shifts',(shiftX,shiftY)=>this.ballSpeedRefactor(shiftX,shiftY));
      this.socket.on('arrived',document.getElementById('notif').innerHTML= "");
      //this.socket.on('ball coord',(x,y)=> this.ballRefactor(x,y));
    }

    /**
     * attribues a number or an id to a player that joind the game
     *
     * @param  {int} number the id of the player
     */
    registerPlayer(number){
      if (number < 3) {
        console.log(`Welcome, player #${number}`);
        const displayer = 'Player #'+number;
        document.getElementById('player').innerHTML=displayer;
        document.getElementById('connect').value='Connected'
        document.getElementById('connect').style.backgroundColor="lightgreen";
        document.getElementById('connect').style.color="black";

        if(number==1){
          document.getElementById('start').disabled = false;
          this.player1=true;
        }
        if(number==2){
          this.socket.emit('second');
          this.player1=false;
        }
      }
      else {
        console.log("Connexion refused : already full players connected.")
        document.getElementById('connect').style.backgroundColor="red";
        document.getElementById('connect').value='Cant connect';
      }
    }

    //handles the case of quiting the game by one of the players
    playerQuit(){
      this.socket.emit('quit');
      document.getElementById('start').disabled = true;
    }

    //handles the disconnection action
    handleDisconnectedPlayer(){
      document.getElementById('start').disabled = true;
      document.getElementById('connect').style.backgroundColor="red";
      document.getElementById('start').style.backgroundColor="red";
      document.getElementById('connect').style.color="black";
      document.getElementById('connect').value = 'Disconnected';
      document.getElementById('start').value = '';
      document.getElementById('player').innerHTML= "GAME-OVER";
      document.getElementById('notif').innerHTML= "One player quit";
      this.stop();
    }

    //informs the player that the game needs 2 players to start
    needAnotherPlayer(){
      document.getElementById('notif').innerHTML="need another player to start the game";
      this.stop();
    }

    // refactors the ball of the player2 to have a synchronized movement of the ball after a collision
    ballSpeedRefactor(x,y){
      if(!this.player1){
        this.ball.shiftX=-x;
        this.ball.shiftY=y;
      //   console.log("shiftX refactored : "+this.ball.shiftX);
      //   console.log("shiftY refactored : "+this.ball.shiftY);
       }
    }

    //refactors the ball of the player2 to have a synchronized movement of the ball
    // ballRefactor(x,y){
    //   if(!this.player1){
    //     this.ball.x=this.canvas.width-x;
    //     this.ball.y=y;
    //     console.log("X refactored : "+this.ball.x);
    //     console.log("Y refactored : "+this.ball.y);
    //   }
    // }


  }
