import React from 'react';
import './global.css';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TopicScreen from './src/screens/TopicScreen';
import ChatScreen from './src/screens/ChatScreen';
import ConsultantRooms from './src/screens/ConsultantRooms';
import { AuthProvider, useAuth } from './src/context/AuthContext';

export type RootStackParamList = {
  Topics: undefined;
  ConsultantRooms: undefined;
  Chat: { topic: string; roomId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { role, loading } = useAuth();

  if (loading) {
    return <></>;
  }

  return (
    <Stack.Navigator>
      {role === 'consultant' ? (
        <Stack.Screen
          name="ConsultantRooms"
          component={ConsultantRooms}
          options={{ title: 'My Rooms' }}
        />
      ) : (
        <Stack.Screen
          name="Topics"
          component={TopicScreen}
          options={{ title: '' }}
        />
      )}
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params.topic,
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
