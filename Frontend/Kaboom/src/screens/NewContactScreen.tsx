import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView as RNSafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  validateCountryCode,
  validateFirstName,
  validateLastName,
  validatePhoneNo,
} from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";
import { useTheme } from "../theme/ThemeProvider";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";

type NewContactScreenProp = NativeStackNavigationProp<
  RootStack,
  "NewContactScreen"
>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function DecorativeBadge({ text, applied }: { text: string; applied: "light" | "dark" }) {
  return (
    <View
      style={{
        backgroundColor: applied === "dark" ? "#1f1f1f" : "#fff8dc",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: applied === "dark" ? 1 : 0,
        borderColor: applied === "dark" ? "#2a2a2a" : "transparent",
        shadowColor: "#000",
        shadowOpacity: applied === "dark" ? 0.15 : 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <Text style={{ color: applied === "dark" ? "#FACC15" : "#B45309", fontWeight: "700" }}>{text}</Text>
    </View>
  );
}

function SectionHeader({ title, applied, subtitle }: { title: string; applied: "light" | "dark"; subtitle?: string }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ color: applied === "dark" ? "#f8fafc" : "#111827", fontSize: 16, fontWeight: "800" }}>{title}</Text>
      {subtitle ? (
        <Text style={{ color: applied === "dark" ? "#9ca3af" : "#6b7280", marginTop: 4, fontSize: 12 }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

function FloatingLabelInput({
  value,
  onChangeText,
  placeholder,
  applied,
  keyboardType,
  accessibilityLabel,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  applied: "light" | "dark";
  keyboardType?: "default" | "phone-pad" | "email-address";
  accessibilityLabel?: string;
}) {
  const focused = useRef(false);
  const offset = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    offset.value = withTiming(value ? 1 : 0, { duration: 250 });
  }, [value]);

  const anim = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value === 1 ? -12 : 0 }],
      opacity: offset.value === 1 ? 1 : 0.85,
    };
  });

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={{
        marginBottom: 12,
      }}>
        <Animated.View style={[{ position: "absolute", left: 18, top: 12, zIndex: 10 }, anim]}>
          <Text style={{ color: applied === "dark" ? "#FACC15" : "#B45309", fontSize: 12, fontWeight: "700" }}>
            {placeholder}
          </Text>
        </Animated.View>

        <TextInput
          value={value}
          onChangeText={(t) => onChangeText(t)}
          placeholder={value ? "" : placeholder}
          placeholderTextColor={applied === "dark" ? "#9ca3af" : "#9ca3af"}
          keyboardType={keyboardType ?? "default"}
          accessibilityLabel={accessibilityLabel}
          style={{
            backgroundColor: applied === "dark" ? "#1f1f1f" : "#fff",
            color: applied === "dark" ? "#f8fafc" : "#0f172a",
            paddingHorizontal: 18,
            paddingVertical: 20,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: applied === "dark" ? "#2a2a2a" : "#e6e6e6",
            fontSize: 16,
            fontWeight: "600",
            shadowColor: "#000",
            shadowOpacity: applied === "dark" ? 0.08 : 0.04,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function NewContactScreen() {
  const navigation = useNavigation<NewContactScreenProp>();
  const { applied } = useTheme();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState("+94");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { sendNewContact } = useSendNewContact();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: applied === "dark" ? "#141414" : "#fff",
      },
      headerTintColor: applied === "dark" ? "#f8fafc" : "#0f172a",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6, marginRight: 8 }}>
            <Ionicons name="arrow-back" size={26} color={applied === "dark" ? "#f8fafc" : "#111827"} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "800", color: applied === "dark" ? "#f8fafc" : "#111827" }}>New Contact</Text>
            <Text style={{ fontSize: 12, color: applied === "dark" ? "#9ca3af" : "#6b7280" }}>{/* dynamic below header */}Add someone to your network</Text>
          </View>
        </View>
      ),
    });
  }, [navigation, applied]);

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1.03, { duration: 900 }), withTiming(1, { duration: 900 })), -1, true);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleSaveContact = async () => {
    const firstNameValid = validateFirstName(firstName);
    const lastNameValid = validateLastName(lastName);
    const countryCodeValid = validateCountryCode(callingCode);
    const phoneNoValid = validatePhoneNo(phoneNo);

    if (firstNameValid) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: "Invalid First Name", textBody: firstNameValid });
      return;
    }
    if (lastNameValid) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: "Invalid Last Name", textBody: lastNameValid });
      return;
    }
    if (countryCodeValid) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: "Invalid Country Code", textBody: countryCodeValid });
      return;
    }
    if (phoneNoValid) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: "Invalid Phone Number", textBody: phoneNoValid });
      return;
    }

    setIsLoading(true);
    try {
      await sendNewContact({
        id: 0,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        countryCode: callingCode,
        contactNo: phoneNo.trim(),
        createdAt: "",
        updatedAt: "",
        status: "",
      });

      Toast.show({ type: ALERT_TYPE.SUCCESS, title: "Success", textBody: "Contact saved successfully!" });

      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    } catch (err) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: "Error", textBody: "Failed to save contact. Try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const openCountryPicker = () => setShowCountryPicker(true);
  const closeCountryPicker = () => setShowCountryPicker(false);
  const handleCountrySelect = (c: Country) => {
    setCountryCode(c.cca2);
    setCountry(c);
    setCallingCode(`+${c.callingCode}`);
    setShowCountryPicker(false);
  };

  return (
    <RNSafeAreaView style={{ flex: 1, backgroundColor: applied === "dark" ? "#121212" : "#f5f5f5", }}>
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} backgroundColor={applied === "dark" ? "#0f172a" : "#ffffff"} />
      <SafeAreaView edges={["right", "bottom", "left"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
                <View style={{
                  backgroundColor: applied === "dark" ? "#141414" : "#ffffff",
                  borderRadius: 20,
                  padding: 18,
                  shadowColor: "#000",
                  shadowOpacity: applied === "dark" ? 0.35 : 0.08,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 6,
                  borderWidth: applied === "dark" ? 1 : 0,
                  borderColor: applied === "dark" ? "#222" : "transparent",
                }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <View>
                      <Text style={{ color: applied === "dark" ? "#FACC15" : "#c05621", fontWeight: "900", fontSize: 18 }}>Personal</Text>
                      <Text style={{ marginTop: 4, color: applied === "dark" ? "#9ca3af" : "#6b7280", fontSize: 12 }}>Your real name helps friends find you</Text>
                    </View>
                    <DecorativeBadge applied={applied} text="Required" />
                  </View>

                  <FloatingLabelInput applied={applied} placeholder="First Name" value={firstName} onChangeText={setFirstName} accessibilityLabel="First Name" />
                  <FloatingLabelInput applied={applied} placeholder="Last Name" value={lastName} onChangeText={setLastName} accessibilityLabel="Last Name" />

                  <View style={{ height: 1, backgroundColor: applied === "dark" ? "#222" : "#f1f1f1", marginVertical: 14, borderRadius: 2 }} />

                  <View style={{ marginTop: 6 }}>
                    <Text style={{ color: applied === "dark" ? "#f8fafc" : "#111827", fontWeight: "800", fontSize: 14 }}>Profile Options</Text>
                    <Text style={{ color: applied === "dark" ? "#9ca3af" : "#6b7280", fontSize: 12, marginTop: 6 }}>Choose how people see you</Text>

                    <View style={{ flexDirection: "row", marginTop: 12, justifyContent: "space-between" }}>
                      <TouchableOpacity style={{
                        flex: 1,
                        borderRadius: 14,
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        marginRight: 8,
                        backgroundColor: applied === "dark" ? "#1b1b1b" : "#fffaf0",
                        borderWidth: applied === "dark" ? 1 : 0,
                        borderColor: applied === "dark" ? "#2a2a2a" : "transparent",
                        alignItems: "center",
                      }}>
                        <Ionicons name="person" size={22} color={applied === "dark" ? "#FACC15" : "#b45309"} />
                        <Text style={{ color: applied === "dark" ? "#f8fafc" : "#111827", marginTop: 8, fontWeight: "700" }}>Public</Text>
                        <Text style={{ color: applied === "dark" ? "#9ca3af" : "#6b7280", fontSize: 12 }}>Visible to all</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={{
                        flex: 1,
                        borderRadius: 14,
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        marginLeft: 8,
                        backgroundColor: applied === "dark" ? "#111213" : "#fff",
                        borderWidth: applied === "dark" ? 1 : 0,
                        borderColor: applied === "dark" ? "#2a2a2a" : "#e6e6e6",
                        alignItems: "center",
                      }}>
                        <Ionicons name="people" size={22} color={applied === "dark" ? "#94a3b8" : "#6b7280"} />
                        <Text style={{ color: applied === "dark" ? "#f8fafc" : "#111827", marginTop: 8, fontWeight: "700" }}>Contacts</Text>
                        <Text style={{ color: applied === "dark" ? "#9ca3af" : "#6b7280", fontSize: 12 }}>Only your contacts</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={{ height: 18 }} />

                <View style={{
                  backgroundColor: applied === "dark" ? "#141414" : "#ffffff",
                  borderRadius: 20,
                  padding: 18,
                  shadowColor: "#000",
                  shadowOpacity: applied === "dark" ? 0.35 : 0.08,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 6,
                  borderWidth: applied === "dark" ? 1 : 0,
                  borderColor: applied === "dark" ? "#222" : "transparent",
                }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <View>
                      <Text style={{ color: applied === "dark" ? "#FACC15" : "#c05621", fontWeight: "900", fontSize: 18 }}>Phone</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{
                        padding: 8,
                        borderRadius: 10,
                        backgroundColor: applied === "dark" ? "#1b1b1b" : "#fffaf0",
                        borderWidth: applied === "dark" ? 1 : 0,
                        borderColor: applied === "dark" ? "#2a2a2a" : "transparent",
                      }}>
                        <Text style={{ color: applied === "dark" ? "#FACC15" : "#b45309", fontWeight: "700" }}>Required</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 6 }}>
                    <View style={{ marginBottom: 10 }}>
                      <View style={{ paddingHorizontal: 5 }}>
                        <View style={{ marginBottom: 8 }}>
                          <Text style={{ color: applied === "dark" ? "#9ca3af" : "#6b7280", fontSize: 12 }}>Country</Text>
                        </View>

                        <View style={{ paddingHorizontal: 2 }}>
                          <View style={{ paddingVertical: 4 }}>
                            <View style={{ paddingHorizontal: 0 }}>
                              <View style={{ paddingLeft: 0 }}>
                                <View style={{ width: "100%" }}>
                                  <View style={{ paddingVertical: 4 }}>
                                    <View style={{ paddingVertical: 0 }}>
                                      <View style={{ marginBottom: 6 }}>
                                        <View style={{ paddingVertical: 0 }}>
                                          <View>
                                            <View style={{ paddingHorizontal: 0 }}>
                                              <View style={{ paddingVertical: 0 }}>
                                                {/* country picker block preserved exactly as requested */}
                                                <View className="px-5 mt-3">
                                                  <CountryPicker
                                                    countryCode={countryCode}
                                                    withFilter
                                                    withFlag
                                                    withCountryNameButton
                                                    withCallingCode
                                                    withAlphaFilter
                                                    withEmoji
                                                    visible={showCountryPicker}
                                                    onClose={closeCountryPicker}
                                                    onSelect={handleCountrySelect}
                                                    theme={{
                                                      backgroundColor: applied === "dark" ? "#1a1a1a" : "#ffffff", 
                                                      primaryColor: applied === "dark" ? "#FFD700" : "#EAB308", 
                                                      primaryColorVariant: applied === "dark" ? "#EAB308" : "#CA8A04", 
                                                      onBackgroundTextColor: applied === "dark" ? "#f1f1f1" : "#1f1f1f", 
                                                      fontSize: 16,
                                                    }}
                                                  />
                                                </View>
                                                {/* end preserved block */}
                                              </View>
                                            </View>
                                          </View>
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                      <TouchableOpacity
                        className={`flex-row items-center rounded-2xl px-4 py-3`}
                        onPress={openCountryPicker}
                        style={{
                          backgroundColor: applied === "dark" ? "#1b1b1b" : "#fff",
                          borderWidth: applied === "dark" ? 1 : 1,
                          borderColor: applied === "dark" ? "#2a2a2a" : "#e6e6e6",
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                          borderRadius: 14,
                          minWidth: 110,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: applied === "dark" ? "#f8fafc" : "#111827", fontWeight: "700", marginRight: 8 }}>
                          {country ? `+${country.callingCode}` : callingCode}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={applied === "dark" ? "#9ca3af" : "#6b7280"} />
                      </TouchableOpacity>

                      <TextInput
                        value={phoneNo}
                        onChangeText={setPhoneNo}
                        placeholder="Enter phone number"
                        placeholderTextColor={applied === "dark" ? "#9ca3af" : "#9ca3af"}
                        keyboardType="phone-pad"
                        style={{
                          flex: 1,
                          marginLeft: 12,
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                          borderRadius: 14,
                          backgroundColor: applied === "dark" ? "#1b1b1b" : "#fff",
                          borderWidth: 1,
                          borderColor: applied === "dark" ? "#2a2a2a" : "#e6e6e6",
                          color: applied === "dark" ? "#f8fafc" : "#111827",
                          fontWeight: "700",
                          fontSize: 14,
                        }}
                      />
                    </View>
                  </View>

                </View>

                <View style={{ height: 20 }} />

                

                <View style={{ height: 26 }} />

                <Animated.View style={[pulseStyle]}>
                  <TouchableOpacity
                    onPress={handleSaveContact}
                    disabled={isLoading}
                    style={{
                      backgroundColor: isLoading ? (applied === "dark" ? "#9a7a13" : "#facc15") : "#FACC15",
                      borderRadius: 16,
                      paddingVertical: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#FACC15",
                      shadowOpacity: 0.18,
                      shadowRadius: 18,
                      shadowOffset: { width: 0, height: 8 },
                      elevation: 6,
                    }}
                  >
                    {isLoading ? (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <ActivityIndicator color="#000" style={{ marginRight: 10 }} />
                        <Text style={{ color: "#000", fontWeight: "800", fontSize: 16 }}>Saving...</Text>
                      </View>
                    ) : (
                      <Text style={{ color: "#000", fontWeight: "900", fontSize: 16 }}>Save Contact</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 14 }} />

                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: applied === "dark" ? "#9ca3af" : "#6b7280", fontSize: 12, textAlign: "center" }}>
                    Make sure the phone number is correct and includes the country code.
                  </Text>
                </View>

              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </RNSafeAreaView>
  );
}

const styles = StyleSheet.create({
  hidden: { display: "none" },
});
