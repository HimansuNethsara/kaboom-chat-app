import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallsScreen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  const { applied } = useTheme();
  const styles = createStyles(applied);

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "chatbubble-ellipses";

          if (route.name === "Chats") iconName = "chatbubble-ellipses";
          else if (route.name === "Status") iconName = "time";
          else if (route.name === "Calls") iconName = "call";

          return (
            <View style={focused ? styles.iconContainerFocused : styles.iconContainer}>
              <Ionicons name={iconName} size={26} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={[styles.tabLabel, { color }, focused && styles.tabLabelFocused]}>
            {route.name}
          </Text>
        ),
        tabBarActiveTintColor: applied === "dark" ? "#FACC15" : "#EAB308", 
        tabBarInactiveTintColor: applied === "dark" ? "#64748b" : "#9ca3af",
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: applied === "dark" ? "#f8fafc" : "#1e293b",
        headerTitleAlign: "center",
      })}
    >
      <Tabs.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen 
        name="Status" 
        component={StatusScreen} 
        options={{ title: "Status Updates" }}
      />
      <Tabs.Screen 
        name="Calls" 
        component={CallsScreen} 
        options={{ title: "Call History" }}
      />
    </Tabs.Navigator>
  );
}

const createStyles = (applied: "light" | "dark") =>
  StyleSheet.create({
    tabBar: {
      height: 70,
      backgroundColor: applied === "dark" ? "#1f1f1f" : "#ffffff", 
      borderTopWidth: 0,
      paddingTop: 6,
      paddingBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: applied === "dark" ? 0.1 : 0.08,
      shadowRadius: 10,
      elevation: 10,
    },
    header: {
      backgroundColor: applied === "dark" ? "#1f1f1f" : "#ffffff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: applied === "dark" ? 0.1 : 0.06,
      shadowRadius: 6,
      elevation: 5,
      borderBottomWidth: 1,
      borderBottomColor: applied === "dark" ? "#333" : "#e5e7eb",
    },
    headerTitle: {
      fontWeight: "700",
      fontSize: 18,
      color: applied === "dark" ? "#f8fafc" : "#111827",
    },
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainerFocused: {
      alignItems: "center",
      justifyContent: "center",
      transform: [{ scale: 1.15 }], 
    },
    activeIndicator: {
      position: "absolute",
      bottom: -4,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: applied === "dark" ? "#FACC15" : "#EAB308",
      shadowColor: applied === "dark" ? "#000" : "#000",
      shadowOpacity: 0.3,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
    },
    tabLabel: {
      fontSize: 13,
      fontWeight: "500",
      marginTop: 2,
    },
    tabLabelFocused: {
      fontWeight: "700",
    },
    badge: {
      backgroundColor: "#ef4444",
      color: "white",
      fontSize: 12,
      fontWeight: "700",
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      textAlign: "center",
      overflow: "hidden",
    },
  });
