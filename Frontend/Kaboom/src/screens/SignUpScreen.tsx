import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import { validateFirstName, validateLastName } from "../util/Validation";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

type SignUpProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpProps>();
  const { applied } = useTheme();
  const logo = require("../../assets/logo.png");
  const bgImage = require("../../assets/bg-splash.png");

  const { userData, setUserData } = useUserRegistration();

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 6, stiffness: 120 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 6, stiffness: 120 });
  };

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.05, { duration: 1600 }),
      -1, 
      true 
    );
  }, []);
    
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <ImageBackground
      source={bgImage}
      resizeMode="cover"
      className="flex-1 bg-black"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 100 : 100}
        className="flex-1"
      >
        <AlertNotificationRoot>
          <SafeAreaView className="flex-1 items-center px-6">
            <StatusBar hidden={true} />

            <Animated.View
              entering={FadeInDown.duration(900).springify()}
              className="mt-8"
            >
              <Image
                source={logo}
                className="h-56 w-52 mb-[-10]"
                resizeMode="contain"
              />
            </Animated.View>

            <View className="w-full mt-3">
              <Text className="font-bold text-gray-300 text-center text-base leading-6 drop-shadow-sm">
                Create your account and start the conversation{" "}
                <Text className="text-yellow-400">TODAY!</Text>
              </Text>
            </View>

            <View className="w-full mt-3">
              <View className="my-2">
                <FloatingLabelInput
                  label={"Enter Your First Name"}
                  value={userData.firstName}
                  onChangeText={(text) => {
                    setUserData((previous) => ({
                      ...previous,
                      firstName: text,
                    }));
                  }}
                  containerStyles={{
                    backgroundColor: "#1F1F1F",
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    height: 58,
                    justifyContent: "center",
                  }}
                  inputStyles={{
                    color: "#F9FAFB",
                    fontSize: 16,
                    paddingVertical: 10,
                  }}
                  customLabelStyles={{
                    colorFocused: "#FFD700",
                    colorBlurred: "#9CA3AF",
                    fontSizeFocused: 12,
                    fontSizeBlurred: 14,
                  }}
                />
              </View>

              <View className="my-2">
                <FloatingLabelInput
                  label={"Enter Your Last Name"}
                  value={userData.lastName}
                  onChangeText={(text) => {
                    setUserData((previous) => ({
                      ...previous,
                      lastName: text,
                    }));
                  }}
                  containerStyles={{
                    backgroundColor: "#1F1F1F",
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    height: 58, 
                    justifyContent: "center",
                  }}
                  inputStyles={{
                    color: "#F9FAFB",
                    fontSize: 16, 
                    paddingVertical: 10, 
                  }}
                  customLabelStyles={{
                    colorFocused: "#FFD700",
                    colorBlurred: "#9CA3AF",
                    fontSizeFocused: 12,
                    fontSizeBlurred: 14,
                  }}
                />
              </View>
            </View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(900).springify()}
              className="w-full mt-3 mb-8"
            >
              <Animated.View style={animatedButtonStyle}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  className="bg-yellow-500 h-14 justify-center items-center rounded-full shadow-md shadow-black"
                  onPress={() => {
                    const validFirstName = validateFirstName(userData.firstName);
                    const validLastName = validateLastName(userData.lastName);

                    if (validFirstName) {
                      Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: "Warning",
                        textBody: validFirstName,
                      });
                    } else if (validLastName) {
                      Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: "Warning",
                        textBody: validLastName,
                      });
                    } else {
                      navigation.navigate("ContactScreen");
                    }
                  }}
                >
                  <Text className="text-black font-bold text-lg">Next</Text>
                </Pressable>
              </Animated.View>
            </Animated.View>
          </SafeAreaView>
        </AlertNotificationRoot>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
