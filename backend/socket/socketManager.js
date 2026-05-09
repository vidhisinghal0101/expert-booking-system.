let ioInstance = null;

const initSocket = (httpServer) => {
  const { Server } = require('socket.io');
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
      credentials: true
    }
  });

  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('joinExpertRoom', (expertId) => {
      const room = `expert_${expertId}`;
      socket.join(room);
      console.log(`[Socket] ${socket.id} joined room: ${room}`);
    });

    socket.on('leaveExpertRoom', (expertId) => {
      const room = `expert_${expertId}`;
      socket.leave(room);
      console.log(`[Socket] ${socket.id} left room: ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const emitSlotBooked = (io, expertId, date, timeSlot) => {
  const room = `expert_${expertId}`;
  io.to(room).emit('slotBooked', { expertId, date, timeSlot });
  console.log(`[Socket] Emitted slotBooked to room ${room}: ${date} ${timeSlot}`);
};

const getIO = () => ioInstance;

module.exports = { initSocket, emitSlotBooked, getIO };
