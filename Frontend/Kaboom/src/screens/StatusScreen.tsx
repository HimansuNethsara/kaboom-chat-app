import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

export default function StatusScreen() {
  const { applied } = useTheme();

  const bgColor = applied === "dark" ? "#1f1f1f" : "#fdf7ed"; 
  const cardColor = applied === "dark" ? "#2b2b2b" : "#fff7e5"; 
  const textPrimary = applied === "dark" ? "#facc15" : "#b45309"; 
  const textSecondary = applied === "dark" ? "#9e9e9e" : "#6b4827";
  const shadowColor = applied === "dark" ? "#000" : "#d1a054";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={["right", "bottom", "left"]}>
      <StatusBar
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor={bgColor}
      />

      <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: "center", alignItems: "center" }}>
        
        {/* Floating Gradient Card */}
        <View style={{
          width: "100%",
          borderRadius: 24,
          padding: 24,
          backgroundColor: cardColor,
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 10,
          alignItems: "center"
        }}>
          {/* Icon Circle */}
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: applied === "dark" ? "#3c3c3c" : "#fef3c7",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
          }}>
            <Ionicons name="pencil" size={32} color={textPrimary} />
          </View>

          {/* Title */}
          <Text style={{ fontSize: 24, fontWeight: "700", color: textPrimary, textAlign: "center", marginBottom: 8 }}>
            Status Updates
          </Text>

          {/* Subtitle */}
          <Text style={{ fontSize: 16, color: textSecondary, textAlign: "center", marginBottom: 20 }}>
            Share updates that disappear after 24 hours
          </Text>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", width: "100%" }}>
            <TouchableOpacity style={{
              flex: 1,
              marginRight: 10,
              paddingVertical: 12,
              borderRadius: 16,
              backgroundColor: textPrimary,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: shadowColor,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.4,
              shadowRadius: 6,
            }}>
              <Text style={{ color: applied === "dark" ? "#1f1f1f" : "#fff", fontWeight: "600" }}>Add Status</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
              flex: 1,
              marginLeft: 10,
              paddingVertical: 12,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: textPrimary,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: applied === "dark" ? "#2b2b2b" : "#fff7e5",
              shadowColor: shadowColor,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}>
              <Text style={{ color: textPrimary, fontWeight: "600" }}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Note */}
        <Text style={{
          fontSize: 12,
          color: applied === "dark" ? "#7f7f7f" : "#6b4827",
          marginTop: 24,
          textAlign: "center"
        }}>
          Updates are private and will disappear automatically.
        </Text>
      </View>
    </SafeAreaView>
  );
}
