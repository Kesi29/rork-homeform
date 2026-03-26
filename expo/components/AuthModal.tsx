import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, signIn, isSigningIn } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const isValid = email.trim().length > 0 && email.includes('@') && name.trim().length > 0;

  const handleSignIn = useCallback(() => {
    if (!isValid) return;
    signIn({ email: email.trim(), name: name.trim() });
    setEmail('');
    setName('');
  }, [email, name, isValid, signIn]);

  const handleClose = useCallback(() => {
    setShowAuthModal(false);
    setEmail('');
    setName('');
  }, [setShowAuthModal]);

  return (
    <Modal
      visible={showAuthModal}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            testID="auth-modal-close"
          >
            <X size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Save what inspires you</Text>
            <Text style={styles.subtitle}>
              Sign in to save images and create boards.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.textTertiary}
              autoCapitalize="words"
              autoCorrect={false}
              testID="auth-name-input"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              testID="auth-email-input"
            />

            <TouchableOpacity
              style={[styles.button, !isValid && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={!isValid || isSigningIn}
              activeOpacity={0.8}
              testID="auth-sign-in-button"
            >
              {isSigningIn ? (
                <ActivityIndicator color={Colors.black} size="small" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>
              We'll send you a magic link to sign in.{'\n'}No password needed.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
    alignSelf: 'center',
    marginBottom: 12,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  header: {
    marginTop: 8,
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.heading,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 21,
    fontFamily: Fonts.body,
  },
  form: {},
  label: {
    fontSize: 11,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
    marginBottom: 7,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
  input: {
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
  button: {
    height: 48,
    backgroundColor: Colors.textPrimary,
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 14,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.black,
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textTertiary,
    textAlign: 'center' as const,
    lineHeight: 18,
    fontFamily: Fonts.body,
  },
});
