import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  MapPin,
  Info,
  Plus,
  Check,
  FolderPlus,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSaves } from '@/contexts/SaveContext';
import { Board } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ImageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, requireAuth } = useAuth();
  const { isImageSaved, saveImage, unsaveImage, getUserBoards, createBoard, moveToBoard, saves } = useSaves();
  const [saveScale] = useState(new Animated.Value(1));
  const [showInfo, setShowInfo] = useState(false);
  const [infoFade] = useState(new Animated.Value(0));
  const [showBoardPicker, setShowBoardPicker] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [showNewBoardInput, setShowNewBoardInput] = useState(false);

  const { images, getDesignerForImage, getProjectForImage } = useData();

  const image = useMemo(() => images.find(i => i.id === id), [id, images]);
  const designer = useMemo(() => id ? getDesignerForImage(id) : undefined, [id, getDesignerForImage]);
  const project = useMemo(() => id ? getProjectForImage(id) : undefined, [id, getProjectForImage]);

  const saved = useMemo(() => {
    if (!user || !id) return false;
    return isImageSaved(user.id, id);
  }, [user, id, isImageSaved]);

  const userBoards = useMemo(() => user ? getUserBoards(user.id) : [], [user, getUserBoards]);

  const currentSave = useMemo(() => {
    if (!user || !id) return null;
    return saves.find(s => s.user_id === user.id && s.image_id === id) ?? null;
  }, [user, id, saves]);

  const handleSave = useCallback(() => {
    if (!requireAuth() || !user || !id) return;

    Animated.sequence([
      Animated.timing(saveScale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(saveScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (saved) {
      unsaveImage({ userId: user.id, imageId: id });
    } else {
      saveImage({ userId: user.id, imageId: id });
    }
  }, [requireAuth, user, id, saved, saveImage, unsaveImage, saveScale]);

  const handleLongPressSave = useCallback(() => {
    if (!requireAuth() || !user || !id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!saved) {
      saveImage({ userId: user.id, imageId: id });
    }
    setShowBoardPicker(true);
  }, [requireAuth, user, id, saved, saveImage]);

  const handleSelectBoard = useCallback((boardId: string | null) => {
    if (!currentSave) return;
    moveToBoard({ saveId: currentSave.id, boardId });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowBoardPicker(false);
  }, [currentSave, moveToBoard]);

  const handleCreateBoardAndSave = useCallback(() => {
    if (!user || !newBoardName.trim()) return;
    createBoard({ userId: user.id, name: newBoardName.trim() });
    setNewBoardName('');
    setShowNewBoardInput(false);
  }, [user, newBoardName, createBoard]);

  const handleViewDesigner = useCallback(() => {
    if (designer) {
      router.push(`/designer/${designer.id}` as any);
    }
  }, [router, designer]);

  const toggleInfo = useCallback(() => {
    if (showInfo) {
      Animated.timing(infoFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setShowInfo(false);
      });
    } else {
      setShowInfo(true);
      Animated.timing(infoFade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [showInfo, infoFade]);

  if (!image) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Image not found</Text>
      </View>
    );
  }

  const imageHeight = SCREEN_WIDTH * image.aspect_ratio;

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          testID="image-detail-close"
        >
          <X size={20} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.topRight}>
          <Animated.View style={{ transform: [{ scale: saveScale }] }}>
            <TouchableOpacity
              style={styles.topButton}
              onPress={handleSave}
              onLongPress={handleLongPressSave}
              delayLongPress={400}
              activeOpacity={0.7}
              testID="image-detail-save"
            >
              {saved ? (
                <BookmarkCheck size={20} color={Colors.accent} fill={Colors.accent} />
              ) : (
                <Bookmark size={20} color={Colors.textPrimary} />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <TouchableOpacity activeOpacity={1} onPress={toggleInfo}>
          <View>
            <Image
              source={{ uri: image.image_url }}
              style={[styles.heroImage, { height: imageHeight }]}
              contentFit="cover"
              transition={400}
            />
            {showInfo && designer && (
              <Animated.View style={[styles.imageOverlay, { opacity: infoFade }]}>
                <View style={styles.creditBar}>
                  <Text style={styles.creditDesigner}>{designer.studio_name}</Text>
                  {project && (
                    <Text style={styles.creditProject}>{project.project_name}</Text>
                  )}
                </View>
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.details}>
          {designer && (
            <TouchableOpacity
              style={styles.designerRow}
              onPress={handleViewDesigner}
              activeOpacity={0.8}
              testID="image-detail-designer"
            >
              <Image
                source={{ uri: designer.avatar_url }}
                style={styles.designerAvatar}
                contentFit="cover"
              />
              <View style={styles.designerInfo}>
                <Text style={styles.designerName}>{designer.studio_name}</Text>
                <View style={styles.designerLocation}>
                  <MapPin size={11} color={Colors.textTertiary} />
                  <Text style={styles.designerCity}>{designer.city}</Text>
                </View>
              </View>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}

          <View style={styles.infoRow}>
            <TouchableOpacity style={styles.infoButton} onPress={toggleInfo} activeOpacity={0.7}>
              <Info size={16} color={Colors.textTertiary} />
              <Text style={styles.infoButtonText}>Tap image for credit</Text>
            </TouchableOpacity>
          </View>

          {designer && (
            <TouchableOpacity
              style={styles.viewDesignerButton}
              onPress={handleViewDesigner}
              activeOpacity={0.8}
            >
              <Text style={styles.viewDesignerText}>View designer profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showBoardPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBoardPicker(false)}
      >
        <TouchableOpacity
          style={styles.boardModalOverlay}
          activeOpacity={1}
          onPress={() => setShowBoardPicker(false)}
        >
          <View />
        </TouchableOpacity>
        <View style={styles.boardModalSheet}>
          <View style={styles.boardModalHandle} />
          <View style={styles.boardModalHeader}>
            <Text style={styles.boardModalTitle}>Save to board</Text>
            <TouchableOpacity onPress={() => setShowBoardPicker(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <X size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.boardModalBody} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.boardOption, !currentSave?.board_id && styles.boardOptionActive]}
              onPress={() => handleSelectBoard(null)}
              activeOpacity={0.7}
            >
              <Bookmark size={18} color={!currentSave?.board_id ? Colors.accent : Colors.textSecondary} />
              <Text style={[styles.boardOptionText, !currentSave?.board_id && styles.boardOptionTextActive]}>All Saves (no board)</Text>
              {!currentSave?.board_id && <Check size={16} color={Colors.accent} />}
            </TouchableOpacity>

            {userBoards.map((board: Board) => {
              const isActive = currentSave?.board_id === board.id;
              return (
                <TouchableOpacity
                  key={board.id}
                  style={[styles.boardOption, isActive && styles.boardOptionActive]}
                  onPress={() => handleSelectBoard(board.id)}
                  activeOpacity={0.7}
                >
                  <FolderPlus size={18} color={isActive ? Colors.accent : Colors.textSecondary} />
                  <Text style={[styles.boardOptionText, isActive && styles.boardOptionTextActive]}>{board.name}</Text>
                  {isActive && <Check size={16} color={Colors.accent} />}
                </TouchableOpacity>
              );
            })}

            {showNewBoardInput ? (
              <View style={styles.newBoardRow}>
                <TextInput
                  style={styles.newBoardInput}
                  value={newBoardName}
                  onChangeText={setNewBoardName}
                  placeholder="Board name"
                  placeholderTextColor={Colors.textTertiary}
                  autoFocus
                  onSubmitEditing={handleCreateBoardAndSave}
                />
                <TouchableOpacity
                  style={[styles.newBoardSave, !newBoardName.trim() && { opacity: 0.4 }]}
                  onPress={handleCreateBoardAndSave}
                  disabled={!newBoardName.trim()}
                >
                  <Text style={styles.newBoardSaveText}>Create</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.boardOption}
                onPress={() => setShowNewBoardInput(true)}
                activeOpacity={0.7}
              >
                <Plus size={18} color={Colors.accent} />
                <Text style={[styles.boardOptionText, { color: Colors.accent }]}>New board</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topRight: {
    flexDirection: 'row',
    gap: 8,
  },
  topButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(30,30,30,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  heroImage: {
    width: SCREEN_WIDTH,
  },
  imageOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  creditBar: {
    gap: 2,
  },
  creditDesigner: {
    fontSize: 14,
    fontFamily: Fonts.headingMedium,
    color: '#E8E8E8',
    letterSpacing: 0.2,
  },
  creditProject: {
    fontSize: 11,
    fontFamily: Fonts.body,
    color: '#A0A0A0',
  },
  details: {
    padding: 20,
    paddingTop: 16,
  },
  designerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    gap: 10,
  },
  designerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
  },
  designerInfo: {
    flex: 1,
  },
  designerName: {
    fontSize: 15,
    fontFamily: Fonts.headingMedium,
    color: Colors.textPrimary,
  },
  designerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  designerCity: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  infoRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
  },
  infoButtonText: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontFamily: Fonts.body,
  },
  viewDesignerButton: {
    marginTop: 12,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDesignerText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.black,
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: 100,
  },
  boardModalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  boardModalSheet: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 40,
  },
  boardModalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
    alignSelf: 'center',
    marginTop: 10,
  },
  boardModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  boardModalTitle: {
    fontSize: 18,
    fontFamily: Fonts.headingSemiBold,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  boardModalBody: {
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  boardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  boardOptionActive: {
    backgroundColor: Colors.surfaceAlt,
  },
  boardOptionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body,
    color: Colors.textPrimary,
  },
  boardOptionTextActive: {
    fontWeight: '500' as const,
    color: Colors.accent,
  },
  newBoardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
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
    backgroundColor: Colors.accent,
    borderRadius: 8,
  },
  newBoardSaveText: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: Colors.black,
  },
});
