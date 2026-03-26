import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { MapPin, ChevronRight, Star, Search, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useData } from '@/contexts/DataContext';
import { Designer } from '@/types';

function DesignerCard({ designer, imageCount, previewImages }: { designer: Designer; imageCount: number; previewImages: { id: string; image_url: string }[] }) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push(`/designer/${designer.id}` as any);
  }, [router, designer.id]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
      testID={`designer-card-${designer.id}`}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: designer.avatar_url }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.studioName} numberOfLines={1}>{designer.studio_name}</Text>
            {designer.featured && (
              <Star size={11} color={Colors.accent} fill={Colors.accent} />
            )}
          </View>
          <View style={styles.locationRow}>
            <MapPin size={11} color={Colors.textTertiary} />
            <Text style={styles.locationText}>{designer.city}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.countText}>{imageCount} images</Text>
          </View>
        </View>
        <ChevronRight size={18} color={Colors.textTertiary} />
      </View>

      <Text style={styles.bio} numberOfLines={2}>{designer.bio}</Text>

      {previewImages.length > 0 && (
        <View style={styles.previewRow}>
          {previewImages.map(img => (
            <Image
              key={img.id}
              source={{ uri: img.image_url }}
              style={styles.previewImage}
              contentFit="cover"
              transition={300}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const MemoizedDesignerCard = React.memo(DesignerCard);

export default function DesignersScreen() {
  const { designers, getImagesForDesigner } = useData();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const searchAnim = useRef(new Animated.Value(0)).current;

  const toggleSearch = useCallback(() => {
    if (searchVisible) {
      Animated.timing(searchAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start(() => {
        setSearchVisible(false);
        setSearchQuery('');
      });
    } else {
      setSearchVisible(true);
      Animated.timing(searchAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [searchVisible, searchAnim]);

  const sortedDesigners = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const sorted = [...designers].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    if (!q) return sorted;
    return sorted.filter(d =>
      d.studio_name.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.bio.toLowerCase().includes(q)
    );
  }, [designers, searchQuery]);

  const renderItem = useCallback(({ item }: { item: Designer }) => {
    const imgs = getImagesForDesigner(item.id);
    return (
      <MemoizedDesignerCard
        designer={item}
        imageCount={imgs.length}
        previewImages={imgs.slice(0, 3)}
      />
    );
  }, [getImagesForDesigner]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleSearch}
              style={styles.searchButton}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {searchVisible ? (
                <X size={18} color={Colors.textPrimary} strokeWidth={1.8} />
              ) : (
                <Search size={18} color={Colors.textPrimary} strokeWidth={1.8} />
              )}
            </TouchableOpacity>
          ),
        }}
      />

      {searchVisible && (
        <Animated.View style={[styles.searchBar, { opacity: searchAnim }]}>
          <Search size={16} color={Colors.textTertiary} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search studios, cities..."
            placeholderTextColor={Colors.textTertiary}
            returnKeyType="search"
            autoCorrect={false}
            testID="designers-search-input"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={14} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      <FlatList
        data={sortedDesigners}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.headerSubtitle}>
            {sortedDesigners.length} vetted studio{sortedDesigners.length !== 1 ? 's' : ''}{searchQuery ? ' found' : ' in Chicago'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No designers match your search</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    height: 40,
    fontFamily: Fonts.body,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontFamily: Fonts.body,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 0.4,
    marginBottom: 14,
    marginTop: 4,
    fontFamily: Fonts.body,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceAlt,
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studioName: {
    fontSize: 14,
    fontFamily: Fonts.headingMedium,
    color: Colors.textPrimary,
    letterSpacing: -0.1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  dot: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  countText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  bio: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 10,
    fontFamily: Fonts.body,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 12,
  },
  previewImage: {
    flex: 1,
    height: 68,
    borderRadius: 5,
    backgroundColor: Colors.surfaceAlt,
  },
});
