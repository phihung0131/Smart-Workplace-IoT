const socketIo = require("socket.io");

let io;

const userSockets = new Map();

const setupSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*", 
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("subscribe", async ({ userId }) => {
      console.log("User subscribed:", userId);
      userSockets.set(userId, socket);
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
    io.emit(emit, data); 
  } else {
    console.log("Socket.io chưa được khởi tạo");
  }
};

const notifyUser = (userId, event, data) => {
  const userSocket = userSockets.get(userId + "v2");
  if (userSocket) {
    userSocket.emit(event, data);
  } else {
    console.log(`Không tìm thấy socket cho user ${userId}`);
  }
};

module.exports = {
  setupSocket,
  notifyAllClients,
  notifyUser,
};
