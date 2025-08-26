// src/screens/TopicScreen.tsx
import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TOPICS = [
  'Psychology',
  'Career',
  'Personal Finance',
  'Self Growth',
  'Education',
];

type Props = NativeStackScreenProps<RootStackParamList, 'Topics'>;

export default function TopicScreen({ navigation }: Props) {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-8xl text-[#FEA405] font-bold mb-2 text-center">
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
              onPress={() => navigation.navigate('Chat', { topic: item })}
            >
              <Text className="text-base text-[#FEA405] font-semibold">
                {item}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      />
    </View>
  );
}
