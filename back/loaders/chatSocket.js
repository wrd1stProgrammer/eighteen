const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");
const ChatMessage = require("../models/ChatMessage");


module.exports = (chatIo) => {
  if (!chatIo) {
    console.error("Chat Socket.IO 객체가 전달되지 않았습니다.");
    return;
  }

  //  채팅 소켓 연결 미들웨어 (토큰 인증)
  chatIo.use(async (socket, next) => {
    console.log("[ChatSocket] Middleware 실행 중...");
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("토큰이 없습니다."));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decodedToken;
      const user = await User.findById(socket.user.userId);
      if (!user) {
        return next(new Error("유효하지 않은 사용자입니다."));
      }
      next();
    } catch (err) {
      return next(new Error("토큰 검증 실패: " + err.message));
    }
  });

  // 채팅 연결 및 이벤트 설정
  chatIo.on("connection", (socket) => {
    console.log(`[ChatSocket] User ${socket.user.userId} connected`);

    socket.on("room-list", async ({ token }) => {
      try {
        console.log("room-list server log");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;

        // MongoDB에서 사용자의 채팅방 목록 조회 --> 이것이 문제일 수 있다
        const chatRooms = await ChatRoom.find({
          $or: [
            { participants: new mongoose.Types.ObjectId(userId) }, // ✅ 올바른 변환 방식
            { users: new mongoose.Types.ObjectId(userId) } // ✅ 올바른 변환 방식
          ]
        });
        

        const chatRoomList = chatRooms.map((room) => ({
          id: room._id.toString(),
          title: room.title,
          lastChat: room.lastMessage || "대화 없음",
          lastChatAt: room.updatedAt,
          isAlarm: room.isAlarm || false,
          image: room.image || "",
        }));

        socket.emit("room-list", { data: { chatRoomList } });
      } catch (error) {
        console.error("[ChatSocket] room-list 조회 실패:", error);
        socket.emit("error", { message: "채팅방 목록을 가져오는 중 오류 발생" });
      }
    });

    // 특정 채팅방의 메시지 불러오기 (`chat-list`)
    socket.on("chat-list", async ({ token, chatRoomId }) => {
        try {
          const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          const userId = decodedToken.userId;
  
          // 해당 채팅방의 메시지 조회
          const chatMessages = await ChatMessage.find({ chatRoomId }).sort("createdAt");
  
          const formattedMessages = chatMessages.map((msg) => ({
            id: msg._id.toString(),
            content: msg.content,
            timestamp: msg.createdAt,
            isMe: msg.sender.toString() === userId,
          }));
  
          socket.emit("chat-list", { data: { chatList: formattedMessages } });
        } catch (error) {
          console.error("[ChatSocket] chat-list 조회 실패:", error);
          socket.emit("error", { message: "채팅 내역을 가져오는 중 오류 발생" });
        }
      });

    //  메시지 전송 처리 (`sendMessage` 이벤트)
    socket.on("sendMessage", async ({ chatRoomId, message }) => {
        try {
          const userId = socket.user.userId;
  
          // 1. 채팅 메시지 저장
          const newMessage = new ChatMessage({
            chatRoomId,
            sender: userId,
            content: message,
          });
  
          await newMessage.save();
  
          //  2. 채팅방의 마지막 메시지 업데이트
          await ChatRoom.findByIdAndUpdate(chatRoomId, {
            lastMessage: message,
            lastMessageAt: new Date(),
          });
  
          //  3. 해당 채팅방의 모든 사용자에게 메시지 전송
          chatIo.to(chatRoomId).emit("chatMessage", {
            id: newMessage._id.toString(),
            sender: userId,
            content: message,
            createdAt: newMessage.createdAt,
          });
  
          console.log(`[ChatSocket] Message sent in Room ${chatRoomId}: ${message}`);
        } catch (error) {
          console.error("[ChatSocket] sendMessage Error:", error);
        }
    });
  


    socket.on("disconnect", () => {
      console.log(`[ChatSocket] User ${socket.user.userId} disconnected`);
    });
  });
};

