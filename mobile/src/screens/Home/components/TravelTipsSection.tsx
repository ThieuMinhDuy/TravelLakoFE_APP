import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { AppText, AppIcon } from '@components/common';
import { colors, fontFamilies, shadows } from '@theme';

interface TravelTip {
  id: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
  content: string;
}

const TRAVEL_TIPS: TravelTip[] = [
  {
    id: 'tip-1',
    title: '5 mẹo chuẩn bị hành lý gọn nhẹ cho chuyến đi dài ngày',
    category: 'Chuẩn bị',
    readTime: '3 phút đọc',
    image:
      'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=600&q=80',
    content:
      'Cuộn tròn quần áo thay vì gấp phẳng giúp tiết kiệm 40% diện tích vali. Luôn để đồ vệ sinh cá nhân vào túi zip trong suốt và mang theo pin sạc dự phòng trong hành lý xách tay.',
  },
  {
    id: 'tip-2',
    title: 'Thời điểm lý tưởng nhất để khám phá các vịnh đảo Việt Nam',
    category: 'Mùa du lịch',
    readTime: '5 phút đọc',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    content:
      'Từ tháng 3 đến tháng 8 là khoảng thời gian biển êm, nắng vàng rực rỡ nhất tại các đảo như Phú Quốc, Côn Đảo, Lý Sơn và Vịnh Hạ Long, rất thích hợp cho các hoạt động lặn biển và ngắm san hô.',
  },
  {
    id: 'tip-3',
    title: 'Checklist an toàn & bí quyết tối ưu chi phí du lịch tự túc',
    category: 'Bí quyết',
    readTime: '4 phút đọc',
    image:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    content:
      'Đặt vé máy bay và phòng khách sạn trước tối thiểu 3-4 tuần. Sử dụng ứng dụng TravelLako để theo dõi các ưu đãi giờ chót và lưu bản đồ ngoại tuyến trước khi đến những nơi sóng yếu.',
  },
];

const CARD_WIDTH = 250;

export const TravelTipsSection: React.FC = () => {
  const handleTipPress = (tip: TravelTip) => {
    Alert.alert(tip.title, tip.content, [{ text: 'Đã hiểu' }]);
  };

  const renderTipItem = ({ item }: { item: TravelTip }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => handleTipPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.tagBadge}>
          <AppText style={styles.tagText}>{item.category}</AppText>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <AppText style={styles.tipTitle} numberOfLines={2}>
          {item.title}
        </AppText>

        <View style={styles.metaRow}>
          <AppIcon
            name="clock"
            size={11}
            color={colors.text.muted}
            style={styles.clockIcon}
          />
          <AppText style={styles.readTimeText}>{item.readTime}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <AppText style={styles.sectionTitle}>Cẩm nang & Kinh nghiệm</AppText>
          <AppText style={styles.sectionSubtitle}>
            Kinh nghiệm hữu ích cho hành trình trọn vẹn
          </AppText>
        </View>
      </View>

      {/* Horizontal List */}
      <FlatList
        data={TRAVEL_TIPS}
        keyExtractor={(item) => item.id}
        renderItem={renderTipItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleGroup: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 20,
    color: '#0F172A',
    lineHeight: 24,
  },
  sectionSubtitle: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  tagText: {
    fontFamily: fontFamilies.sfProText.medium,
    fontSize: 10,
    color: '#FFFFFF',
  },
  infoContainer: {
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 80,
  },
  tipTitle: {
    fontFamily: fontFamilies.sfProDisplay.bold,
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  clockIcon: {
    marginRight: 4,
  },
  readTimeText: {
    fontFamily: fontFamilies.sfProText.regular,
    fontSize: 11,
    color: '#64748B',
  },
});

