import React, { useEffect } from 'react';
import './global.css';

import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TopicScreen from './src/screens/TopicScreen';
import ChatScreen from './src/screens/ChatScreen';
import { clearToken } from './src/lib/Auth/auth';

export type RootStackParamList = {
  Topics: undefined;
  Chat: { topic: string; roomId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // useEffect(() => {
  //   clearToken();
  // }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Topics"
          component={TopicScreen}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({
            title: route.params.topic,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
