import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Color from '../../constants/Colors';
import TYPOS from './etc/TYPOS';
import Pin24 from './etc/Pin24';
import FillPin24 from './etc/FillPin24';
import Bell16 from './etc/Bell16';
import PinIndicator from './etc/PinIndicator';
import { navigate } from '../../navigation/NavigationUtils';
import { selectChatRoom } from '../../redux/reducers/chatSlice';
import { useAppDispatch ,useAppSelector} from '../../redux/config/reduxHook';

interface Props {
  roomId: string;
  username:string;
  nickname:string;
  userImage: string;
  roomName: string;
  timeStamp: string;
  content: string;
  isNotificationEnabled?: boolean;
  onExitPressHandler?: () => void;
  onToggleNotificationHandler?: () => void;
  unreadCount:any;
}
// username -> nickname 교체 필요! 나중에 닉네임 부분 결정되면.
const ChatRoomItem = ({
  username,
  nickname,
  roomId,
  userImage,
  roomName,
  timeStamp,
  content,
  isNotificationEnabled,
  onExitPressHandler,
  onToggleNotificationHandler,
  unreadCount,
}: Props) => {
  const chatRoom = useAppSelector((state) => selectChatRoom(state, roomId));

  // 리덕스 값이 있으면 사용, 없으면 초기값 사용
  const latestContent = chatRoom?.lastChat ?? content;
  const latestTimeStamp = chatRoom?.lastChatAt ?? timeStamp;
  const latestUnreadCount = chatRoom?.unreadCount ?? unreadCount;

  const renderRightActions = () => {
    console.log(unreadCount,'안읽은메세지 카운트 더미 로그');
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable
          style={{
            backgroundColor: isNotificationEnabled
              ? Color.neutral3
              : Color.neutral2,
            width: 80,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onToggleNotificationHandler}
        >
          <Text style={[{ color: Color.white }, TYPOS.body1]}>{`알림 ${
            isNotificationEnabled ? '끄기' : '켜기'
          }`}</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: Color.error,
            width: 80,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onExitPressHandler}
        >
          <Text style={[{ color: Color.white }, TYPOS.body1]}>나가기</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} friction={1.5}>
      <Pressable onPress={() => navigate('ChatRoom', { roomId, username, nickname, userImage })}>
        <View style={{ backgroundColor: Color.white, padding: 16, flexDirection: 'row', position: 'relative' }}>
          <Image style={{ width: 48, height: 48, resizeMode: 'cover', borderRadius: 48, marginRight: 16 }} source={{ uri: userImage }} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[{ color: Color.black }, TYPOS.headline4]}>{username}</Text>
                {!isNotificationEnabled && <Bell16 color={Color.neutral2} />}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[{ color: Color.neutral2 }, TYPOS.body3]}>
                  {new Date(latestTimeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {latestUnreadCount > 0 && (
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Color.blue, marginLeft: 8 }} />
                )}
              </View>
            </View>
            <View>
              {latestUnreadCount > 0 ? (
                <Text style={[{ color: Color.blue }, TYPOS.body2]}>{`새 메시지 ${latestUnreadCount}개`}</Text>
              ) : (
                <Text style={[{ color: Color.neutral1 }, TYPOS.body2]}>{latestContent}</Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default ChatRoomItem;
