import React, { useState, useEffect } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import MyAdBannerSection from './MyAdBannerSection';
import { Dimensions, View, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const bannerWidth = screenWidth; // 슬라이드 너비를 화면의 90%로 설정

export default function MyAdBanner() {
  const [slideTime, setSlideTime] = useState(1);

  const bannerLists = [
    { id: 1, imageUrl: 'https://m.wakers.shop/_dj/img/banner.jpg', title: '광고배너 1' },
    { id: 2, imageUrl: 'https://m.wakers.shop/_dj/img/banner.jpg', title: '광고배너 2' },
    { id: 3, imageUrl: 'https://m.wakers.shop/_dj/img/banner.jpg', title: '광고배너 3' },
  ];

  useEffect(() => {
    const autoTimer = setTimeout(() => setSlideTime(8), 1000);
    return () => clearTimeout(autoTimer);
  }, []);

  const renderItem = ({ item }) => {
    return <MyAdBannerSection data={item} bannerWidth={bannerWidth} />;
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={bannerLists}
        renderItem={renderItem}
        width={screenWidth} // 전체 슬라이더 너비
        height={120}
        itemWidth={bannerWidth} // 각 슬라이드 너비
        loop
        autoPlay
        autoPlayInterval={slideTime * 1000}
        mode="parallax" // 부드러운 슬라이드 효과
        modeConfig={{
          parallaxScrollingScale: 0.9, // 비활성 슬라이드 크기 조정
          parallaxScrollingOffset: 50, // 슬라이드 간 간격
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});