// src/screens/TopicScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { clearToken, getToken } from '../lib/Auth/auth';
import AuthModal from '../components/Modals/AuthModal';
import { useAuth } from '../context/AuthContext';

const TOPICS = [
  'Psychology',
  'Career',
  'Personal Finance',
  'Self Growth',
  'Education',
];

type Props = NativeStackScreenProps<RootStackParamList, 'Topics'>;

export default function TopicScreen({ navigation }: Props) {
  const [authVisible, setAuthVisible] = useState(false);

  const { role, logout } = useAuth();

  const createRoom = async (topic: string) => {
    const token = await getToken();
    if (!token) {
      setAuthVisible(true);
      return null;
    }

    const res = await fetch('https://no-ai-7f4bb5f0d7ab.herokuapp.com/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // 🔑 حتماً توکن
      },
      body: JSON.stringify({ topic }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Create room failed:', err);
      return null;
    }

    const data = await res.json(); // { id, topic }
    return data.id;
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (!token) {
        setAuthVisible(true);
      }
    };
    checkToken();
  }, []);

  return (
    <View className="flex-1 p-4 bg-white">
      {role ? (
        <Pressable
          onPress={logout}
          className="bg-gray-200 py-2 px-4 mt-2 rounded-lg self-end"
        >
          <Text className="text-red-500 font-bold">Sign Out</Text>
        </Pressable>
      ) : null}

      <Text className="text-8xl text-[#FEA405] font-bold mb-2 mt-10 text-center">
        CN
      </Text>
      <Text className="text-2xl text-[#FEA405] font-bold mb-10 text-center">
        Choose your topic
      </Text>
      <FlatList
        data={TOPICS}
        className="px-6"
        keyExtractor={x => x}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 120)
              .duration(400)
              .springify()}
          >
            <Pressable
              className="p-4 mb-3 rounded-xl border border-[#FEA405] active:bg-zinc-200"
              onPress={async () => {
                const roomId = await createRoom(item);
                if (roomId) {
                  navigation.navigate('Chat', { topic: item, roomId });
                }
              }}
            >
              <Text className="text-base text-[#FEA405] font-semibold">
                {item}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      />

      <AuthModal
        visible={authVisible}
        onClose={() => setAuthVisible(false)}
        onSuccess={() => setAuthVisible(false)}
      />
    </View>
  );
}
