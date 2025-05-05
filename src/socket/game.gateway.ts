import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(4002, {cors: true})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private games: { [gameId: string]: { players: string[], ready: boolean } } = {};


  handleConnection(client: Socket) {
    console.log(`joueur connecté: ${client.id} `);

    //todo: faire une route pour la connexion où on va envoyer son id au joueur au front et un autre à l'autre joueur où il va avoir les connexions de l'autre joueur

    const gameId = 'board1'; // Exemple : ID de la partie. Peut être dynamique (« création de salle auto »).

    // Si la room n'existe pas, on crée une partie
    if (!this.games[gameId]) {
      console.log("Création d'une nouvelle salle:", gameId);
      this.games[gameId] = { players: [], ready: false };
    }

    const game = this.games[gameId];


    // Vérifie si la room est pleine
    if (game.players.length >= 2) {
      console.log(`Partie ${gameId} déjà pleine`);
      client.emit('error', 'Cette partie est déjà pleine');
      client.disconnect();
      return;
    }

    // Ajoute le joueur à la partie
    game.players.push(client.id);
    client.join(gameId); // Place le client dans la room correspondante
    console.log(`Joueur ajouté à la room ${gameId}: ${client.id}`);

    // Notifie les joueurs de la room
    this.server.to(gameId).emit('player-joined', {
      room: gameId,
      players: game.players,
    });

    // Si 2 joueurs sont connectés, la partie peut commencer
    if (game.players.length === 2) {
      game.ready = true;
      console.log(`Partie ${gameId} prête à commencer`);
      this.server.to(gameId).emit('game-ready', {
        message: 'La partie va commencer !',
        room: gameId,
        players: game.players,
        startPlayer: game.players[0], // Le premier joueur connecté commence
      });
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Joueur déconnecté : ${client.id}`);

    // Recherche de la room dans laquelle le joueur est connecté
    const gameId = Object.keys(this.games).find((id) =>
      this.games[id].players.includes(client.id),
    );

    //annule si la room n'existe pas
    if (!gameId) return;

    //on change les joueurs de la room pour ne garder seulement le joueur restant
    const game = this.games[gameId];
    game.players = game.players.filter((player) => player !== client.id);

    console.log(`Joueur ${client.id} retiré de la room ${gameId}`);

    // Si la room est vide, on la supprime
    if (game.players.length === 0) {
      delete this.games[gameId];
      console.log(`Room ${gameId} supprimée car aucun joueur ne reste`);
    } else {
      // Sinon, on informe le joueur restant que la partie n'est plus prête
      game.ready = false;
      this.server.to(gameId).emit('player-left', {
        message: 'Un joueur a quitté la partie',
        players: game.players,
      });
    }
  }

  // Méthode pour écouter les messages envoyés par le front
  @SubscribeMessage('move')
  handlePlayerMove(@MessageBody() data: { detail: string, x: number, y: number }, @ConnectedSocket() client: Socket): void {
    // Trouve la room du joueur
    const gameId = Object.keys(this.games).find((id) =>
      this.games[id].players.includes(client.id),
    );

    if (!gameId) {
      client.emit("error", "Vous n'êtes pas dans une partie valide");
      return;
    }

    // Diffuser aux autres joueurs de la même room
    console.log("move", data);
    this.server.to(gameId).emit('move', {
      player: client.id,
      move: data,
    });
  }




}