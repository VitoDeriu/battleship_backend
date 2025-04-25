import {
  ConnectedSocket,
  MessageBody,
  // ConnectedSocket,
  // MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect, SubscribeMessage,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

//Interface de l'état de la partie, voir s'il ne vaut pas mieux mettre le json. À regarder
interface GameState {
  gameId: string;
  players: string[];
  ready: boolean;
}

@WebSocketGateway(4002, {cors: true})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  //on initialise l'interface
  private game: GameState = {
    gameId: 'board1',
    players: [],
    ready: false, //partie prête quand 2 joueurs seront connecté, à rajouter 'quand ils auront mis prêt'
  }

  handleConnection(client: Socket) {

    console.log(`joueur connecté: ${client.id} `);

    //check s'il y a déjà 2 joueurs dedans
    if (this.game.players.length >= 2) {
      console.log('game full');
      client.emit('error', 'game already full');
      client.disconnect();
    } else { //sinon, on rajoute le joueur à la partie
      this.game.players.push(client.id); //ajoute l'id a l'interface
      console.log(`joueur ajouté a la partie : ${client.id}`);
    }

    if (this.game.players.length === 2){
      this.game.ready = true;
      console.log('game ready');

      this.server.emit('game-ready', {
          message: 'la partie va commencer !',
          gameId: this.game.gameId,
          players: this.game.players,
          startPlayer: this.game.players[0], //le premier joueur à s'être connecté commence.
        })
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Joueur déconnecté : ${client.id}`);

    //garde dans l'interface seulement le joueur restant
    this.game.players = this.game.players.filter((player :string) :boolean => player !== client.id);

    if(this.game.ready){
      console.log('game not ready')
      //change l'état de la partie en false
      this.game.ready = false;
    }

    //ensuite, on notifie le joueur restant
    this.server.emit('player left', {
      message: 'un joueur a quitté la partie',
      currentPlayer: this.game.players,
    })
  }

  // Méthode pour écouter les messages envoyés par le front
  @SubscribeMessage('move') // écoute l'événement 'testMessage'
  handleTestMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
    console.log(`Message reçu du client (${client.id}): ${data}`);
    // Réponse au client (optionnel)
    this.server.emit('move', `Message bien reçu : ${data}`);
  }
}