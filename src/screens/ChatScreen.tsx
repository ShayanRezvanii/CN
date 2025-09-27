// src/screens/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { getToken } from '../lib/Auth/auth';
import AuthModal from '../components/Modals/AuthModal';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import Input from '../components/ui/input';
import Button from '../components/ui/button';

type Msg = {
  id: string;
  content: string;
  createdAt: string;
  from: 'user' | 'consultant';
};

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const { roomId, topic } = route.params;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [authVisible, setAuthVisible] = useState(false);

  const fetchMessages = async () => {
    const token = await getToken();
    if (!token) {
      setAuthVisible(true);
      return;
    }

    const res = await fetch(
      `https://no-ai-7f4bb5f0d7ab.herokuapp.com//rooms/${roomId}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) return;
    const data = await res.json();
    setMessages(data);
  };

  // گرفتن پیام‌ها وقتی صفحه باز میشه
  useEffect(() => {
    fetchMessages();
  }, [roomId]);

  // ارسال پیام
  const send = async () => {
    if (!text.trim()) return;

    const token = await getToken();
    if (!token) {
      setAuthVisible(true);
      return;
    }

    const res = await fetch(
      `https://no-ai-7f4bb5f0d7ab.herokuapp.com/rooms/${roomId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      console.error('Send msg failed:', err);
      return;
    }

    const newMsg = await res.json(); // همون userMsg
    setMessages(prev => [...prev, newMsg]); // بلافاصله نشون بده
    setText('');

    // بعد از فرستادن، کل لیست پیام‌ها رو sync کن
    fetchMessages();
  };

  const endChat = async () => {
    const token = await getToken();
    if (!token) {
      setAuthVisible(true);
      return;
    }

    const res = await fetch(
      `https://no-ai-7f4bb5f0d7ab.herokuapp.com/rooms/${roomId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.ok) {
      navigation.goBack(); // برگرد به Topics
    }
  };

  const renderItem = ({ item }: { item: Msg }) => (
    <Animated.View
      entering={FadeInUp.duration(250)}
      className={`px-3 py-2 rounded-lg my-1 max-w-[75%] ${
        item.from === 'user'
          ? 'bg-[#FEA405] self-end'
          : 'bg-zinc-200 self-start'
      }`}
    >
      <Text
        className={`text-base ${
          item.from === 'user' ? 'text-white' : 'text-black'
        }`}
      >
        {item.content}
      </Text>
      <Text
        className={`text-[8px] mt-1 ${
          item.from === 'user' ? 'text-zinc-100' : 'text-zinc-500'
        }`}
      >
        {new Date(item.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 px-6 mb-12 "
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text className="text-center text-lg font-bold text-[#FEA405] mt-4">
        {topic}
      </Text>

      <FlatList
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        className="mt-5"
        contentContainerStyle={{ paddingBottom: 8 }}
      />

      <Pressable
        onPress={endChat}
        className="py-2 px-4 rounded-lg self-center mt-2 mb-4"
      >
        <Text className="text-red-600 font-bold">End Chat</Text>
      </Pressable>
      <View className="flex-row items-center border border-neutral-200 rounded-full pl-6">
        <Input
          placeholder="Type your message…"
          value={text}
          onChangeText={setText}
          onSubmitEditing={send}
          className="flex-1 mr-2"
        />
        <View className="w-full max-w-[80px]">
          <Button
            className="rounded-r-full"
            title="Send"
            variant="primary"
            onPress={send}
          />
        </View>
      </View>

      <AuthModal
        visible={authVisible}
        onClose={() => setAuthVisible(false)}
        onSuccess={() => {}}
      />
    </KeyboardAvoidingView>
  );
}
