const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    console.log(`${data.name} joined room`);
    socket.join('caro_room');
    io.to('caro_room').emit('chat_message', {
      name: 'System',
      message: `${data.name} đã tham gia phòng.`
    });
  });

  socket.on('chat_message', (data) => {
    io.to('caro_room').emit('chat_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});