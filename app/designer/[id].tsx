import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Globe,
  Instagram,
  MapPin,
  Star,
  MessageCircle,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import InquiryModal from '@/components/InquiryModal';
import { DesignImage } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 3;
const GRID_COLS = 2;
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - GRID_GAP * (GRID_COLS - 1) - 16 * 2) / GRID_COLS;
const GRID_ITEM_HEIGHT = GRID_ITEM_WIDTH * 1.3;

export default function DesignerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { requireAuth } = useAuth();
  const [showInquiry, setShowInquiry] = useState(false);

  const { designers, projects, getImagesForDesigner } = useData();

  const designer = useMemo(() => designers.find(d => d.id === id), [id, designers]);
  const designerImages = useMemo(() => id ? getImagesForDesigner(id) : [], [id, getImagesForDesigner]);
  const designerProjects = useMemo(() => {
    return projects.filter(p => p.designer_id === id);
  }, [id, projects]);

  const handleInquire = useCallback(() => {
    if (!requireAuth()) return;
    setShowInquiry(true);
  }, [requireAuth]);

  const handleImagePress = useCallback((imageId: string) => {
    router.push(`/image/${imageId}` as any);
  }, [router]);

  if (!designer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Designer not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: designer.studio_name,
          headerTitleStyle: {
            fontSize: 16,
            fontFamily: Fonts.headingMedium,
            color: Colors.textPrimary,
          },
          headerTransparent: false,
          headerStyle: { backgroundColor: Colors.background },
        }}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View style={styles.profileSection}>
          <Image
            source={{ uri: designer.avatar_url }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />

          <View style={styles.nameRow}>
            <Text style={styles.studioName}>{designer.studio_name}</Text>
            {designer.featured && (
              <Star size={14} color={Colors.accent} fill={Colors.accent} />
            )}
          </View>

          <View style={styles.locationRow}>
            <MapPin size={13} color={Colors.textTertiary} />
            <Text style={styles.locationText}>{designer.city}</Text>
          </View>

          <Text style={styles.bio}>{designer.bio}</Text>

          <View style={styles.linksRow}>
            {designer.website_url && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => Linking.openURL(designer.website_url)}
                activeOpacity={0.7}
              >
                <Globe size={14} color={Colors.textSecondary} />
                <Text style={styles.linkText}>Website</Text>
              </TouchableOpacity>
            )}
            {designer.instagram_url && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => Linking.openURL(designer.instagram_url)}
                activeOpacity={0.7}
              >
                <Instagram size={14} color={Colors.textSecondary} />
                <Text style={styles.linkText}>Instagram</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.inquireButton}
            onPress={handleInquire}
            activeOpacity={0.8}
            testID="designer-inquire"
          >
            <MessageCircle size={16} color={Colors.black} />
            <Text style={styles.inquireText}>Inquire about a project</Text>
          </TouchableOpacity>
        </View>

        {designerProjects.length > 0 && (
          <View style={styles.projectsSection}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectsScroll}>
              {designerProjects.map(proj => (
                <View key={proj.id} style={styles.projectChip}>
                  <Text style={styles.projectChipName}>{proj.project_name}</Text>
                  <Text style={styles.projectChipType}>{proj.project_type}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>{designerImages.length} Images</Text>
          <View style={styles.galleryGrid}>
            {designerImages.map(img => (
              <TouchableOpacity
                key={img.id}
                style={styles.galleryItem}
                onPress={() => handleImagePress(img.id)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: img.image_url }}
                  style={styles.galleryImage}
                  contentFit="cover"
                  transition={300}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <InquiryModal
        visible={showInquiry}
        onClose={() => setShowInquiry(false)}
        designer={designer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceAlt,
    marginBottom: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  studioName: {
    fontSize: 24,
    fontFamily: Fonts.heading,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  bio: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 21,
    textAlign: 'center' as const,
    marginBottom: 14,
    fontFamily: Fonts.body,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
  },
  linkText: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
  },
  inquireButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    width: '100%',
    height: 46,
    backgroundColor: Colors.textPrimary,
    borderRadius: 23,
  },
  inquireText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.black,
    letterSpacing: 0.5,
  },
  projectsSection: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: Fonts.body,
    color: Colors.textTertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  projectsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  projectChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  projectChipName: {
    fontSize: 13,
    fontFamily: Fonts.headingMedium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  projectChipType: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontFamily: Fonts.body,
  },
  gallerySection: {
    paddingTop: 8,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    paddingHorizontal: 16,
  },
  galleryItem: {
    width: GRID_ITEM_WIDTH,
    height: GRID_ITEM_HEIGHT,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: 100,
  },
});
