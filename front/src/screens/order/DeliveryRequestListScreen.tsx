import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAppDispatch, useAppSelector } from "../../redux/config/reduxHook";
import {
  getCompletedOrdersHandler,
  getOngoingOrdersHandler,
} from "../../redux/actions/orderAction";
import { WebSocketContext } from "../../utils/Socket";
import { selectUser } from "../../redux/reducers/userSlice";

interface OrderItem {
  _id: string;
  items: { cafeName: string; menuName: string }[];
  lat: string;
  lng: string;
  deliveryType: string;
  status: string;
  startTime: string;
  deliveryFee: number;
  createdAt: number;
  riderRequest: string;
  endTime: string
  selectedFloor: null | string
}

const DeliveryRequestListScreen: React.FC = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(route.params?.loading ?? true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const user = useAppSelector(selectUser);

  const fetchOrders = async () => {
    try {
      const completedOrdersResponse = await dispatch(getCompletedOrdersHandler());
      const ongoingOrdersResponse = await dispatch(getOngoingOrdersHandler());

      const allOrders = [
        ...(completedOrdersResponse || []),
        ...(ongoingOrdersResponse || []),
      ];

      allOrders.sort((a: OrderItem, b: OrderItem) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setOrders(allOrders);
    } catch (error) {
      console.error("주문 데이터 가져오기 실패:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });

    socket?.on("emitMatchTest", () => {
      fetchOrders();
    });

    return () => {
      unsubscribe();
      socket?.off("emitMatchTest");
    };
  }, [navigation, socket]);

  const renderOrder = ({ item }: { item: OrderItem }) => (
    <View style={styles.card}>
      <View style={styles.rowHeader}>
        <Text style={styles.cafeName}>{item.items[0]?.cafeName}</Text>
        <TouchableOpacity>
          <Text style={styles.moreButton}>...</Text>
        </TouchableOpacity>
      </View>
      {item.deliveryType === "direct" ? <Text style={styles.address}>{`${item.lat}, ${item.lng}`}</Text> : <Text style={styles.address}>{item.selectedFloor}</Text>}
      
      <Text
        style={
          item.status === "pending"
            ? styles.pendingStatus
            : item.status === "inProgress"
            ? styles.inProgressStatus
            : styles.completedStatus
        }
      >
        {item.status === "pending"
          ? "수락 대기 중"
          : item.status === "inProgress"
          ? "수락 완료"
          : "완료"}
      </Text>
      <View style={styles.rowFooter}>
        <Text style={styles.deliveryType}>
          {item.deliveryType === "direct" ? "직접 배달" : "음료 보관함"}
        </Text>
        <Text style={styles.timeInfo}>{`${format(
          new Date(item.startTime),
          "HH:mm"
        )}`}</Text>
                <Text style={styles.timeInfo}>{`${format(
          new Date(item.endTime),
          "HH:mm"
        )}`}</Text>
      </View>
      <View style={styles.rowFooter}>

        <Text style={styles.deliveryFee}>{`${item.deliveryFee}원`}</Text>
        <Text style={styles.timeInfo}>{item.riderRequest}</Text>

        <Text style={styles.timeAgo}>{`${formatDistanceToNow(
          new Date(item.createdAt),
          { addSuffix: true, locale: ko }
        )}`}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{user?.username}님의 배달 요청 목록</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  moreButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ccc",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
  },
  rowFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  deliveryType: {
    fontSize: 14,
    color: "#333",
  },
  timeInfo: {
    fontSize: 14,
    color: "#666",
  },
  deliveryFee: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ee",
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
  },
  pendingStatus: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "bold",
  },
  inProgressStatus: {
    fontSize: 14,
    color: "#4caf50",
    fontWeight: "bold",
  },
  completedStatus: {
    fontSize: 14,
    color: "#6200ee",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeliveryRequestListScreen;
