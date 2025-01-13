import { Image, TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { goBack, navigate } from '../../navigation/NavigationUtils';
import { useAppSelector, useAppDispatch } from '../../redux/config/reduxHook';
import { selectMenu, updateQuantity, removeItem } from '../../redux/reducers/menuSlice';

interface MenuItem {
  _id: string;
  menuName: string;
  cafeName: string;
  price: number | string;
  imageUrl: string;
  quantity: number;
}


const BasketScreen: React.FC = () => {
  const [deliveryMethod, setDeliveryMethod] = useState('direct'); // 배달방식 선택 상태
  const menu = useAppSelector(selectMenu);
  const dispatch = useAppDispatch();

  const increaseQuantity = (id: string) => {
    const item = menu.items.find((item) => item._id === id);
    if (item) {
      dispatch(updateQuantity({ id, quantity: item.quantity + 1 }));
    }
  };

  const removeMenuItem = (id: string) => {
    dispatch(updateQuantity({ id, quantity: 0 }));
    dispatch(removeItem(id));
  };

  const decreaseQuantity = (id: string) => {
    const item = menu.items.find((item) => item._id === id);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ id, quantity: item.quantity - 1 }));
    }
  };

  const calculateTotal = () => {
    return menu.items.reduce((total, item) => {
      const priceNumber =
        typeof item.price === 'string'
          ? parseInt(item.price.replace(/\D/g, ''), 10)
          : item.price;
      return total + priceNumber * item.quantity;
    }, 0);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeMenuItem(item._id)}
      >
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>

      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.itemName}>{item.menuName}</Text>
        <Text style={styles.price}>
          {typeof item.price === 'string'
            ? item.price
            : `${item.price.toLocaleString()}원`}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item._id)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => increaseQuantity(item._id)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>장바구니</Text>
      </View>

      <FlatList
        data={menu.items}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.menuList}
      />

      <View style={styles.footer}>
        <View style={styles.deliveryMethodContainer}>
          <Text style={styles.deliveryMethodTitle}>배달방식을 선택해주세요</Text>
          <View style={styles.deliveryButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.deliveryButton,
                deliveryMethod === 'direct' && styles.selectedButton,
              ]}
              onPress={() => setDeliveryMethod('direct')}
            >
              <Text
                style={
                  deliveryMethod === 'direct'
                    ? styles.selectedButtonText
                    : styles.deliveryButtonText
                }
              >

                직접배달
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.deliveryButton,
                deliveryMethod === 'cupHolder' && styles.selectedButton,
              ]}
              onPress={() => setDeliveryMethod('cupHolder')}
            >
              <Text
                style={
                  deliveryMethod === 'cupHolder'
                    ? styles.selectedButtonText
                    : styles.deliveryButtonText
                }
              >
                음료보관대
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => navigate('OrderWriteLoacation', { deliveryMethod })}
        >
          <Text style={styles.orderButtonText}>
            {calculateTotal().toLocaleString()}원 배달 주문하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BasketScreen;

const styles = StyleSheet.create({
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4d4f',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuList: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    padding: 8,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deliveryMethodContainer: {
    marginBottom: 16,
  },
  deliveryMethodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deliveryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: '#d0a6f3',
  },
  deliveryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  orderButton: {
    backgroundColor: '#d0a6f3',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
