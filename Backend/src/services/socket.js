const socketIo = require("socket.io");

let io; // Khai báo biến io

const userSockets = new Map();

const setupSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*", // URL của ứng dụng React
      // methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("subscribe", async ({ userId }) => {
      console.log("User subscribed:", userId);
      userSockets.set(userId, socket);

      //   const rooms = await Room.find({});
      //   socket.emit("initial-room-status", rooms);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      for (const [userId, userSocket] of userSockets.entries()) {
        if (userSocket === socket) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

const notifyAllClients = (emit, data) => {
  if (io) {
    io.emit(emit, data); // Gửi sự kiện đến tất cả clients
  } else {
    console.log("Socket.io chưa được khởi tạo");
  }
};

module.exports = {
  setupSocket,
  notifyAllClients,
};
