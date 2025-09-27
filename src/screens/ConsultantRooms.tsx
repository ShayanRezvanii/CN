// src/screens/ConsultantRooms.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { getToken } from '../lib/Auth/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';

type Room = { id: string; topic: string; createdAt: string };

type Props = NativeStackScreenProps<RootStackParamList, 'ConsultantRooms'>;

export default function ConsultantRooms({ navigation }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      const token = await getToken();
      const res = await fetch(
        'https://no-ai-7f4bb5f0d7ab.herokuapp.com/rooms/consultant/my-rooms',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) return;
      const data = await res.json();
      setRooms(data);
    };

    fetchRooms();
  }, []);

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex flex-row justify-between px-2 items-center mb-4">
        <View>
          <Text className="text-2xl text-[#FEA405] font-bold mb-0 text-center">
            My Chats
          </Text>
        </View>

        <View>
          <Pressable
            onPress={logout}
            className="bg-gray-200 py-2 px-4  rounded-lg self-end"
          >
            <Text className="text-red-500 font-bold">Sign Out</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={r => r.id}
        renderItem={({ item }) => (
          <Pressable
            className="p-4 border-b border-neutral-200"
            onPress={() =>
              navigation.navigate('Chat', {
                topic: item.topic,
                roomId: item.id,
              })
            }
          >
            <Text className="text-lg text-[#FEA405] font-semibold">
              {item.topic}
            </Text>
            <Text className="text-xs text-gray-400">
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
