import { Stack } from "expo-router";
import AuthProvider from "../context/AuthContext";
import { ClientProvider } from "../context/ClientContext";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    font: require("../assets/fonts/my_paws_font.ttf")
  });
  return (
    <AuthProvider>
      <ClientProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: "#5C9E3F" },
            headerTitle: "",
            headerShadowVisible: false,
          }}
        />
      </ClientProvider>
    </AuthProvider>
  );
}