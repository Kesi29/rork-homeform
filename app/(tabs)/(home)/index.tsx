import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { Filters } from '@/types';
import { useData } from '@/contexts/DataContext';
import MasonryGrid from '@/components/MasonryGrid';
import FilterBar from '@/components/FilterBar';

export default function ExploreScreen() {
  const [filters, setFilters] = useState<Filters>({
    roomType: null,
    designStyle: null,
    projectType: null,
    location: null,
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const searchAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { getSortedImages, projects, designers, getDesignerForImage } = useData();
  const allImages = useMemo(() => getSortedImages(), [getSortedImages]);

  const filteredImages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allImages.filter(img => {
      if (filters.roomType && img.room_type !== filters.roomType) return false;
      if (filters.designStyle && !img.style_tags.includes(filters.designStyle)) return false;
      if (filters.projectType) {
        const project = projects.find(p => p.id === img.project_id);
        if (!project || project.project_type !== filters.projectType) return false;
      }
      if (filters.location) {
        const project = projects.find(p => p.id === img.project_id);
        if (!project || project.city !== filters.location) return false;
      }
      if (q) {
        const roomMatch = img.room_type.toLowerCase().includes(q);
        const styleMatch = img.style_tags.some(t => t.toLowerCase().includes(q));
        const designer = getDesignerForImage(img.id);
        const designerMatch = designer?.studio_name.toLowerCase().includes(q) ?? false;
        const project = projects.find(p => p.id === img.project_id);
        const projectMatch = project?.project_name.toLowerCase().includes(q) ?? false;
        if (!roomMatch && !styleMatch && !designerMatch && !projectMatch) return false;
      }
      return true;
    });
  }, [allImages, filters, searchQuery, getDesignerForImage, projects]);

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

  const toggleFilterModal = useCallback(() => {
    setShowFilterModal(prev => !prev);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <TouchableOpacity
              style={styles.headerTitle}
              onLongPress={() => router.push('/admin' as any)}
              activeOpacity={1}
              delayLongPress={1000}
            >
              <Text style={styles.logoText}>homeform</Text>
            </TouchableOpacity>
          ),
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
            placeholder="Search rooms, styles, designers..."
            placeholderTextColor={Colors.textTertiary}
            returnKeyType="search"
            autoCorrect={false}
            testID="explore-search-input"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={14} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        showFilterModal={showFilterModal}
        onToggleFilterModal={toggleFilterModal}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.textTertiary}
          />
        }
      >
        <MasonryGrid images={filteredImages} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {filteredImages.length} curated images
          </Text>
          <Text style={styles.footerHint}>
            Long press any image to see credit
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  logoText: {
    fontSize: 20,
    fontFamily: Fonts.heading,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    fontFamily: Fonts.body,
  },
  footerHint: {
    fontSize: 11,
    color: Colors.textTertiary,
    opacity: 0.5,
    fontFamily: Fonts.body,
  },
});
