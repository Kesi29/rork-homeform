import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Trash2, Plus, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useData } from '@/contexts/DataContext';
import { Designer, Project, DesignImage, RoomType, DesignStyle, ProjectType } from '@/types';
import { ROOM_TYPES, DESIGN_STYLES, PROJECT_TYPES } from '@/mocks/data';

type Section = 'designers' | 'projects' | 'images' | null;

export default function AdminScreen() {
  const router = useRouter();
  const {
    designers, projects, images,
    addDesigner, deleteDesigner,
    addProject, deleteProject,
    addImage, deleteImage,
    resetToMocks,
  } = useData();

  const [openSection, setOpenSection] = useState<Section>('designers');

  const [dName, setDName] = useState('');
  const [dBio, setDBio] = useState('');
  const [dWebsite, setDWebsite] = useState('');
  const [dInstagram, setDInstagram] = useState('');
  const [dAvatar, setDAvatar] = useState('');
  const [dFeatured, setDFeatured] = useState(false);

  const [pName, setPName] = useState('');
  const [pDesignerId, setPDesignerId] = useState('');
  const [pType, setPType] = useState<ProjectType>('Single-Family Home');

  const [iProjectId, setIProjectId] = useState('');
  const [iUrl, setIUrl] = useState('');
  const [iRoom, setIRoom] = useState<RoomType>('Kitchen');
  const [iStyle1, setIStyle1] = useState<DesignStyle>('Modern');
  const [iStyle2, setIStyle2] = useState<DesignStyle | ''>('');
  const [iPriority, setIPriority] = useState('1');

  const handleAddDesigner = useCallback(() => {
    if (!dName.trim()) {
      Alert.alert('Error', 'Studio name is required');
      return;
    }
    const designer: Designer = {
      id: `d_${Date.now()}`,
      studio_name: dName.trim(),
      bio: dBio.trim(),
      city: 'Chicago',
      website_url: dWebsite.trim(),
      instagram_url: dInstagram.trim(),
      featured: dFeatured,
      avatar_url: dAvatar.trim() || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    };
    addDesigner(designer);
    setDName('');
    setDBio('');
    setDWebsite('');
    setDInstagram('');
    setDAvatar('');
    setDFeatured(false);
    Alert.alert('Done', 'Designer added');
  }, [dName, dBio, dWebsite, dInstagram, dAvatar, dFeatured, addDesigner]);

  const handleDeleteDesigner = useCallback((id: string, name: string) => {
    Alert.alert('Delete designer', `Delete "${name}" and all their projects/images?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDesigner(id) },
    ]);
  }, [deleteDesigner]);

  const handleAddProject = useCallback(() => {
    if (!pName.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }
    if (!pDesignerId) {
      Alert.alert('Error', 'Select a designer');
      return;
    }
    const project: Project = {
      id: `p_${Date.now()}`,
      designer_id: pDesignerId,
      project_name: pName.trim(),
      project_type: pType,
      city: 'Chicago',
    };
    addProject(project);
    setPName('');
    Alert.alert('Done', 'Project added');
  }, [pName, pDesignerId, pType, addProject]);

  const handleDeleteProject = useCallback((id: string, name: string) => {
    Alert.alert('Delete project', `Delete "${name}" and its images?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProject(id) },
    ]);
  }, [deleteProject]);

  const handleAddImage = useCallback(() => {
    if (!iUrl.trim()) {
      Alert.alert('Error', 'Image URL is required');
      return;
    }
    if (!iProjectId) {
      Alert.alert('Error', 'Select a project');
      return;
    }
    const styleTags: [DesignStyle] | [DesignStyle, DesignStyle] = iStyle2
      ? [iStyle1, iStyle2 as DesignStyle]
      : [iStyle1];
    const image: DesignImage = {
      id: `i_${Date.now()}`,
      project_id: iProjectId,
      image_url: iUrl.trim(),
      room_type: iRoom,
      style_tags: styleTags,
      sort_priority: parseInt(iPriority, 10) || 1,
      aspect_ratio: 1.3,
    };
    addImage(image);
    setIUrl('');
    setIPriority('1');
    Alert.alert('Done', 'Image added');
  }, [iUrl, iProjectId, iRoom, iStyle1, iStyle2, iPriority, addImage]);

  const handleDeleteImage = useCallback((id: string) => {
    Alert.alert('Delete image', 'Remove this image?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteImage(id) },
    ]);
  }, [deleteImage]);

  const handleReset = useCallback(() => {
    Alert.alert('Reset data', 'Reset all data to defaults? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetToMocks() },
    ]);
  }, [resetToMocks]);

  const toggleSection = useCallback((s: Section) => {
    setOpenSection(prev => prev === s ? null : s);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: 'Admin', headerStyle: { backgroundColor: Colors.background } }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.7}>
          <RotateCcw size={14} color={Colors.danger} />
          <Text style={styles.resetText}>Reset to defaults</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('designers')} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Designers ({designers.length})</Text>
          {openSection === 'designers' ? <ChevronUp size={18} color={Colors.textSecondary} /> : <ChevronDown size={18} color={Colors.textSecondary} />}
        </TouchableOpacity>
        {openSection === 'designers' && (
          <View style={styles.sectionBody}>
            {designers.map(d => (
              <View key={d.id} style={styles.listItem}>
                <View style={styles.listItemInfo}>
                  <Text style={styles.listItemTitle}>{d.studio_name}</Text>
                  <Text style={styles.listItemSub}>{d.city} {d.featured ? '· Featured' : ''}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteDesigner(d.id, d.studio_name)} hitSlop={8}>
                  <Trash2 size={16} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.form}>
              <Text style={styles.formLabel}>Add designer</Text>
              <TextInput style={styles.input} value={dName} onChangeText={setDName} placeholder="Studio name *" placeholderTextColor={Colors.textTertiary} />
              <TextInput style={styles.input} value={dBio} onChangeText={setDBio} placeholder="Bio" placeholderTextColor={Colors.textTertiary} multiline />
              <TextInput style={styles.input} value={dWebsite} onChangeText={setDWebsite} placeholder="Website URL" placeholderTextColor={Colors.textTertiary} autoCapitalize="none" />
              <TextInput style={styles.input} value={dInstagram} onChangeText={setDInstagram} placeholder="Instagram URL" placeholderTextColor={Colors.textTertiary} autoCapitalize="none" />
              <TextInput style={styles.input} value={dAvatar} onChangeText={setDAvatar} placeholder="Avatar image URL" placeholderTextColor={Colors.textTertiary} autoCapitalize="none" />
              <TouchableOpacity style={styles.toggleRow} onPress={() => setDFeatured(f => !f)} activeOpacity={0.7}>
                <View style={[styles.checkbox, dFeatured && styles.checkboxChecked]} />
                <Text style={styles.toggleLabel}>Featured</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleAddDesigner} activeOpacity={0.8}>
                <Plus size={16} color={Colors.black} />
                <Text style={styles.addButtonText}>Add designer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('projects')} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Projects ({projects.length})</Text>
          {openSection === 'projects' ? <ChevronUp size={18} color={Colors.textSecondary} /> : <ChevronDown size={18} color={Colors.textSecondary} />}
        </TouchableOpacity>
        {openSection === 'projects' && (
          <View style={styles.sectionBody}>
            {projects.map(p => {
              const d = designers.find(dd => dd.id === p.designer_id);
              return (
                <View key={p.id} style={styles.listItem}>
                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemTitle}>{p.project_name}</Text>
                    <Text style={styles.listItemSub}>{d?.studio_name} · {p.project_type}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteProject(p.id, p.project_name)} hitSlop={8}>
                    <Trash2 size={16} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              );
            })}
            <View style={styles.form}>
              <Text style={styles.formLabel}>Add project</Text>
              <TextInput style={styles.input} value={pName} onChangeText={setPName} placeholder="Project name *" placeholderTextColor={Colors.textTertiary} />
              <Text style={styles.pickerLabel}>Designer</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
                <View style={styles.pillRow}>
                  {designers.map(d => (
                    <TouchableOpacity
                      key={d.id}
                      style={[styles.pill, pDesignerId === d.id && styles.pillActive]}
                      onPress={() => setPDesignerId(d.id)}
                    >
                      <Text style={[styles.pillText, pDesignerId === d.id && styles.pillTextActive]}>{d.studio_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <Text style={styles.pickerLabel}>Project type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
                <View style={styles.pillRow}>
                  {PROJECT_TYPES.map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.pill, pType === t && styles.pillActive]}
                      onPress={() => setPType(t as ProjectType)}
                    >
                      <Text style={[styles.pillText, pType === t && styles.pillTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.addButton} onPress={handleAddProject} activeOpacity={0.8}>
                <Plus size={16} color={Colors.black} />
                <Text style={styles.addButtonText}>Add project</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('images')} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Images ({images.length})</Text>
          {openSection === 'images' ? <ChevronUp size={18} color={Colors.textSecondary} /> : <ChevronDown size={18} color={Colors.textSecondary} />}
        </TouchableOpacity>
        {openSection === 'images' && (
          <View style={styles.sectionBody}>
            {images.map(img => {
              const proj = projects.find(pp => pp.id === img.project_id);
              return (
                <View key={img.id} style={styles.listItem}>
                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemTitle} numberOfLines={1}>{img.image_url.slice(0, 40)}...</Text>
                    <Text style={styles.listItemSub}>{proj?.project_name} · {img.room_type}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteImage(img.id)} hitSlop={8}>
                    <Trash2 size={16} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              );
            })}
            <View style={styles.form}>
              <Text style={styles.formLabel}>Add image</Text>
              <TextInput style={styles.input} value={iUrl} onChangeText={setIUrl} placeholder="Image URL *" placeholderTextColor={Colors.textTertiary} autoCapitalize="none" />
              <TextInput style={styles.input} value={iPriority} onChangeText={setIPriority} placeholder="Sort priority (1 = highest)" placeholderTextColor={Colors.textTertiary} keyboardType="numeric" />
              <Text style={styles.pickerLabel}>Project</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
                <View style={styles.pillRow}>
                  {projects.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.pill, iProjectId === p.id && styles.pillActive]}
                      onPress={() => setIProjectId(p.id)}
                    >
                      <Text style={[styles.pillText, iProjectId === p.id && styles.pillTextActive]}>{p.project_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <Text style={styles.pickerLabel}>Room type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
                <View style={styles.pillRow}>
                  {ROOM_TYPES.map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.pill, iRoom === r && styles.pillActive]}
                      onPress={() => setIRoom(r as RoomType)}
                    >
                      <Text style={[styles.pillText, iRoom === r && styles.pillTextActive]}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <Text style={styles.pickerLabel}>Style tag 1</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
                <View style={styles.pillRow}>
                  {DESIGN_STYLES.map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.pill, iStyle1 === s && styles.pillActive]}
                      onPress={() => setIStyle1(s as DesignStyle)}
                    >
                      <Text style={[styles.pillText, iStyle1 === s && styles.pillTextActive]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <Text style={styles.pickerLabel}>Style tag 2 (optional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
                <View style={styles.pillRow}>
                  <TouchableOpacity
                    style={[styles.pill, iStyle2 === '' && styles.pillActive]}
                    onPress={() => setIStyle2('')}
                  >
                    <Text style={[styles.pillText, iStyle2 === '' && styles.pillTextActive]}>None</Text>
                  </TouchableOpacity>
                  {DESIGN_STYLES.map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.pill, iStyle2 === s && styles.pillActive]}
                      onPress={() => setIStyle2(s as DesignStyle)}
                    >
                      <Text style={[styles.pillText, iStyle2 === s && styles.pillTextActive]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.addButton} onPress={handleAddImage} activeOpacity={0.8}>
                <Plus size={16} color={Colors.black} />
                <Text style={styles.addButtonText}>Add image</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    paddingBottom: 60,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  resetText: {
    fontSize: 13,
    color: Colors.danger,
    fontWeight: '500' as const,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  listItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
  },
  listItemSub: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  form: {
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
    marginBottom: 8,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: 6,
  },
  pillScroll: {
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.pillActive,
    borderColor: Colors.pillActive,
  },
  pillText: {
    fontSize: 12,
    color: Colors.pillTextInactive,
  },
  pillTextActive: {
    color: Colors.pillTextActive,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  toggleLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.textPrimary,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.black,
  },
});
