import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function CallsScreen() {
  const { applied } = useTheme();

  const bgColor = applied === "dark" ? "#141414" : "#F9FAFB"; 
  const cardColor = applied === "dark" ? "#1f1f1f" : "#ffffff"; 
  const textPrimary = applied === "dark" ? "#f3f4f6" : "#111827"; 
  const textSecondary = applied === "dark" ? "#9ca3af" : "#6b7280"; 
  const accent = applied === "dark" ? "#FACC15" : "#EAB308"; 

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bgColor }} edges={["top", "bottom", "left", "right"]}>
      <StatusBar 
        barStyle={applied === "dark" ? "light-content" : "dark-content"} 
        backgroundColor={bgColor} 
      />

      <View className="flex-1 px-5 py-6">
        {/* Header */}
        <Text className="text-3xl font-extrabold mb-2" style={{ color: accent }}>
          Calls
        </Text>
        <Text className="text-sm mb-6" style={{ color: textSecondary }}>
          Your recent calls and call history
        </Text>

        {/* Placeholder card */}
        <View 
          className="rounded-xl p-5 mb-4 shadow-md"
          style={{
            backgroundColor: cardColor,
            shadowColor: applied === "dark" ? "#000" : "#d1d5db",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 4
          }}
        >
          <Text className="text-lg font-semibold mb-1" style={{ color: textPrimary }}>
            No calls yet
          </Text>
          <Text className="text-sm" style={{ color: textSecondary }}>
            Once you start making calls, they will appear here.
          </Text>
        </View>

        {[...Array(2)].map((_, i) => (
          <View 
            key={i}
            className="rounded-xl p-5 mb-4 shadow-md"
            style={{
              backgroundColor: cardColor,
              shadowColor: applied === "dark" ? "#000" : "#d1d5db",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 3
            }}
          >
            <Text className="text-lg font-semibold mb-1" style={{ color: textPrimary }}>
              Sample Call {i + 1}
            </Text>
            <Text className="text-sm" style={{ color: textSecondary }}>
              Call details will appear here.
            </Text>
          </View>
        ))}

      </View>
    </SafeAreaView>
  );
}
