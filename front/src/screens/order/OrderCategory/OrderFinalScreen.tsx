import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch, useAppSelector } from "../../../redux/config/reduxHook";
import { neworderCompleteHandler } from "../../../redux/actions/newOrderAction";
import { launchImageLibrary, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';
import { uploadFile } from "../../../redux/actions/fileAction";
import { setIsOngoingOrder } from "../../../redux/reducers/userSlice";
import { Picker } from "@react-native-picker/picker";
import { reverseGeocode } from "../../../utils/Geolocation/reverseGeocode";
import Header from "../../../utils/OrderComponents/Header";
import Modal from 'react-native-modal';
import { selectUser } from "../../../redux/reducers/userSlice";
import { refetchUser } from "../../../redux/actions/userAction";

type RootStackParamList = {
  OrderFinalScreen: {
    name: string;
    orderDetails: string;
    priceOffer: string;
    deliveryFee: string;
    images: string;
    lat?: number;
    lng?: number;
    deliveryMethod: string;
    selectedMarker: any;
  };
  DeliveryNoticeScreen: undefined;
  CancelNoticeScreen: undefined;
};

type OrderFinalScreenRouteProp = RouteProp<RootStackParamList, "OrderFinalScreen">;

const OrderFinalScreen = () => {
  const route = useRoute<OrderFinalScreenRouteProp>();
  const { name, orderDetails, priceOffer, deliveryFee, images, lat, lng, deliveryMethod, selectedMarker } = route.params;

  const [deliveryAddress, setDeliveryAddress] = useState("없음");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [riderRequest, setRiderRequest] = useState("");
  const [floor, setFloorState] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [startTime, setStartTimeLocal] = useState(new Date());
  const [endTime, setEndTimeLocal] = useState(() => new Date(new Date().getTime() + 60 * 60 * 1000));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reservationChecked, setReservationChecked] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [points, setPoints] = useState(0); // 초기값을 0으로 설정
  const [usedPoints, setUsedPoints] = useState(0);

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // user.point가 변경될 때 points 상태 업데이트
  useEffect(() => {
    if (user?.point !== undefined) {
      setPoints(user.point); // user.point가 유효하면 설정
    }
  }, [user]);

  useEffect(() => {
    const fetchAddress = async () => { 
      if (lat && lng) {
        const fetchedAddress = await reverseGeocode(String(lat), String(lng));
        setResolvedAddress(fetchedAddress);
      }
    };
    fetchAddress();
  }, [lat, lng]);

  useEffect(() => {
    if (!reservationChecked) setStartTimeLocal(new Date());
  }, [reservationChecked]);

  useEffect(() => {
    setFloorState(deliveryMethod === "cupHolder");
  }, [deliveryMethod]);

  const handleNextPress = async () => {
    setIsLoading(true);
    const imageResponse = images ? await dispatch(uploadFile(images, "neworderInfo_image")) : null;
    const imageResponse2 = selectedImageUri ? await dispatch(uploadFile(selectedImageUri, "neworderPickup_image")) : null;
  
    await dispatch(neworderCompleteHandler(
      name,
      orderDetails,
      parseInt(priceOffer.replace("원", "").replace(",", "")),
      parseInt(deliveryFee.replace("원", "").replace(",", "")),
      riderRequest,
      imageResponse || "",
      imageResponse2 || "",
      lat?.toString() || "",
      lng?.toString() || "",
      deliveryAddress,
      deliveryMethod,
      startTime.getTime(),
      endTime.getTime(),
      selectedFloor,
      resolvedAddress,
      usedPoints // 포인트 사용량 추가
    ));
    await dispatch(refetchUser()); // point 감소 반영 떄매
    dispatch(setIsOngoingOrder(true));
    setTimeout(() => {
      setIsLoading(false);
      navigate("BottomTab", { screen: "DeliveryRequestListScreen" });
    }, 1000);
  };
  const handleImagePicker = async () => {
    const options: ImageLibraryOptions = { mediaType: "photo", includeBase64: true, selectionLimit: 1 };
    const response: ImagePickerResponse = await launchImageLibrary(options);
    if (response.didCancel) Alert.alert('취소');
    else if (response.errorMessage) Alert.alert('Error: ' + response.errorMessage);
    else if (response.assets && response.assets.length > 0) setSelectedImageUri(response.assets[0].uri || null);
  };

  const handleRemoveImage = () => setSelectedImageUri(null);

  const totalAmount = parseInt(priceOffer.replace("원", "").replace(",", "")) + parseInt(deliveryFee.replace("원", "").replace(",", ""));
  const finalAmount = totalAmount - usedPoints;

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}시 ${minutes < 10 ? "0" : ""}${minutes}분`;
  };

  const handlePointsChange = (text: string) => {
    const numericValue = parseInt(text.replace(/[^0-9]/g, "")) || 0;
    if (numericValue > points) {
      setUsedPoints(points);
    } else if (numericValue > totalAmount) {
      setUsedPoints(totalAmount);
    } else {
      setUsedPoints(numericValue);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>주문 접수 중...</Text>
        </View>
      ) : (
        <>
          <Header title={name} />
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
          >
            {!floor && (
              <>
                <Text style={styles.sectionTitle}>배달 주소</Text>
                <TextInput style={styles.input} value={resolvedAddress} editable={false} />
                <Text style={styles.sectionTitle}>상세 배달 주소</Text>
                <View style={styles.addressInputContainer}>
                  <TextInput
                    style={[styles.textArea, styles.addressInput]}
                    placeholder="상세 배달 주소를 입력해주세요"
                    placeholderTextColor="#999"
                    multiline
                    value={deliveryAddress}
                    onChangeText={setDeliveryAddress}
                  />
                  <TouchableOpacity onPress={selectedImageUri ? handleRemoveImage : handleImagePicker} style={styles.cameraIcon}>
                    <Ionicons
                      name={selectedImageUri ? "close-outline" : "camera-outline"}
                      size={24}
                      color={selectedImageUri ? "#ff3b30" : "#000"}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {floor && selectedMarker && (
              <>
                <Text style={styles.sectionTitle}>층 선택</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedFloor} onValueChange={(itemValue) => setSelectedFloor(itemValue)}>
                    <Picker.Item label="층을 선택해주세요" value="" />
                    {selectedMarker.floors.map((floor: string) => (
                      <Picker.Item key={floor} label={floor} value={floor} />
                    ))}
                  </Picker>
                </View>
              </>
            )}

            <Text style={styles.sectionTitle}>배달 요청 시간</Text>
            <View style={styles.timeContainer}>
              <TouchableOpacity
                style={[styles.timeInput, !reservationChecked && styles.disabledTimeInput]}
                onPress={() => reservationChecked && setShowStartPicker(true)}
              >
                <Text style={[styles.timeText, !reservationChecked && styles.disabledText]}>
                  {formatTime(startTime)}
                </Text>
              </TouchableOpacity>
              <Text style={styles.timeDivider}>~</Text>
              <TouchableOpacity style={styles.timeInput} onPress={() => setShowEndPicker(true)}>
                <Text style={styles.timeText}>{formatTime(endTime)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, reservationChecked && styles.toggleButtonActive]}
                onPress={() => setReservationChecked(!reservationChecked)}
              >
                <Text style={[styles.toggleText, reservationChecked && styles.toggleTextActive]}>
                  예약
                </Text>
              </TouchableOpacity>
            </View>

            <Modal isVisible={showStartPicker && reservationChecked} onBackdropPress={() => setShowStartPicker(false)}>
              <View style={styles.timePickerModal}>
                <Text style={styles.timePickerTitle}>시작 시간 선택</Text>
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowStartPicker(false);
                    if (selectedDate) {
                      if (selectedDate < new Date()) {
                        Alert.alert("유효하지 않은 시간", "현재 시간보다 이전 시간을 선택할 수 없습니다.");
                        return;
                      }
                      setStartTimeLocal(selectedDate);
                      if (selectedDate >= endTime) {
                        setEndTimeLocal(new Date(selectedDate.getTime() + 60 * 60 * 1000));
                      }
                    }
                  }}
                />
              </View>
            </Modal>

            <Modal isVisible={showEndPicker} onBackdropPress={() => setShowEndPicker(false)}>
              <View style={styles.timePickerModal}>
                <Text style={styles.timePickerTitle}>종료 시간 선택</Text>
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(false);
                    if (selectedDate) {
                      if (selectedDate <= startTime) {
                        Alert.alert("유효하지 않은 시간", "종료 시간은 시작 시간보다 늦어야 합니다.");
                        return;
                      }
                      setEndTimeLocal(selectedDate);
                    }
                  }}
                />
              </View>
            </Modal>

            <Text style={styles.sectionTitle}>주문 요청사항</Text>
            <TextInput
              style={styles.textArea}
              placeholder="요청사항을 입력해주세요"
              placeholderTextColor="#999"
              multiline
              value={riderRequest}
              onChangeText={setRiderRequest}
            />

            <View style={styles.pointsContainer}>
              <Text style={styles.sectionTitle}>포인트 사용</Text>
              <Text style={styles.pointsBalance}>보유 포인트: {points.toLocaleString()}P</Text>
              <View style={styles.pointsInputContainer}>
                <TextInput
                  style={styles.pointsInput}
                  placeholder="사용할 포인트를 입력하세요"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={usedPoints.toString()}
                  onChangeText={handlePointsChange}
                />
                <TouchableOpacity
                  style={styles.pointsAllButton}
                  onPress={() => setUsedPoints(Math.min(points, totalAmount))}
                >
                  <Text style={styles.pointsAllButtonText}>전액 사용</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.paymentContainer}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>결제 금액</Text>
                <Text style={styles.paymentTotal}>{finalAmount.toLocaleString()}원</Text>
              </View>
              <View style={styles.paymentDetail}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentSubLabel}>총 금액</Text>
                  <Text style={styles.paymentSubValue}>{totalAmount.toLocaleString()}원</Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentSubLabel}>메뉴 금액</Text>
                  <Text style={styles.paymentSubValue}>{parseInt(priceOffer.replace("원", "").replace(",", "")).toLocaleString()}원</Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentSubLabel}>배달팁</Text>
                  <Text style={styles.paymentSubValue}>{parseInt(deliveryFee.replace("원", "").replace(",", "")).toLocaleString()}원</Text>
                </View>
                {usedPoints > 0 && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentSubLabel}>포인트 할인</Text>
                    <Text style={styles.discountValue}>-{usedPoints.toLocaleString()}원</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity style={styles.noticeRow} onPress={() => navigate("DeliveryNoticeScreen")}>
              <Text style={styles.noticeText}>배달 상품 주의사항 동의</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.noticeRow} onPress={() => navigate("CancelNoticeScreen")}>
              <Text style={styles.noticeText}>배달 취소 주의사항 동의</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <Text style={styles.confirmText}>위 내용을 확인하였으며 결제에 동의합니다</Text>
          </ScrollView>

          <TouchableOpacity style={styles.kakaoPayButton} onPress={handleNextPress}>
            <Text style={styles.kakaoPayButtonText}>{finalAmount.toLocaleString()}원 카카오페이 결제</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  contentContainer: {
    paddingBottom: 120, // 하단 버튼과 내용이 겹치지 않도록 여백 확보
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 80,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
  },
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  addressInput: {
    flex: 1,
    marginBottom: 0,
  },
  cameraIcon: {
    padding: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  timeInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  disabledTimeInput: {
    backgroundColor: "#f5f5f5",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
  },
  disabledText: {
    color: "#999",
  },
  timeDivider: {
    fontSize: 16,
    color: "#666",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  toggleButtonActive: {
    backgroundColor: "#007aff",
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
  },
  toggleTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  timePickerModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    alignItems: "center",
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  pointsContainer: {
    marginBottom: 20,
  },
  pointsBalance: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  pointsInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pointsInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  pointsAllButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#007aff",
    borderRadius: 10,
  },
  pointsAllButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  paymentContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentDetail: {
    marginTop: 12,
  },
  paymentLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  paymentTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007aff",
  },
  paymentSubLabel: {
    fontSize: 14,
    color: "#666",
  },
  paymentSubValue: {
    fontSize: 14,
    color: "#333",
  },
  discountValue: {
    fontSize: 14,
    color: "#007aff",
    fontWeight: "600",
  },
  noticeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  noticeText: {
    fontSize: 16,
    color: "#333",
  },
  confirmText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  kakaoPayButton: {
    backgroundColor: "#FFE812",
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  kakaoPayButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3A1D1D",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
});

export default OrderFinalScreen;