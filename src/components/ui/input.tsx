import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      className="border-b  text-base border-zinc-100 mb-0 rounded-lg px-3 py-4 "
      placeholderTextColor="#999"
      {...props}
    />
  );
}
