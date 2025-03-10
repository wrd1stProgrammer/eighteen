import { token_storage } from '../config/storage';
import { appAxios } from '../config/apiConfig';
import {setUser} from '../reducers/userSlice';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { requestUserPermission } from '../../utils/fcm/fcmToken';

const handleSignInSuccess = async (res: any, dispatch: any) => {
  token_storage.set('access_token', res.data.tokens.access_token);
  token_storage.set('refresh_token', res.data.tokens.refresh_token);
  await requestUserPermission(res.data.user._id);
  await dispatch(setUser(res.data.user));
  resetAndNavigate('BottomTab');
};


export const userlogin = (userId: string, password: string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/auth/login', {
      userId: userId,
      password: password,
    });

    console.log(userId,'userId');

    // 로그인 성공 시 처리
    await handleSignInSuccess(res, dispatch);
    
  } catch (error: any) {
    // 서버 에러 메시지 처리
    if (error.response) {
      console.error('로그인 실패:', error.response.data.message || error.response.data);
      Alert.alert('로그인 실패', error.response.data.message || '로그인에 실패했습니다.');
    } else {
      console.error('네트워크 에러:', error.message);
      Alert.alert('네트워크 오류', '서버와 연결되지 않았습니다. 나중에 다시 시도해주세요.');
    }
  }
};

export const kakaoLogin = (email:string) => async (dispatch: any) => {
  try {
    const res:any = await appAxios.post('/auth/kakaologin', {
      email,
      loginProvider:"kakao",
    });
    // 로그인 성공 시 처리
    await handleSignInSuccess(res, dispatch);
    
    return res.data;
    
  } catch (error: any) {
    // 서버 에러 메시지 처리
    if (error.response) {
      console.error('kakao 로그인 실패:', error.response.data.message || error.response.data);
      Alert.alert('kakao 로그인 실패', error.response.data.message || '로그인에 실패했습니다.');
    } else {
      console.error('네트워크 에러:', error.message);
      Alert.alert('네트워크 오류', '서버와 연결되지 않았습니다. 나중에 다시 시도해주세요.');
    }
  }
};



export const register = (email:string, userId:string, password:string, username:string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/auth/register',{
      email:email, 
      userId:userId,
      password:password,
      username:username,
    });
    resetAndNavigate('LoginScreen');
    
  } catch (error: any) {
    console.log('PROFILE ->', error);
  }
};

export const checkNicknameDuplicateAction = ( nickname:string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/auth/checkNickname',{
      nickname
    });
    return res.data;
    
  } catch (error: any) {
    console.log('닉네임 검증 에러 ->', error);
  }
};

export const checkUserIdDuplicateAction = ( userId:string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/auth/checkUserId',{
      userId,
    });
    return res.data;
    
  } catch (error: any) {
    console.log('닉네임 검증 에러 ->', error);
  }
};


export const checkEmailDuplicateAction = ( email:string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/auth/checkEmail',{
      email,
    });
    return res.data;
    
  } catch (error: any) {
    console.log('닉네임 검증 에러 ->', error);
  }
};


export const verifyEmail = (email:string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/auth/verifyEmail',{
      email:email, 
    });
    console.log(res);
    return res.data.verificationCode; // 6자리 난수 리턴. 이걸로 검증
    
  } catch (error: any) {
    console.log('verify error ->', error);
  }
};


export const refetchUser = () => async (dispatch: any) => {
  try {
    const res = await appAxios.get('/user/profile');
    await dispatch(setUser(res.data.user));
    
  } catch (error: any) {
    console.log('PROFILE ->', error);
  }
}; // api Ok.

export const Logout = () => async (dispatch: any) => {
  console.log("로그아웃 액션 동작");
  await token_storage.clearAll();
  await persistor.purge();
  resetAndNavigate('LoginScreen');
};


export const registerAccount = (bankName:string,accountNumber:number,holder:string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/user/registeraccount',{
      bankName,
      accountNumber,
      holder,
    });
    
  } catch (error: any) {
    console.log('account register ERROR ->', error);
  }
}; // ap

export const withdrawAction = (withdrawAmount:number,fee:number,finalAmount:number) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/user/withdraw',{
      withdrawAmount,
      fee,
      finalAmount,
    });
  } catch (error: any) {
    console.log('account register ERROR ->', error);
  }
}; // ap

export const getWithdrawList = () => async (dispatch: any) => {
  try {
    const res = await appAxios.get('/user/getwithdrawlist');
    return res.data;
  } catch (error: any) {
    console.log('account register ERROR ->', error);
  }
}; // ap

export const editProfileAction = (nickname:string,username:string,userImage?:string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/user/editprofile',{
      username,
      nickname,
      userImage,
    });
    return res.data;
  } catch (error: any) {
    console.log('editProfile ERROR ->', error);
  }
}; 