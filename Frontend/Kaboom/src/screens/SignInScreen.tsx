import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import {
  ALERT_TYPE,
  Toast,
} from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { useState, useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../components/AuthProvider";

const API = process.env.EXPO_PUBLIC_APP_URL + "/Kaboom";

type SignInProps = NativeStackNavigationProp<RootStack, "SignInScreen">;

export default function SignInScreen() {
  const navigation = useNavigation<SignInProps>();
  const { applied } = useTheme();
  const logo = require("../../assets/logo.png");

  const [phoneNo, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  const bgColor = applied === "dark" ? "#1a1a1a" : "#f5f5f5";
  const inputBg = applied === "dark" ? "#2c2c2c" : "#ffffff";
  const textPrimary = applied === "dark" ? "#facc15" : "#b58900"; // yellow
  const textSecondary = applied === "dark" ? "#c0c0c0" : "#555555"; // gray
  const placeholderColor = applied === "dark" ? "#9ca3af" : "#a0a0a0";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 80 : 60}
      style={{ flex: 1, backgroundColor: bgColor }}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <StatusBar
          barStyle={applied === "light" ? "dark-content" : "light-content"}
          backgroundColor={bgColor}
        />

        {/* Logo + Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Image source={logo} style={{ width: 120, height: 120, marginBottom: 12 }} />
          <Text style={{
            fontSize: 32,
            fontWeight: "bold",
            color: applied === "dark" ? "#fdf6b2" : "#b58900",
          }}>
            Welcome Back
          </Text>
          <Text style={{
            fontSize: 16,
            color: textSecondary,
            textAlign: "center",
            marginTop: 6,
          }}>
            Enter your phone number to continue
          </Text>
        </View>

        {/* Phone Input */}
        <View style={{ marginBottom: 24 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: inputBg,
            borderRadius: 16,
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOpacity: applied === "dark" ? 0.3 : 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 5,
            borderWidth: phoneNo ? 2 : 1,
            borderColor: phoneNo ? textPrimary : (applied === "dark" ? "#444" : "#ccc"),
          }}>
            <Ionicons
              name="call-outline"
              size={24}
              color={phoneNo ? textPrimary : placeholderColor}
            />
            <TextInput
              value={phoneNo}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              placeholderTextColor={placeholderColor}
              style={{
                flex: 1,
                fontSize: 16,
                color: applied === "dark" ? "#fff" : "#333",
                paddingVertical: 14,
                marginLeft: 8,
              }}
            />
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          disabled={!phoneNo || loading}
          onPress={async () => {
            setLoading(true);
            try {
              const response = await fetch(API + "/SignIn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile: phoneNo }),
              });
              if (response.ok) {
                const json = await response.json();
                if (json.status && auth) await auth.signUp(String(json.userId));
                else Toast.show({ type: ALERT_TYPE.WARNING, title: "Warning", textBody: json.message });
              } else {
                Toast.show({ type: ALERT_TYPE.DANGER, title: "Network Error", textBody: "Failed to connect." });
              }
            } catch {
              Toast.show({ type: ALERT_TYPE.DANGER, title: "Error", textBody: "Something went wrong!" });
            } finally {
              setLoading(false);
            }
          }}
          style={{
            height: 56,
            borderRadius: 28,
            backgroundColor: phoneNo && !loading ? textPrimary : "#aaa",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 4,
            elevation: 6,
          }}
        >
          <Text style={{
            color: applied === "dark" ? "#1a1a1a" : "#fff",
            fontWeight: "bold",
            fontSize: 18,
          }}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
          <Text style={{ color: textSecondary, fontSize: 14 }}>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate("SignUpScreen")}>
            <Text style={{ color: textPrimary, fontSize: 14, fontWeight: "bold" }}>Sign Up</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
