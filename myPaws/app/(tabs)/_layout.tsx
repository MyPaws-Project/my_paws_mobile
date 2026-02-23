import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Pressable, Image, Text } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import useOptions from "../../hooks/useOptions"
import useChat from "../../hooks/useChat";
import useChatTabs from "../../hooks/useChatTabs";
import { handleLogout } from "../../auth/authService";

export default function TabsLayout() {
  const { showOptions, handleOptions } = useOptions()
  const { showChat, handleChat } = useChat()
  const { showFirstTab, showSecondTab, handleFirstTab, handleSecondTab } = useChatTabs()

  useEffect(() => {
    NavigationBar.setButtonStyleAsync("light"); //  white sysyem icons

    return () => {
      // reset when leaving (tabs)
      NavigationBar.setButtonStyleAsync("dark");
    };
  }, []);

  return (
    <>
      <Tabs screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#5C9E3F" },
        headerTintColor: "#fff",
        headerTitle: "",
        tabBarShowLabel: false, tabBarStyle: styles.TabStyle,
        headerLeft: () => (
          <View style={{ paddingLeft: 10 }}>
            <Image source={require("../../assets/images/paws_logo_tiny.png")} style={{ width: 30, height: 30 }} />
          </View>
        ),
        headerRight: () => (

          <View style={{ flexDirection: "row", gap: 16, paddingRight: 10 }}>
            <Pressable onPress={() => { handleChat(); if (showOptions) { handleOptions() } }}>
              <Ionicons name={showChat ? "chatbox" : "chatbox-outline"} size={29} color="#fff" />
            </Pressable>

            <Pressable onPress={() => { handleOptions(); if (showChat) { handleChat() } }}>
              <Ionicons name={showOptions ? "settings" : "settings-outline"} size={29} color="#fff" />
            </Pressable>
          </View>

        ),
      }}>
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            tabBarIcon: ({ focused }) => (
              <View>
                <Ionicons name={focused ? "location" : "location-outline"} size={29} color={'#FFF'} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            tabBarIcon: ({ focused }) => (
              <View>
                <Ionicons name={focused ? "calendar" : "calendar-outline"} size={29} color={'#FFF'} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <View >
                <Ionicons name={focused ? "home" : "home-outline"} size={29} color={'#FFF'} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="files"
          options={{
            title: "Files",
            tabBarIcon: ({ focused }) => (
              <View>
                <Ionicons name={focused ? "document" : "document-outline"} size={29} color={'#FFF'} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <View>
                <Ionicons name={focused ? "person" : "person-outline"} size={29} color={'#FFF'} />
              </View>
            ),
          }}
        />
      </Tabs>
      <View style={styles.overlay}>
        {
          showChat && (
            <View style={styles.overlayChat}>
              <View style={{
                position: "absolute",
                top: 98,
                right: 0,
                backgroundColor: "#5C9E3F",
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                padding: 10,
                minWidth: 180,
                height: 600,
                width: '100%',
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <View style={{
                  width: '100%', backgroundColor: '#C9E7AE', height: '100%',
                  borderRadius: 12,
                  padding: 8
                }}>
                  <View style={{ position: "relative", width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <Pressable style={{ width: '50%' }} onPress={handleFirstTab}>
                      <View style={{
                        backgroundColor: showFirstTab ? '#FFF' : '#dedede', borderTopLeftRadius: 12,
                        borderTopRightRadius: 12, padding: 5, display: "flex", alignItems: 'center'
                      }}>
                        <Text style={{ fontSize: 18, fontWeight: '400' }}>
                          Veterinary Clinic 1
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable style={{ width: '50%' }} onPress={handleSecondTab}>
                      <View style={{
                        backgroundColor: showSecondTab ? '#FFF' : '#dedede', borderTopLeftRadius: 12,
                        borderTopRightRadius: 12, padding: 5, display: "flex", alignItems: 'center'
                      }}>
                        <Text style={{ fontSize: 18, fontWeight: '400' }}>
                          Support
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                  <View style={{
                    position: 'relative', backgroundColor: '#FFF', height: '93%', borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}>
                  </View>

                </View>
              </View>

              {/* tap outside to close */}
              <Pressable style={StyleSheet.absoluteFill} />
            </View>
          )
        }
        {
          showOptions && (
            <View style={styles.overlayOptions}>
              <View style={styles.menu}>
                <Pressable style={styles.item}>
                  <Ionicons name="options" size={29} color={'#FFF'} />
                  <Text style={{ color: '#FFF', fontSize: 18 }}>Settings</Text>
                </Pressable>

                <Pressable style={styles.item} onPress={() => { handleLogout(); router.replace("/(auth)/Login") }}>
                  <Ionicons name="log-out-outline" size={29} color={'#FFF'} />
                  <Text style={{ color: '#FFF', fontSize: 18 }}>Logout</Text>
                </Pressable>
              </View>

              {/* tap outside to close */}
              <Pressable style={StyleSheet.absoluteFill} />
            </View>
          )
        }
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  TabStyle: {
    backgroundColor: "#5C9E3F",
    height: 90,
    width: '100%'
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    width: '100%',
    height: '100%'
  },
  overlayOptions: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  overlayChat: {
    position: "absolute",
    top: 0,
    right: 0,
    width: '100%'
  },
  menu: {
    position: "absolute",
    top: 98,
    right: 0,
    backgroundColor: "#5C9E3F",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 10,
    minWidth: 180,
    width: '100%'
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
})