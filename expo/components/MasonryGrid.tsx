import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { DesignImage } from '@/types';
import { useData } from '@/contexts/DataContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GAP = 16;
const PADDING = 20;
const COLUMN_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

interface MasonryGridProps {
  images: DesignImage[];
}

function MasonryItem({ image }: { image: DesignImage }) {
  const router = useRouter();
  const { getDesignerForImage } = useData();
  const [showCredit, setShowCredit] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const imageHeight = COLUMN_WIDTH * image.aspect_ratio;
  const designer = getDesignerForImage(image.id);

  const handlePress = useCallback(() => {
    router.push(`/image/${image.id}` as any);
  }, [router, image.id]);

  const handleLongPress = useCallback(() => {
    if (showCredit) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setShowCredit(false);
      });
    } else {
      setShowCredit(true);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [showCredit, fadeAnim]);

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.95}
      testID={`masonry-item-${image.id}`}
    >
      <Image
        source={{ uri: image.image_url }}
        style={[styles.image, { height: imageHeight }]}
        contentFit="cover"
        transition={300}
        recyclingKey={image.id}
      />
      {showCredit && designer && (
        <Animated.View style={[styles.creditOverlay, { opacity: fadeAnim }]}>
          <Text style={styles.creditText} numberOfLines={1}>
            {designer.studio_name}
          </Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

const MemoizedItem = React.memo(MasonryItem);

export default function MasonryGrid({ images }: MasonryGridProps) {
  const columns = useMemo(() => {
    const left: DesignImage[] = [];
    const right: DesignImage[] = [];
    let leftHeight = 0;
    let rightHeight = 0;

    images.forEach((img) => {
      const h = COLUMN_WIDTH * img.aspect_ratio;
      if (leftHeight <= rightHeight) {
        left.push(img);
        leftHeight += h + GAP;
      } else {
        right.push(img);
        rightHeight += h + GAP;
      }
    });

    return { left, right };
  }, [images]);

  if (images.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No images match your filters</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      <View style={styles.column}>
        {columns.left.map(img => (
          <MemoizedItem key={img.id} image={img} />
        ))}
      </View>
      <View style={styles.column}>
        {columns.right.map(img => (
          <MemoizedItem key={img.id} image={img} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    gap: GAP,
  },
  column: {
    flex: 1,
    gap: GAP,
  },
  item: {
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  image: {
    width: '100%',
  },
  creditOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  creditText: {
    fontSize: 11,
    color: '#D0D0D0',
    letterSpacing: 0.3,
    fontFamily: Fonts.headingItalic,
  },
  empty: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontFamily: Fonts.body,
  },
});
