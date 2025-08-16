import React from "react";
import { View, ViewStyle } from "react-native";
import { colors, radius, spacing } from "../theme";
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[{
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing(4),
      borderColor: colors.border,
      borderWidth: 1,
    }, style]}>
      {children}
    </View>
  );
}
