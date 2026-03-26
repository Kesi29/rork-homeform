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
  ScrollView,
  Alert,
} from 'react-native';
import { X, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { Designer } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc';

interface InquiryModalProps {
  visible: boolean;
  onClose: () => void;
  designer: Designer;
}

export default function InquiryModal({ visible, onClose, designer }: InquiryModalProps) {
  const { user, requireAuth } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [message, setMessage] = useState('');

  const createInquiry = trpc.inquiries.create.useMutation({
    onSuccess: () => {
      Alert.alert(
        'Inquiry sent',
        `Your message has been sent to ${designer.studio_name}. They'll be in touch soon.`,
        [{ text: 'OK', onPress: onClose }]
      );
      setName('');
      setEmail('');
      setZipCode('');
      setMessage('');
    },
    onError: (error) => {
      console.log('Inquiry submission failed:', error);
      Alert.alert('Error', 'Failed to send inquiry. Please try again.');
    },
  });

  const handleSubmit = useCallback(() => {
    if (!requireAuth()) return;
    if (!name.trim() || !email.trim() || !zipCode.trim()) {
      Alert.alert('Missing fields', 'Please fill in your name, email, and ZIP code.');
      return;
    }
    createInquiry.mutate({
      user_id: user?.id ?? '',
      designer_id: designer.id,
      name: name.trim(),
      email: email.trim(),
      zip_code: zipCode.trim(),
      message: message.trim(),
    });
  }, [name, email, zipCode, message, designer, user, requireAuth, createInquiry]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Contact designer</Text>
              <Text style={styles.subtitle}>{designer.studio_name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <X size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.textTertiary}
              testID="inquiry-name"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="inquiry-email"
            />

            <Text style={styles.label}>ZIP Code *</Text>
            <TextInput
              style={styles.input}
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="60614"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="number-pad"
              maxLength={5}
              testID="inquiry-zip"
            />

            <Text style={styles.label}>Message (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Tell them about your project..."
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              testID="inquiry-message"
            />

            <TouchableOpacity
              style={[styles.submitButton, (!name.trim() || !email.trim() || !zipCode.trim()) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!name.trim() || !email.trim() || !zipCode.trim()}
              activeOpacity={0.8}
              testID="inquiry-submit"
            >
              <Send size={16} color={Colors.black} />
              <Text style={styles.submitText}>Send inquiry</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
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
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.heading,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontFamily: Fonts.body,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  label: {
    fontSize: 11,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 48,
    backgroundColor: Colors.textPrimary,
    borderRadius: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  submitText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    color: Colors.black,
    letterSpacing: 0.5,
  },
});
