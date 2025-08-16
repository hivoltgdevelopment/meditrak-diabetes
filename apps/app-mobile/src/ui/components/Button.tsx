import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from "react-native";
import { colors, radius, spacing } from "../theme";

export function Button({ title, onPress, disabled, loading, style }:{
  title:string; onPress:()=>void; disabled?:boolean; loading?:boolean; style?:ViewStyle;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[{
        backgroundColor: colors.primary,
        padding: spacing(4),
        borderRadius: radius.md,
        opacity: disabled || loading ? 0.6 : 1,
      }, style]}
    >
      {loading ? <ActivityIndicator /> : <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>{title}</Text>}
    </TouchableOpacity>
  );
}
