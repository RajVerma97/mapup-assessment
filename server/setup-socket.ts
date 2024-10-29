import { Server } from 'socket.io';
import http from 'http';

class SocketService {
  public io;

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
      },
    });

    this.io.on('connection', (socket) => {
      console.log('User connected');
    });
  }

  emit(event: string, data: any) {
    console.log('Emitting event:', event, data);
    this.io.emit(event, data);
  }
}

module.exports = SocketService;
