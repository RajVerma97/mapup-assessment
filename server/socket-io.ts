import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server } from 'http';
import WeatherData from './api/models/weather';

export function setupSocketIO(server: Server) {
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  setInterval(async () => {
    const data = await WeatherData.find().limit(5); // Fetch last 100 records for demo
    io.emit('data update', data);
    console.log('data update emitted');
  }, 5000);

  console.log('Socket.IO server is running on port 3000');

  io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg: string) => {
      console.log('message from user', msg);
      io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}
