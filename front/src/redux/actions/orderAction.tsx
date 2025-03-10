import { appAxios } from '../config/apiConfig';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
import { useAppDispatch } from '../config/reduxHook';
import { clearMenu } from '../reducers/menuSlice';



// 지금 배달 Action
export const orderNowHandler = (
  items:any[], // 명시적으로 타입 정의
  lat: string,
  lng: string,
  resolvedAddress: string | null,
  startTime: number, // 픽업희망 시간간
  endTime: number, // 픽업희망 시간간

  isMatch: boolean,
  deliveryType: 'direct' | 'cupHolder',
  deliveryFee: Number,
  riderRequest: string,
  selectedFloor: string | null,
  price: number | null,
  quantity: number | null,
  selectedImageUri: string | null
) => async (dispatch: any) => {
  try {
    const res = await appAxios.post(`/order/orderNow`, {
      items,
      lat,
      lng,
      resolvedAddress,
      startTime,  //시작
      endTime,    //끝끝
      isMatch,
      deliveryType,
      deliveryFee,
      riderRequest,
      selectedFloor, //선택한 층을 받아야 함함
      price,
      quantity,
      selectedImageUri
    });

        // 주문 성공 시 상태 초기화
    dispatch(clearMenu());

    return res.data;
  } catch (error) {
    console.error('주문 요청 실패:', error);
    throw error;
  }
};


  //예약 배달 Action
  export const orderLaterHandler = (
    items: any[],
    lat: string,
    lng: string,
    resolvedAddress: string | null,
    startTime: number, // 주문시작 시간 (예약때만 쓰자);
    endTime: Number, // any?
    isMatch: boolean,
    deliveryType: 'direct' | 'cupHolder' ,
    deliveryFee: Number,
    riderRequest: string,
    selectedFloor: string | null,
    price: number | null,
    quantity: number | null,
    selectedImageUri: string | null

  ) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/order/orderLater`, {
        items, 
        lat,
        lng,
        resolvedAddress,
        isMatch,
        deliveryType,
        
        startTime,    //시작
        endTime,     //끝나느시간간
        deliveryFee,
        riderRequest,
        selectedFloor,      //선택한 층을 받아야 함함
        price,
        quantity,
        selectedImageUri
      });

              // 주문 성공 시 상태 초기화
    dispatch(clearMenu());
  
      return res.data;
    } catch (error: any) {
      console.error('주문 요청 실패:', error);
      throw error;
    }
  };

  export const getCompletedOrdersHandler =() => async(dispatch:any) => {
    try {
      const res = await appAxios.get(`/order/getCompletedOrders`);
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  export const getOngoingOrdersHandler =() => async(dispatch:any) => {
    try {
      const res = await appAxios.get(`/order/getOngoingOrders`);
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  export const getCompletedNewOrdersHandler =() => async(dispatch:any) => {
    try {
      const res = await appAxios.get(`/order/getNewCompletedOrderPresent`);
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  export const getOngoingNewOrdersHandler = () => async(dispatch:any) => {
    try {
      const res = await appAxios.get(`/order/getNewOrderPresent`);
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  // 

  export const getDeliveryListHandler =() => async(dispatch:any) => {
    try {
      const res = await appAxios.get(`/order/getDeliveryList`);
      //console.log(res);
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  export const ReStartLocationGetDeliveryListHandler =() => async(dispatch:any) => {
    try {
      const res = await appAxios.get(`/order/ReStartLocationGetDeliveryList`);
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  export const getChatRoomIdAndUploadImage =(orderId:string) => async(dispatch:any) => {
    try {
      const res = await appAxios.post(`/rider/getroomId`,{
        orderId
      });
      console.log(res);

      return res.data.roomId;
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }


  export const showOrderDetails = (orderId: string, orderType: string) => async (dispatch: any) => {
    try {
      const res = await appAxios.post('/order/showOrderDetails', {
        orderId,
        orderType
      });
      return res.data;
    } catch (error: any) {
      console.error('주문 상세조회 요청 실패:', error);
      return [];
    }
  };

  
  export const getNewOrderToBanner =() => async(dispatch:any) => {
    try {
      const res = await appAxios.get(`/order/getbannerdata`);
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  export const cancelOrderAction =(orderId:string,orderType:string,cancelReason:string,refundAmount:number,penaltyAmount:number) => async(dispatch:any) => {
    try {
      const res = await appAxios.post(`/order/cancelOrderAction`,{
        orderId,
        orderType,
        cancelReason,
        refundAmount,
        penaltyAmount,
      });
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  export const rateStarsAction =(orderId:string, rating:number) => async(dispatch:any) => {
    try {
      const res = await appAxios.post(`/order/raterider`, {
        orderId,
        rating,
      });
      return res.data
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }