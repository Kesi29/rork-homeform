import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  User,
  Mail,
  Bell,
  Lock,
  Share2,
  HelpCircle,
  LogOut,
  Info,
  Pencil,
  Check,
  X,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
  showIndicator?: boolean;
  danger?: boolean;
}

function SettingsRow({ icon, title, subtitle, onPress, showIndicator, danger }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.rowRight}>
        {showIndicator && <View style={styles.indicator} />}
        {!danger && <ChevronRight size={20} color={Colors.textTertiary} strokeWidth={1.5} />}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { user, signOut, updateProfile, isUpdatingProfile } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editEmail, setEditEmail] = useState(user?.email ?? '');

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            signOut();
            router.back();
          },
        },
      ]
    );
  }, [signOut, router]);

  const handleEditProfile = useCallback(() => {
    setEditName(user?.name ?? '');
    setEditEmail(user?.email ?? '');
    setIsEditingProfile(true);
  }, [user]);

  const handleSaveProfile = useCallback(() => {
    if (!editName.trim() || !editEmail.trim() || !editEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid name and email.');
      return;
    }
    updateProfile({ email: editEmail.trim(), name: editName.trim() });
    setIsEditingProfile(false);
  }, [editName, editEmail, updateProfile]);

  const handleCancelEdit = useCallback(() => {
    setIsEditingProfile(false);
  }, []);

  const handlePrivacy = useCallback(() => {
    Alert.alert(
      'Privacy',
      'Your saved designs and browsing data are stored locally on your device. We do not share your data with third parties.',
    );
  }, []);

  const handleShare = useCallback(() => {
    Alert.alert('Share', 'Sharing functionality coming soon.');
  }, []);

  const handleHelp = useCallback(() => {
    Alert.alert(
      'Help & Support',
      'Need help? Contact us at support@example.com',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Email',
          onPress: () => {
            Linking.openURL('mailto:support@example.com');
          },
        },
      ],
    );
  }, []);

  const handleAbout = useCallback(() => {
    Alert.alert(
      'About',
      'Interior Design Inspiration\nVersion 1.0.0\n\nBrowse and save beautiful interior designs from talented designers around the world.',
    );
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isEditingProfile ? (
          <View style={styles.editSection}>
            <View style={styles.editHeader}>
              <Text style={styles.editTitle}>Edit Profile</Text>
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleCancelEdit} style={styles.editActionBtn} activeOpacity={0.7}>
                  <X size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveProfile} style={styles.editActionBtn} activeOpacity={0.7} disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? (
                    <ActivityIndicator size="small" color={Colors.accent} />
                  ) : (
                    <Check size={20} color={Colors.accent} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.editLabel}>Name</Text>
            <TextInput
              style={styles.editInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor={Colors.textTertiary}
              autoCapitalize="words"
            />
            <Text style={styles.editLabel}>Email</Text>
            <TextInput
              style={styles.editInput}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.profileRow} onPress={handleEditProfile} activeOpacity={0.6}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitial}>
                  {(user?.name ?? user?.email ?? '?')[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name ?? 'No name'}</Text>
                <Text style={styles.profileEmail}>{user?.email ?? 'Not signed in'}</Text>
              </View>
              <Pencil size={18} color={Colors.textTertiary} strokeWidth={1.5} />
            </TouchableOpacity>

            <View style={styles.separator} />
          </>
        )}

        <TouchableOpacity
          style={styles.row}
          onPress={() => setNotificationsEnabled((prev) => !prev)}
          activeOpacity={0.6}
        >
          <View style={styles.rowIcon}>
            <Bell size={20} color={Colors.textSecondary} strokeWidth={1.5} />
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Push notifications</Text>
            <Text style={styles.rowSubtitle}>{notificationsEnabled ? 'Enabled' : 'Disabled'}</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: Colors.border, true: Colors.textPrimary }}
            thumbColor="#fff"
          />
        </TouchableOpacity>

        <View style={styles.separator} />

        <SettingsRow
          icon={<Lock size={20} color={Colors.textSecondary} strokeWidth={1.5} />}
          title="Privacy"
          subtitle="Control your privacy settings"
          onPress={handlePrivacy}
        />

        <View style={styles.separator} />

        <SettingsRow
          icon={<Share2 size={20} color={Colors.textSecondary} strokeWidth={1.5} />}
          title="Sharing"
          subtitle="Share and invite friends"
          onPress={handleShare}
        />

        <View style={styles.separator} />

        <SettingsRow
          icon={<HelpCircle size={20} color={Colors.textSecondary} strokeWidth={1.5} />}
          title="Help & Support"
          subtitle="FAQ, contact us, report a problem"
          onPress={handleHelp}
        />

        <View style={styles.separator} />

        <SettingsRow
          icon={<Info size={20} color={Colors.textSecondary} strokeWidth={1.5} />}
          title="About"
          subtitle="Terms, privacy policy, licenses"
          onPress={handleAbout}
        />

        <View style={styles.separator} />

        <SettingsRow
          icon={<LogOut size={20} color={Colors.danger} strokeWidth={1.5} />}
          title="Sign out"
          subtitle="Sign out of your account"
          onPress={handleSignOut}
          danger
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 60,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileInitial: {
    fontSize: 22,
    fontFamily: Fonts.headingSemiBold,
    color: Colors.accent,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: Fonts.headingSemiBold,
    color: Colors.textPrimary,
    letterSpacing: 0.1,
    marginBottom: 3,
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
  },
  editSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editTitle: {
    fontSize: 20,
    fontFamily: Fonts.headingSemiBold,
    color: Colors.textPrimary,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editActionBtn: {
    padding: 6,
  },
  editLabel: {
    fontSize: 11,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
  editInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  rowIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: 14,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: Fonts.headingMedium,
    color: Colors.textPrimary,
    letterSpacing: 0.1,
    marginBottom: 3,
  },
  rowTitleDanger: {
    color: Colors.danger,
  },
  rowSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CD964',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 66,
  },
  footer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontFamily: Fonts.body,
  },
});
