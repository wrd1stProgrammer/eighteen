const Order = require("../../models/Order");
const NewOrder = require("../../models/NewOrder"); // NewOrder 모델 추가
const User = require("../../models/User");
const { sendPushNotification } = require("../../utils/sendPushNotification");
const { invalidateOnGoingOrdersCache,invalidateCompletedOrdersCache} = require("../../utils/deleteRedisCache");

// 공통 소켓 이벤트 발송 함수
const emitOrderStatus = (req, order, status) => {
  const tossOrderStatus = req.app.get("tossOrderStatus");

  if (!tossOrderStatus) {
    console.warn("tossOrderStatus is not available");
    return;
  }

  const userId = order.userId; // Order 또는 NewOrder에서 userId 가져오기
  if (!userId) {
    console.warn("User ID not found in order data");
    return;
  }

  const eventData = {
    status,
    userId,
    createdAt: order.createdAt,
    orderId: order._id,
  };

  tossOrderStatus(eventData);
  console.log(`Emitted order_${status} to user ${userId}:`, eventData);
};

// 모델 선택 헬퍼 함수
const getOrderModel = (orderType) => {
  if (orderType === "Order") return Order;
  if (orderType === "NewOrder") return NewOrder;
  throw new Error("Invalid orderType. Must be 'Order' or 'NewOrder'");
};

// goToCafeHandler
const goToCafeHandler = async (req, res) => {
  try {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4;

    const { orderId, orderType } = req.body;
    console.log(orderId, "orderId 있음?", orderType, "orderType 있음?");

    const OrderModel = getOrderModel(orderType);
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: `${orderType} not found` });
    }

    order.status = "goToCafe";
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);

    emitOrderStatus(req, order, "goToCafe");

    res.status(200).json({ message: "Order status updated to goToCafe" });
  } catch (error) {
    console.error("Error in goToCafeHandler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// makingMenuHandler
const makingMenuHandler = async (req, res) => {
  try {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4;

    const { orderId, orderType } = req.body;
    const OrderModel = getOrderModel(orderType);
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: `${orderType} not found` });
    }

    order.status = "makingMenu";
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);

    emitOrderStatus(req, order, "makingMenu");

    res.status(200).json({ message: "Order status updated to makingMenu" });
  } catch (error) {
    console.error("Error in makingMenuHandler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// goToClientHandler
const goToClientHandler = async (req, res) => {
  try {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4;

    const { orderId, orderType } = req.body;
    const OrderModel = getOrderModel(orderType);
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: `${orderType} not found` });
    }

    order.status = "goToClient";
    await order.save();

    await invalidateOnGoingOrdersCache(order.userId, redisCli);

    emitOrderStatus(req, order, "goToClient");

    res.status(200).json({ message: "Order status updated to goToClient" });
  } catch (error) {
    console.error("Error in goToClientHandler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// completeOrderHandler
const completeOrderHandler = async (req, res) => {
  try {
    const redisClient = req.app.get("redisClient");
    const redisCli = redisClient.v4;
    const userId = req.user.userId;

    const rideruser = await User.findById(userId);
    rideruser.isDelivering = false;
    rideruser.save();


    const { orderId, orderType } = req.body;
    const OrderModel = getOrderModel(orderType);
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: `${orderType} not found` });
    }

    order.status = "delivered";
    await order.save();
    
    await invalidateOnGoingOrdersCache(order.userId, redisCli);
    await invalidateCompletedOrdersCache(order.userId, redisCli);

    emitOrderStatus(req, order, "delivered");

    // 주문자 정보 조회 및 푸시 알림 전송
    const orderUser = await User.findById(order.userId).select('fcmToken').lean();
    if (orderUser && orderUser.fcmToken) {
      const notificationPayload = {
        title: "주문이 완료되었습니다!",
        body: `주문 ${orderId}이(가) 성공적으로 배달 완료되었습니다.`,
        data: { type: "order_complete", orderId: orderId },
      };

      try {
        //await sendPushNotification(orderUser.fcmToken, notificationPayload);
        console.log(`주문자 ${order.userId}에게 알림 전송 성공`);
      } catch (notificationError) {
        console.error(`주문자 ${order.userId}에게 알림 전송 실패:`, notificationError);
      }
    } else {
      console.log(`주문자 ${order.userId}의 FCM 토큰이 없습니다.`);
    }

    res.status(200).json({ message: "Order status updated to delivered" });
  } catch (error) {
    console.error("Error in completeOrderHandler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  goToCafeHandler,
  makingMenuHandler,
  goToClientHandler,
  completeOrderHandler,
};