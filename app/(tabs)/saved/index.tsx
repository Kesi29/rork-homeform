import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Plus,
  Bookmark,
  Lock,
  Search,
  Settings,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useAuth } from '@/contexts/AuthContext';
import { useSaves } from '@/contexts/SaveContext';
import { useData } from '@/contexts/DataContext';
import { DesignImage } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS = 3;
const GRID_GAP = 3;
const GRID_PADDING = 3;
const ITEM_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

type TabType = 'elements' | 'boards';

function LockedState({ onSignIn }: { onSignIn: () => void }) {
  return (
    <View style={styles.lockedContainer}>
      <View style={styles.lockedContent}>
        <View style={styles.lockIcon}>
          <Lock size={28} color={Colors.textTertiary} />
        </View>
        <Text style={styles.lockedTitle}>Your saved inspiration</Text>
        <Text style={styles.lockedSubtitle}>
          Sign in to save images from designers{'\n'}and organize them into boards.
        </Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={onSignIn}
          activeOpacity={0.8}
          testID="saved-sign-in"
        >
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SavedMasonryGrid({ images, onImagePress }: { images: DesignImage[]; onImagePress: (id: string) => void }) {
  const columns = useMemo(() => {
    const cols: DesignImage[][] = [[], [], []];
    const heights = [0, 0, 0];

    images.forEach((img) => {
      const minIdx = heights.indexOf(Math.min(...heights));
      cols[minIdx].push(img);
      heights[minIdx] += ITEM_WIDTH * img.aspect_ratio + GRID_GAP;
    });

    return cols;
  }, [images]);

  if (images.length === 0) return null;

  return (
    <View style={styles.masonryContainer}>
      {columns.map((col, colIdx) => (
        <View key={colIdx} style={styles.masonryColumn}>
          {col.map(img => (
            <TouchableOpacity
              key={img.id}
              style={styles.masonryItem}
              onPress={() => onImagePress(img.id)}
              activeOpacity={0.9}
              testID={`saved-image-${img.id}`}
            >
              <Image
                source={{ uri: img.image_url }}
                style={{ width: ITEM_WIDTH, height: ITEM_WIDTH * img.aspect_ratio }}
                contentFit="cover"
                transition={200}
                recyclingKey={img.id}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function SavedScreen() {
  const { user, isAuthenticated, setShowAuthModal } = useAuth();
  const { getUserSaves, getUserBoards, getBoardSaves, createBoard, deleteBoard } = useSaves();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('elements');
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const userSaves = useMemo(() => user ? getUserSaves(user.id) : [], [user, getUserSaves]);
  const userBoards = useMemo(() => user ? getUserBoards(user.id) : [], [user, getUserBoards]);

  const displaySaves = useMemo(() => {
    if (activeTab === 'boards' && selectedBoardId) {
      return getBoardSaves(selectedBoardId);
    }
    return userSaves;
  }, [activeTab, selectedBoardId, userSaves, getBoardSaves]);

  const { images: allImages } = useData();

  const displayImages = useMemo(() => {
    return displaySaves
      .map(save => allImages.find(img => img.id === save.image_id))
      .filter((img): img is DesignImage => !!img);
  }, [displaySaves, allImages]);

  const handleCreateBoard = useCallback(() => {
    if (!user || !newBoardName.trim()) return;
    createBoard({ userId: user.id, name: newBoardName.trim() });
    setNewBoardName('');
    setShowNewBoard(false);
  }, [user, newBoardName, createBoard]);

  const handleDeleteBoard = useCallback((boardId: string, boardName: string) => {
    Alert.alert(
      'Delete board',
      `Are you sure you want to delete "${boardName}"? Saved images won't be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          if (selectedBoardId === boardId) setSelectedBoardId(null);
          deleteBoard(boardId);
        }},
      ]
    );
  }, [selectedBoardId, deleteBoard]);

  const handleImagePress = useCallback((id: string) => {
    router.push(`/image/${id}` as any);
  }, [router]);

  if (!isAuthenticated) {
    return <LockedState onSignIn={() => setShowAuthModal(true)} />;
  }

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() ?? 'U'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
            <Search size={20} color={Colors.textPrimary} strokeWidth={1.8} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.7}
            onPress={() => router.push('/settings' as any)}
            testID="settings-button"
          >
            <Settings size={20} color={Colors.textPrimary} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'elements' && styles.tabActive]}
          onPress={() => { setActiveTab('elements'); setSelectedBoardId(null); }}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'elements' && styles.tabTextActive]}>
            All Saves
          </Text>
          {activeTab === 'elements' && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{userSaves.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'boards' && styles.tabActive]}
          onPress={() => setActiveTab('boards')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'boards' && styles.tabTextActive]}>
            Boards
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'boards' && (
        <View style={styles.boardsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.boardsScroll}
          >
            <TouchableOpacity
              style={[styles.boardChip, !selectedBoardId && styles.boardChipActive]}
              onPress={() => setSelectedBoardId(null)}
              activeOpacity={0.7}
            >
              <Bookmark size={12} color={!selectedBoardId ? Colors.black : Colors.textSecondary} />
              <Text style={[styles.boardChipText, !selectedBoardId && styles.boardChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            {userBoards.map(board => {
              const isActive = selectedBoardId === board.id;
              const count = getBoardSaves(board.id).length;
              return (
                <TouchableOpacity
                  key={board.id}
                  style={[styles.boardChip, isActive && styles.boardChipActive]}
                  onPress={() => setSelectedBoardId(isActive ? null : board.id)}
                  onLongPress={() => {
                    Alert.alert(board.name, '', [
                      { text: 'Delete', style: 'destructive', onPress: () => handleDeleteBoard(board.id, board.name) },
                      { text: 'Cancel', style: 'cancel' },
                    ]);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.boardChipText, isActive && styles.boardChipTextActive]}>
                    {board.name} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}

            {userBoards.length < 12 && (
              <TouchableOpacity
                style={styles.addBoardBtn}
                onPress={() => setShowNewBoard(true)}
                activeOpacity={0.7}
              >
                <Plus size={15} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {showNewBoard && (
        <View style={styles.newBoardRow}>
          <TextInput
            style={styles.newBoardInput}
            value={newBoardName}
            onChangeText={setNewBoardName}
            placeholder="Board name"
            placeholderTextColor={Colors.textTertiary}
            autoFocus
            onSubmitEditing={handleCreateBoard}
          />
          <TouchableOpacity
            style={[styles.newBoardSave, !newBoardName.trim() && { opacity: 0.4 }]}
            onPress={handleCreateBoard}
            disabled={!newBoardName.trim()}
          >
            <Text style={styles.newBoardSaveText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowNewBoard(false); setNewBoardName(''); }}>
            <Text style={styles.newBoardCancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {displayImages.length === 0 ? (
        <View style={styles.emptyState}>
          <Bookmark size={32} color={Colors.textTertiary} strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>
            {activeTab === 'boards' && selectedBoardId ? 'This board is empty' : 'No saved images yet'}
          </Text>
          <Text style={styles.emptySubtitle}>
            Tap the bookmark icon on any image to save it here.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <SavedMasonryGrid images={displayImages} onImagePress={handleImagePress} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  lockedContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  lockedContent: {
    alignItems: 'center',
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lockedTitle: {
    fontSize: 22,
    fontFamily: Fonts.heading,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  lockedSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 21,
    marginBottom: 24,
    fontFamily: Fonts.body,
  },
  signInButton: {
    paddingHorizontal: 32,
    paddingVertical: 13,
    backgroundColor: Colors.textPrimary,
    borderRadius: 24,
  },
  signInText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontFamily: Fonts.headingSemiBold,
    color: Colors.black,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 12,
    marginRight: 28,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.textPrimary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: Colors.textTertiary,
    letterSpacing: 0.2,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  tabBadge: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
  },
  boardsSection: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  boardsScroll: {
    paddingHorizontal: 16,
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
  },
  boardChipActive: {
    backgroundColor: Colors.pillActive,
  },
  boardChipText: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
  },
  boardChipTextActive: {
    color: Colors.black,
  },
  addBoardBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  newBoardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  newBoardInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
  },
  newBoardSave: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.textPrimary,
    borderRadius: 8,
  },
  newBoardSaveText: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: Colors.black,
  },
  newBoardCancel: {
    fontSize: 13,
    color: Colors.textSecondary,
    paddingHorizontal: 8,
    fontFamily: Fonts.body,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading,
    color: Colors.textPrimary,
    marginTop: 14,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 19,
    fontFamily: Fonts.body,
  },
  scrollContent: {
    paddingTop: GRID_PADDING,
    paddingBottom: 40,
  },
  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: GRID_PADDING,
    gap: GRID_GAP,
  },
  masonryColumn: {
    flex: 1,
    gap: GRID_GAP,
  },
  masonryItem: {
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
});
