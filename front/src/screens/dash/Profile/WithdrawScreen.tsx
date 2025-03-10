import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate, goBack } from '../../../navigation/NavigationUtils';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { refetchUser, withdrawAction, getWithdrawList } from '../../../redux/actions/userAction';

interface User {
  account?: {
    bankName: string;
    accountNumber: string;
    holder: string;
  };
  point: number;
}

interface WithdrawScreenProps {
  route: {
    params: {
      user: User;
    };
  };
}

interface WithdrawItem {
  id: string;
  date: string;
  amount: string;
  status: string;
}

const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ route }) => {
  const user = route.params.user;
  const [amount, setAmount] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawItem[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 자체 로딩 상태 추가

  const dispatch = useAppDispatch();

  // 출금 내역 불러오기
  useEffect(() => {
    const fetchWithdrawHistory = async () => {
      setIsLoading(true); // 로딩 시작
      try {
        const data = await dispatch(getWithdrawList());
        if (data && data.withdrawals) {
          setWithdrawHistory(data.withdrawals);
        }
      } catch (err) {
        console.error('Failed to fetch withdraw history:', err);
        Alert.alert('오류', '출금 내역을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchWithdrawHistory();
  }, [dispatch]);

  // 출금 처리 핸들러
  const handleWithdraw = async () => {
    if (!/^\d+$/.test(amount)) {
      Alert.alert('입력 오류', '숫자만 입력해주세요.');
      return;
    }

    const withdrawAmount = parseInt(amount, 10);
    const currentBalance = user.point || 0;

    if (withdrawAmount > currentBalance) {
      Alert.alert('출금 오류', '출금 가능한 액수를 초과했습니다.');
      return;
    }

    const fee = withdrawAmount * 0.08;
    const finalAmount = withdrawAmount - fee;

    Alert.alert(
      '출금 확인',
      `수수료 8%를 적용한 최종 출금 금액은 ₩${finalAmount.toLocaleString()}입니다.\n출금을 진행하시겠습니까? (24시간 내 처리 완료)`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: async () => {
            setIsLoading(true); // 출금 처리 중 로딩 시작
            try {
              await dispatch(withdrawAction(withdrawAmount, fee, finalAmount));
              console.log(`출금 요청: ₩${withdrawAmount}, 수수료: ₩${fee}, 최종: ₩${finalAmount}`);
              await dispatch(refetchUser());
              const updatedHistory = await dispatch(getWithdrawList());
              if (updatedHistory && updatedHistory.withdrawals) {
                setWithdrawHistory(updatedHistory.withdrawals);
              }
              Alert.alert('출금 완료', '출금이 요청되었습니다. 24시간 내 처리 완료됩니다.');
              setAmount('');
              goBack();
            } catch (err) {
              console.error('Withdraw error:', err);
              Alert.alert('오류', '출금 처리 중 오류가 발생했습니다.');
            } finally {
              setIsLoading(false); // 로딩 종료
            }
          },
          style: 'default',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>출금</Text>
      </View>
      <View style={styles.content}>
        {/* 계좌 정보 */}
        <View style={styles.accountInfo}>
          <Text style={styles.infoLabel}>은행명</Text>
          <Text style={styles.infoValue}>{user?.account?.bankName || '정보 없음'}</Text>
          <Text style={styles.infoLabel}>계좌번호</Text>
          <Text style={styles.infoValue}>{user?.account?.accountNumber || '정보 없음'}</Text>
          <Text style={styles.infoLabel}>예금주</Text>
          <Text style={styles.infoValue}>{user?.account?.holder || '정보 없음'}</Text>
        </View>

        {/* 출금 금액 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>출금 가능 금액 : {user.point}</Text>
          <TextInput
            style={styles.input}
            placeholder="₩0"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, '');
              setAmount(numericValue);
            }}
          />
        </View>

        {/* 출금 버튼 */}
        <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw} disabled={isLoading}>
          <Text style={styles.withdrawButtonText}>
            {isLoading ? '처리중...' : '출금하기'}
          </Text>
        </TouchableOpacity>

        {/* 출금 내역 */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>출금 내역</Text>
          {isLoading ? (
            <Text>로딩 중...</Text>
          ) : withdrawHistory.length === 0 ? (
            <Text>출금 내역이 없습니다.</Text>
          ) : (
            <FlatList
              data={withdrawHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <Text style={styles.historyAmount}>{item.amount}</Text>
                  <Text style={styles.historyStatus}>{item.status}</Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  content: { padding: 16 },
  accountInfo: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  inputSection: { marginBottom: 16 },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  withdrawButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  withdrawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  historySection: { marginTop: 16 },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  historyItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyDate: { fontSize: 14, color: '#666' },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 4,
  },
  historyStatus: { fontSize: 14, color: '#4CAF50' },
});

export default WithdrawScreen;