const jwt = require("jsonwebtoken");
const User = require("../models/User"); // User 모델 import

module.exports = (io) => {
  if (!io) {
    console.error("Socket.IO 객체가 전달되지 않았습니다.");
    return;
  }

  io.use(async (socket, next) => {
    console.log("Socket.IO Middleware 작동 중...");
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("client 에서 token 못 가져옴. (1)"));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decodedToken;

      const user = await User.findById(socket.user.userId);
      if (!user) {
        return next(new Error("User not found"));
      }

      // socket.user.username = user.username; // username 추가 -> 필요없을 듯.?
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.log("토큰이 만료되었습니다.");
        return next(new Error("Authentication error: Token expired"));
      } else {
        console.log("유효하지 않은 토큰입니다.");
        return next(new Error("Authentication error: Invalid token"));
      }
    }
  });

  // 소켓 연결
  io.on("connection", (socket) => {
    console.log(`${socket.user.userId} 연결되었습니다.`);

    const userRoom = socket.user.userId;
    socket.join(userRoom); // 사용자 전용 방에 조인

    socket.on("disconnect", () => {
      console.log(`${socket.user.userId} 연결 해제됨.`);
    });
  });

  // Test Socket 함수임.
  const emitSocketTest = (message) => {
    io.emit("socketTest", message);
  };
  
  const emitMatchTest = (message) => {
    io.emit("matchTest", message);
  }
  

  return { emitSocketTest,emitMatchTest };
};
