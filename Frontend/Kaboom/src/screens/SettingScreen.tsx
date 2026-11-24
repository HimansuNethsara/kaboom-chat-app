import { Text, TouchableOpacity, View, ScrollView, Switch, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { Ionicons } from "@expo/vector-icons";

const options: ThemeOption[] = ["light", "dark", "system"];
type SettingScreenProp = NativeStackNavigationProp<RootStack, "SettingScreen">;

export default function SettingScreen() {
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProp>();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#141414" : "#f8fafc",
      },
      headerTintColor: applied === "dark" ? "#facc15" : "#1f2937",
      headerTitleStyle: {
        fontWeight: "700",
        fontSize: 18,
      },
    });
  }, [navigation, applied]);

  const getThemeIcon = (option: ThemeOption) => {
    switch (option) {
      case "light":
        return "sunny";
      case "dark":
        return "moon";
      case "system":
        return "phone-portrait";
      default:
        return "settings";
    }
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 28 }}>
      <Text style={{ fontSize: 16, fontWeight: "700", color: applied === "dark" ? "#f8fafc" : "#1f2937", marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </View>
  );

  const SettingItem = ({
    icon,
    title,
    subtitle,
    rightElement,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
  }) => (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: applied === "dark" ? "#222" : "#e5e7eb"
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: applied === "dark" ? "#1f1f1f" : "#fef3c7",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12
        }}>
          <Ionicons
            name={icon as any}
            size={20}
            color={applied === "dark" ? "#facc15" : "#b45309"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: applied === "dark" ? "#f8fafc" : "#1f2937" }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{ fontSize: 12, color: applied === "dark" ? "#9ca3af" : "#6b7280", marginTop: 2 }}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement}
    </View>
  );

  if (!applied) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: applied === "dark" ? "#1f1f1f" : "#f8fafc" }} edges={["right", "bottom", "left"]}>
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} backgroundColor={applied === "dark" ? "#1f1f1f" : "#f8fafc"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, backgroundColor: applied === "dark" ? "#1f1f1f" : "#f8fafc" }}>
        <SettingSection title="Appearance">
          <View style={{
            backgroundColor: applied === "dark" ? "#141414" : "#fff",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: applied === "dark" ? "#222" : "#e5e7eb",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: applied === "dark" ? 0.2 : 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}>
            {options.map((option, index) => {
              const selected = preference === option || (preference === "system" && applied === option);
              return (
                <TouchableOpacity
                  key={option}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    backgroundColor: selected ? (applied === "dark" ? "#333" : "#fef3c7") : applied === "dark" ? "#141414" : "#fff",
                    borderBottomWidth: index !== options.length - 1 ? 1 : 0,
                    borderBottomColor: applied === "dark" ? "#222" : "#e5e7eb",
                  }}
                  onPress={() => setPreference(option)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      backgroundColor: selected ? "#facc15" : applied === "dark" ? "#1f1f1f" : "#fef3c7",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12
                    }}>
                      <Ionicons name={getThemeIcon(option) as any} size={18} color={selected ? "#141414" : applied === "dark" ? "#f8fafc" : "#b45309"} />
                    </View>
                    <View>
                      <Text style={{ fontWeight: "600", fontSize: 14, color: applied === "dark" ? "#f8fafc" : "#1f2937" }}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                      <Text style={{ fontSize: 12, color: applied === "dark" ? "#9ca3af" : "#6b7280", marginTop: 2 }}>
                        {option === "system" ? "Follow device settings" : `${option} mode`}
                      </Text>
                    </View>
                  </View>
                  {selected && (
                    <Ionicons name="checkmark" size={18} color={applied === "dark" ? "#facc15" : "#b45309"} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </SettingSection>

        <SettingSection title="Support">
          <View style={{
            backgroundColor: applied === "dark" ? "#141414" : "#fff",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: applied === "dark" ? "#222" : "#e5e7eb",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: applied === "dark" ? 0.2 : 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}>
            <SettingItem icon="help-circle" title="Help & Support" subtitle="Get help with the app"
              rightElement={<Ionicons name="chevron-forward" size={20} color={applied === "dark" ? "#9ca3af" : "#6b7280"} />}
            />
            <SettingItem icon="shield-checkmark" title="Privacy Policy"
              rightElement={<Ionicons name="chevron-forward" size={20} color={applied === "dark" ? "#9ca3af" : "#6b7280"} />}
            />
            <SettingItem icon="document-text" title="Terms of Service"
              rightElement={<Ionicons name="chevron-forward" size={20} color={applied === "dark" ? "#9ca3af" : "#6b7280"} />}
            />
          </View>
        </SettingSection>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ fontSize: 12, color: applied === "dark" ? "#9ca3af" : "#6b7280" }}>
            version {process.env.EXPO_PUBLIC_APP_VERSION}
          </Text>
          <Text style={{ fontSize: 12, color: applied === "dark" ? "#9ca3af" : "#6b7280", marginTop: 2 }}>
            {process.env.EXPO_PUBLIC_APP_OWNER}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
