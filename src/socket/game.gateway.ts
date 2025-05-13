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
import { GameBoard } from '../models/gameBoard';
import { Player } from '../models/player';
import { createParamDecorator } from '@nestjs/common';

@WebSocketGateway(4002, {cors: true})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  //objet qui contient toutes les parties (rooms) ouverte
  private rooms: {
    [roomId: string]: {
      players: string[],
      usernames: string[],
      playerReady: { [playerId: string]: boolean },
      state: "waiting" | "ready" | "placement" | "in-progress" | "finished",
      gameBoard: GameBoard
    }
  } = {};

  //Description des états de 'state' :
  //  waiting = en attente de joueur supplémentaire
  //  ready = les deux joueurs sont dans la partie et en attente de lancement
  //  placement = phase de placement des bateaux
  //  in-progress = phase de tir sur les bateaux adverse
  //  finished = partie terminée

  handleConnection(client: Socket) {
    //Le client arrive dans le websocket
    const username = client.handshake.auth?.username;
    console.log(`${username} s'est connecté avecc l'id : ${client.id}`);

    //todo: rendre le gameId dynamique. Faut en créer un a chaque fois,
    // vérifier si y'a pas un truc de room du ws qui le fait tout seul
    const roomId = 'board1'; // Exemple : ID de la partie. Peut-être dynamique (« création de salle auto »).

    //Gestion des rooms
    // Si la room n'existe pas, on crée une nouvelle room
    if (!this.rooms[roomId]) {
      console.log("Création d'une nouvelle salle:", roomId);
      //init d'un nouvel objet GameBoard avec les infos de la partie vide
      const gameBoard = new GameBoard(
        {player1: new Player("", []), player2: new Player("", [])},
        0, [], "waiting", null, null
      )
      this.rooms[roomId] = { players: [], usernames: [],playerReady: {}, state: "waiting", gameBoard: gameBoard };
    }

    const room = this.rooms[roomId];

    // Vérifie s'il y a de la place dans la room
    if (room.players.length >= 2) {
      console.log(`Partie ${roomId} déjà pleine`);
      this.server.to(client.id).emit('error', 'Cette partie est déjà pleine');
      client.disconnect();
      return;
    }

    // Ajoute le joueur à la partie
    room.players.push(client.id);
    room.usernames.push(username);
    client.join(roomId); // Place le client dans la room correspondante
    const dataMyId = {client: client.id, username: username, gameId: roomId, state: room.state}
    this.server.to(client.id).emit('my-id', dataMyId); //envoie au client son propre id de session et son username

    // Notifie les joueurs de la room qu'un joueur est entré
    console.log(`Joueur ajouté à la room ${roomId}: \n ${client.id}, \n${username}`);
    this.server.to(roomId).emit('player-joined', {
      room: roomId,
      players: client.id,
      username: username
    });

    // Si 2 joueurs sont connectés, la partie peut commencer
    if (room.players.length === 2) {
      room.state = "ready";
      console.log(`Partie ${roomId} prête à commencer`);
      console.log(room);
      this.server.to(roomId).emit('lobby-ready', {
        message: 'Le lobby est plein et prêt à commencer !',
        room: roomId,
        state: room.state,
        players: room.players, //récupérer depuis ici les infos des deux opposants
        usernames: room.usernames,
        startPlayer: room.players[0], // Le premier joueur connecté commence
      });
    }

    if (room.state === "ready") {
      room.gameBoard.players.player1.id = room.players[0];
      room.gameBoard.players.player2.id = room.players[1];

      console.log("room :", room)
      console.log("gameBoard :", room.gameBoard)
    }
  }

  //todo: ajouter des conditions de changement d'état de partie suivant le moment où le joueur se déco
  handleDisconnect(client: Socket) {
    console.log(`Joueur déconnecté : ${client.id}`);

    // Recherche de la room dans laquelle le joueur est connecté
    const roomId = Object.keys(this.rooms).find((id) =>
      this.rooms[id].players.includes(client.id),
    );

    //annule si la room n'existe pas
    if (!roomId) return;

    //on change les joueurs de la room pour ne garder seulement le joueur restant
    const room = this.rooms[roomId];

    //màj du tableau de joueurs
    room.players = room.players.filter((player) => player !== client.id);

    console.log(`Joueur ${client.id} retiré de la room ${roomId}`);

    // Si la room est vide, on la supprime
    if (room.players.length === 0) {
      delete this.rooms[roomId];
      console.log(`Room ${roomId} supprimée car aucun joueur ne reste`);
    } else {
      // Sinon, on informe le joueur restant que la partie n'est plus prête
      // ouai mais on l'informe qu'elle est pas prête n'importe quand en fait
      // donc un joueur peut abandonner sans danger
      room.state = "waiting";
      this.server.to(roomId).emit('player-left', {
        message: 'Un joueur a quitté la partie',
        players: room.players,
        state: room.state,
      })
      //todo: changer les joueurs dans le gameboard si un joueur s'est déco
      // ou alors incrire les joueurs dedans au moment où ils rentrent dans les placements des bateaux
      console.log("gameBoard apres déco d'un joueur :\n", room.gameBoard)
    }
  }


  //todo: faire un player.ready=true et checket si les deux joueurs sont ready, ou les envoyer tous les deux sur le placement de bateu

  @SubscribeMessage('ready')
  handleReady(@MessageBody() data: {ready: string}, @ConnectedSocket() client: Socket) {
    console.log("handleReady");
    // Trouve la room du joueur
    const roomId = Object.keys(this.rooms).find((id) =>
      this.rooms[id].players.includes(client.id),
    );
    if (!roomId) {
      this.server.to(client.id).emit('error', "Vous n'êtes pas dans une partie valide !");
      return;
    }
    const room = this.rooms[roomId];
    // Marque le joueur comme prêt
    room.playerReady[client.id] = true;
    console.log(`Joueur ${client.id} prêt dans la room ${roomId}`);
    console.log('playerReady:', room.playerReady);
    // Vérifie si tous les joueurs sont prêts
    const allReady = room.players.every((playerId) => room.playerReady[playerId]);
    if (allReady) {
      // Si tous les joueurs sont prêts, on passe à l'étape suivante
      room.state = 'placement';
      console.log(`Tous les joueurs sont prêts. On passe au placement des bateaux dans la room ${roomId}.`);
      this.server.to(roomId).emit('placement-start', {
        message: 'Tous les joueurs sont prêts. Passez au placement des bateaux !',
        state: room.state
      });
    } else {
      // Informe les joueurs que l'autre joueur n'est pas encore prêt
      this.server.to(roomId).emit('waiting-for-opponent', {
        message: 'En attente de l’autre joueur...',
        playerReady: room.playerReady
      });
    }
  }

  @SubscribeMessage('ship-placement')
  handleShipPlacement(@MessageBody() data: { x: number, y: number }[], @ConnectedSocket() client: Socket): void {
    console.log(data)
  }

  // Méthode pour écouter les messages envoyés par le front sur la route move
  @SubscribeMessage('move')
  handlePlayerMove(@MessageBody() data: { detail: string, x: number, y: number }, @ConnectedSocket() client: Socket): void {
    // Trouve la room du joueur
    const roomId = Object.keys(this.rooms).find((id) =>
      this.rooms[id].players.includes(client.id)
    )

    if (!roomId) {
      client.emit("error", "Vous n'êtes pas dans une partie valide");
      return;
    }

    // Diffuser aux autres joueurs de la même room
    console.log("move", data);
    this.server.to(roomId).emit('move', {
      player: client.id,
      move: data,
    });
  }
}