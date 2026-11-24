import { AntDesign } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import Animated, { FadeInDown } from "react-native-reanimated";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();
  const logo = require("../../assets/logo.png");
  const bgImage = require("../../assets/bg-splash.png");

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");

  const { userData, setUserData } = useUserRegistration();

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

            {/* Logo */}
            <Animated.View entering={FadeInDown.duration(900).springify()} className="mt-8">
              <Image
                source={logo}
                className="h-48 w-44 mb-2"
                resizeMode="contain"
              />
            </Animated.View>

            {/* Info Text */}
            <View className="w-full mt-3">
              <Text className="font-bold text-gray-300 text-center text-base leading-6 drop-shadow-sm">
                We use your contacts to help you find friends who are already on
                the app. Your contacts stay private.
              </Text>
            </View>

            {/* Inputs */}
            <View className="mt-6 w-full">
              <View className="bg-[#2A2A2A] rounded-xl px-3 py-2 flex-row items-center mb-3 shadow-md shadow-black border-2 border-yellow-500">
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCountryNameButton
                  withCallingCode
                  visible={show}
                  onClose={() => setShow(false)}
                  onSelect={(c) => {
                    setCountryCode(c.cca2);
                    setCountry(c);
                    setShow(false);
                  }}
                  theme={{
                    onBackgroundTextColor: "#FFFFFF",  
                    backgroundColor: "#1F1F1F",  
                    primaryColor: "#FFD700", 
                    filterPlaceholderTextColor: "#FFF",
                  }}
                />
                <AntDesign
                  name="caret-down"
                  size={18}
                  color="white"
                  style={{ marginTop: 5, }}
                />
              </View>

              <View className="mt-2 flex flex-row justify-center">
                <TextInput
                  inputMode="tel"
                  className="h-16 font-bold text-lg w-[18%] bg-[#2A2A2A] text-white rounded-xl text-center px-3 shadow-md shadow-black border-2 border-yellow-500"
                  placeholder="+94"
                  placeholderTextColor="#FFFFFF"
                  editable={false}
                  value={country ? `+${country.callingCode}` : callingCode}
                />

                <TextInput
                  inputMode="tel"
                  className="h-16 font-bold text-lg w-[80%] ml-2 bg-[#2A2A2A] text-white rounded-xl px-3 shadow-md shadow-black border-2 border-yellow-500"
                  placeholder="77 #### ###"
                  placeholderTextColor="#FFFFFF"
                  value={phoneNo}
                  onChangeText={(text) => setPhoneNo(text)}
                />
              </View>
            </View>

            {/* Button */}
            <View className="mt-10 w-full">
              <Pressable
                className="justify-center items-center bg-yellow-500 w-full h-14 rounded-full shadow-md shadow-black"
                onPress={() => {
                  const validCountryCode = validateCountryCode(callingCode);
                  const validPhoneNo = validatePhoneNo(phoneNo);

                  if (validCountryCode) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: validCountryCode,
                    });
                  } else if (validPhoneNo) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: validPhoneNo,
                    });
                  } else {
                    setUserData((previous) => ({
                      ...previous,
                      countryCode: country ? `+${country.callingCode}` : callingCode,
                      contactNo: phoneNo,
                    }));
                    navigation.replace("AvatarScreen");
                  }
                }}
              >
                <Text className="text-black font-bold text-lg">Next</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </AlertNotificationRoot>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
