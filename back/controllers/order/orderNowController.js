const Order = require("../../models/Order");
const User = require("../../models/User");
// const io = require("socket.io")(server); // 또는 app.get('io')를 사용할 수도 있음

const orderNowDirectCreate = async (req, res) => {
  const { items, lat, lng, isMatch, deliveryType, pickupTime } = req.body;

  const userId = req.user.userId; // authMiddleWare 에서 가져옴.
  console.log(userId);

  try {
    // 배달 타입이 'direct'인지 확인
    if (deliveryType === "direct") {
      const order = new Order({
        userId: userId, // authMiddleware로 사용자 확인
        items,
        lat,
        lng,
        isMatch,
        deliveryType,
        pickupTime,
      });

      const savedOrder = await order.save();


      return res.status(201).json(savedOrder);
    } else if (deliveryType === "cupHolder") {
      // cupHolder 배달 처리 로직
      return res
        .status(400)
        .json({ message: "현재 cupHolder 배달 타입은 지원하지 않습니다." });
    } else {
      return res.status(400).json({ message: "잘못된 배달 타입입니다." });
    }
  } catch (error) {
    console.error("주문 생성 실패:", error);
    return res.status(500).json({ message: "주문 생성에 실패했습니다." });
  }
};

const matchRider = async (req, res) => {
  const { orderId, riderId } = req.body; // 주문자 라이더

  try {
    const order = await Order.findById(orderId); // 주문자 모델 찾기
    if (!order)
      return res.status(404).json({ message: "주문을 찾을 수 없습니다." });

    order.status = "matched"; // 매칭상태 업데이트
    order.riderId = riderId; // 라이더ID 지정.
    await order.save();


    res.status(200).json(order);
  } catch (error) {
    console.error("배달자 매칭 실패:", error);
    res.status(500).json({ message: "배달자 매칭에 실패했습니다." });
  }
};

module.exports = {
  orderNowDirectCreate,
  matchRider,
};
