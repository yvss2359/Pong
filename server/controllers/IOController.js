export default class IOController {
  #io;
  #players;

  constructor(io) {
    this.#io = io;
    this.#players = new Map();
  }
  /**
   * handles the reception of messages from the clients to the server
   *
   * @param  {Socket.io} socket the socket of the client
   */
  registerSocket(socket){
    this.connection(socket);
    socket.on('start',()=>this.startGame(socket));
    socket.on('stop',()=>this.stopGame(socket));
    socket.on('moveUp',()=>socket.broadcast.emit('moveUp'));
    socket.on('moveDown',()=>socket.broadcast.emit('moveDown'));
    socket.on('stopMoving',(y)=>socket.broadcast.emit('stopMoving',y));
    socket.on('send ball',(x,shiftX)=>this.sendedBall(socket,x,shiftX));
    socket.on('collision',(shiftX,shiftY)=>this.ballCoord(socket,shiftX,shiftY));
    //socket.on('speed synchro',(x,y)=>this.ballSpeed(x,y));
  }
  /**
   * handles the connection of the clients to the server
   *
   * @param  {Socket.io} socket the socket of the client
   */
  connection(socket){
    const nb = this.#players.size+1;
    console.log(`Player #${nb} with id#${socket.id}`);
    socket.emit('number',nb);
    console.log(`${nb} sent to #${socket.id}`);
    if(nb<3){
      this.#players.set(nb,socket);
      socket.on( 'disconnect', () => this.Disconnection(socket));
      socket.on( 'quit', () => this.Disconnection(socket));
    }else{
      console.log(`${socket.id} connection rejected : already two players connected`);
      socket.disconnect(true);
    }

  }

  /**
   * handles the disconnection of the clients from the server
   *
   * @param  {Socket.io} socket the socket of the client
   */
  Disconnection(socket){
    console.log(`Disconnect ${socket.id} : a player disconnected GAME-OVER`);
    this.#io.emit('disconnect player');
    this.#io.disconnectSockets();
    this.#players.clear();
  }
  /**
   * get thesocket of the second client
   *
   * @param  {Socket.io} socket the socket of the first client
   */
  getOtherClient(socket){
    if(this.#players.get(1).id===socket.id){
      return this.#players.get(2);
    }
    else if(this.#players.get(2).id===socket.id){
        return this.#players.get(1);
    }
  }
  /**
   * handles the demande of strating the game from the first client to the other
   *
   * @param  {Socket.io} socket the socket of the first client
   */
  startGame(socket){
    const otherSocket= this.getOtherClient(socket);
    //console.log("the Game is on");
    if(otherSocket!==undefined){
      otherSocket.emit('start game');
    }else{
      socket.emit('need other player');
    }
  }
  /**
   * handles the demande of stoping the game from the first client to the other
   *
   * @param  {Socket.io} socket the socket of the first client
   */
  stopGame(socket){
    const otherSocket= this.getOtherClient(socket);
    //console.log("the Game is on");
    if(otherSocket!==undefined){
      otherSocket.emit('stop game');
    }else{
      socket.emit('need other player');
    }
  }
  /**
   * handles the demande of sending the ball from the first client to the other
   *
   * @param  {Socket.io} socket the socket of the first client
   * @param  {int} x the x coordination of the ball
   * @param  {int} shiftX the x speed of the ball
   */
  sendedBall(socket,x,shiftX){
    const otherSocket = this.getOtherClient(socket);
    otherSocket.emit('ball sended',x,shiftX);
  }

  ballCoord(socket,shiftX,shiftY){
    const otherSocket = this.getOtherClient(socket);
    otherSocket.emit('shifts',shiftX,shiftY);
  }

  // ballSpeed(socket,x,y){
  //   const otherSocket = this.getOtherClient(socket);
  //   otherSocket.emit('ball coord',x,y);
  // }


}
