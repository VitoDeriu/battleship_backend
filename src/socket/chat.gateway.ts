import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(4001, {cors: true} ) //on active cors pour autoriser les connexions entrantes
export class ChatGateway {

  //todo: faire le websocket server

  //SubscribeMessage représente les 'routes' du serveur
  @SubscribeMessage('message')
  sendMessage(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log('message :', data);
    socket.emit('chat', 'Jai bien reçu le message');
  }
}




// @SubscribeMessage('caca')
// caca(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
//   console.log('caca :', data);
//   socket.emit('chat', 'Jai bien recu ton caca');
// }