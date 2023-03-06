'use strict';
import Ball from './Ball.js';
import Game from './Game.js';

const init = () => {
  const theField = document.getElementById("field");
  const theGame = new Game(theField);

  document.getElementById('connect').addEventListener("click", () => connect(theGame));
  document.getElementById('start').addEventListener("click", () => startGame(theGame) );
  window.addEventListener("keydown",theGame.KeyDownActionHandler.bind(theGame));
  window.addEventListener("keyup",theGame.keyUpActionHandler.bind(theGame));
}

window.addEventListener("load",init);

// true iff game is started
let started = false;
//let connect_strat = false;
/** start and stop a game
 * @param {Game} theGame - the game to start and stop
 */
const startGame = theGame => {
        if (!started) {

          theGame.start();
          theGame.socket.emit('start');
          document.getElementById('start').value = 'pause ■ ';
        }
        else {
          document.getElementById('start').value = 'play ►';
          theGame.socket.emit('stop');
          theGame.stop();
        }
        started = ! started;
}
// true if connected to the game
let connected = false;
/** start and stop a game
 * @param {Game} theGame - the game to connect to
 */
const connect = theGame => {
          if (!connected) {

            theGame.handleSocket();
          }
          else {
            theGame.playerQuit();
          }
          connected = ! connected;
}
