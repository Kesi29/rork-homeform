import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SlidersHorizontal, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { Filters, RoomType, DesignStyle, ProjectType, Location } from '@/types';
import { ROOM_TYPES, DESIGN_STYLES, PROJECT_TYPES, LOCATIONS } from '@/mocks/data';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  showFilterModal: boolean;
  onToggleFilterModal: () => void;
}

function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const MemoizedPill = React.memo(Pill);

function CategoryTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.categoryTab}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.categoryTabText, active && styles.categoryTabTextActive]}>{label}</Text>
      {active && <View style={styles.categoryTabIndicator} />}
    </TouchableOpacity>
  );
}

const MemoizedCategoryTab = React.memo(CategoryTab);

export default function FilterBar({ filters, onFiltersChange, showFilterModal, onToggleFilterModal }: FilterBarProps) {
  const activeCount = [filters.roomType, filters.designStyle, filters.projectType, filters.location].filter(Boolean).length;

  const clearAll = useCallback(() => {
    onFiltersChange({ roomType: null, designStyle: null, projectType: null, location: null });
  }, [onFiltersChange]);

  const toggleRoom = useCallback((room: RoomType) => {
    onFiltersChange({ ...filters, roomType: filters.roomType === room ? null : room });
  }, [filters, onFiltersChange]);

  const toggleStyle = useCallback((style: DesignStyle) => {
    onFiltersChange({ ...filters, designStyle: filters.designStyle === style ? null : style });
  }, [filters, onFiltersChange]);

  const toggleProject = useCallback((type: ProjectType) => {
    onFiltersChange({ ...filters, projectType: filters.projectType === type ? null : type });
  }, [filters, onFiltersChange]);

  const toggleLocation = useCallback((loc: Location) => {
    onFiltersChange({ ...filters, location: filters.location === loc ? null : loc });
  }, [filters, onFiltersChange]);

  return (
    <>
      <View style={styles.bar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity
            style={[styles.filterButton, activeCount > 0 && styles.filterButtonActive]}
            onPress={onToggleFilterModal}
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={14} color={activeCount > 0 ? Colors.black : Colors.textSecondary} />
            {activeCount > 0 && (
              <Text style={styles.filterCountText}>{activeCount}</Text>
            )}
          </TouchableOpacity>

          {ROOM_TYPES.slice(0, 6).map(room => (
            <MemoizedCategoryTab
              key={room}
              label={room}
              active={filters.roomType === room}
              onPress={() => toggleRoom(room as RoomType)}
            />
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={onToggleFilterModal}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onToggleFilterModal}>
          <View />
        </TouchableOpacity>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <View style={styles.modalHeaderRight}>
              {activeCount > 0 && (
                <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                  <Text style={styles.clearText}>Clear all</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onToggleFilterModal} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <X size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>Location</Text>
            <View style={styles.pillGrid}>
              {LOCATIONS.map(loc => (
                <MemoizedPill
                  key={loc}
                  label={loc}
                  active={filters.location === loc}
                  onPress={() => toggleLocation(loc as Location)}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Room Type</Text>
            <View style={styles.pillGrid}>
              {ROOM_TYPES.map(room => (
                <MemoizedPill
                  key={room}
                  label={room}
                  active={filters.roomType === room}
                  onPress={() => toggleRoom(room as RoomType)}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Design Style</Text>
            <View style={styles.pillGrid}>
              {DESIGN_STYLES.map(style => (
                <MemoizedPill
                  key={style}
                  label={style}
                  active={filters.designStyle === style}
                  onPress={() => toggleStyle(style as DesignStyle)}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Project Type</Text>
            <View style={styles.pillGrid}>
              {PROJECT_TYPES.map(type => (
                <MemoizedPill
                  key={type}
                  label={type}
                  active={filters.projectType === type}
                  onPress={() => toggleProject(type as ProjectType)}
                />
              ))}
            </View>

            <View style={{ height: 32 }} />
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={onToggleFilterModal} activeOpacity={0.8}>
            <Text style={styles.applyButtonText}>Show results</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingVertical: 0,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    flexDirection: 'row',
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: Colors.pillActive,
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.black,
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  categoryTabText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.textTertiary,
  },
  categoryTabTextActive: {
    color: Colors.textPrimary,
  },
  categoryTabIndicator: {
    position: 'absolute' as const,
    bottom: 0,
    left: 12,
    right: 12,
    height: 1.5,
    backgroundColor: Colors.textPrimary,
    borderRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  modalSheet: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
    alignSelf: 'center',
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: Fonts.headingSemiBold,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  clearButton: {},
  clearText: {
    fontSize: 13,
    color: Colors.accent,
    fontFamily: Fonts.body,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: Fonts.body,
    color: Colors.textTertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
  },
  pillActive: {
    backgroundColor: Colors.pillActive,
  },
  pillText: {
    fontSize: 12,
    color: Colors.pillTextInactive,
    fontFamily: Fonts.body,
  },
  pillTextActive: {
    color: Colors.pillTextActive,
  },
  applyButton: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 36,
    height: 48,
    backgroundColor: Colors.textPrimary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: Colors.black,
    letterSpacing: 0.5,
  },
});
