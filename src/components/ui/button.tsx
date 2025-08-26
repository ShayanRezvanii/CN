import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  className,
}: Props) {
  const base = 'px-4 py-4 rounded-lg items-center justify-center';
  const styles = variant === 'primary' ? 'bg-[#FEA405]' : 'bg-zinc-200';

  const textStyles =
    variant === 'primary'
      ? 'text-white font-bold'
      : 'text-zinc-700 font-semibold';

  return (
    <Pressable
      onPress={onPress}
      className={`${base} ${styles} ${className || ''}`}
    >
      <Text className={textStyles}>{title}</Text>
    </Pressable>
  );
}
