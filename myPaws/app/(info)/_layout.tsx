import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      {/* Fake Status bar background */}
      <View
        style={{
          height: insets.top,
          backgroundColor: "#5C9E3F",
        }}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          statusBarStyle: "light",
          contentStyle: { backgroundColor: "#fff" },
        }}
      />
    </View>
  );
}
