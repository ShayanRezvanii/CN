// src/components/AuthModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, Alert } from 'react-native';
import { setToken } from '../../lib/Auth/auth';
import Button from '../ui/button';
import Input from '../ui/input';
import { useAuth } from '../../context/AuthContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({ visible, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loadRole } = useAuth();

  const login = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        'https://no-ai-7f4bb5f0d7ab.herokuapp.com/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }

      const data = await res.json();

      await setToken(data.token);

      await loadRole();
      onSuccess();

      onClose();
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white w-11/12 rounded-2xl p-6">
          <Text className="text-xl font-bold mb-4 text-center text-[#FEA405]">
            Login Required
          </Text>

          <View className=" flex flex-col gap-16">
            <View>
              <Input
                placeholder="Email"
                value={email.toLowerCase()}
                onChangeText={setEmail}
              />
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View className=" max-w-[420px] flex justify-center items-center">
              <View className="flex-col gap-3 w-full">
                <Button
                  title={loading ? 'Loading...' : 'Login'}
                  variant="primary"
                  onPress={login}
                  // disabled={loading}
                />
                <Button title="Cancel" variant="secondary" onPress={onClose} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
