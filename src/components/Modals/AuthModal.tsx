import React, { useState } from 'react';
import { Modal, View, Text } from 'react-native';
import { setToken } from '../../lib/Auth/auth';
import Button from '../ui/button';
import Input from '../ui/input';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({ visible, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    await setToken('demo_token');
    onSuccess();
    onClose();
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
                value={email}
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
                <Button title="Login" variant="primary" onPress={login} />
                <Button title="Cancel" variant="secondary" onPress={onClose} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
