import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import { useUserRegistration } from "../components/UserContext";
import { validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewAccount } from "../api/UserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import React from "react";

type AvatarScreenProps = NativeStackNavigationProp<RootStack, "AvatarScreen">;

export default function AvatarScreen() {
  const navigation = useNavigation<AvatarScreenProps>();
  const logo = require("../../assets/logo.png");
  const bgImage = require("../../assets/bg-splash.png");

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { userData, setUserData } = useUserRegistration();
  const auth = useContext(AuthContext);

  const avatars = [
    require("../../assets/avatar/avatar_barney.png"),
    require("../../assets/avatar/avatar_bender.png"),
    require("../../assets/avatar/avatar_billy.png"),
    require("../../assets/avatar/avatar_cosmo.png"),
    require("../../assets/avatar/avatar_deedee.png"),
    require("../../assets/avatar/avatar_dexter.png"),
    require("../../assets/avatar/avatar_fred.png"),
    require("../../assets/avatar/avatar_garfield.png"),
    require("../../assets/avatar/avatar_grim.png"),
    require("../../assets/avatar/avatar_jerry.png"),
    require("../../assets/avatar/avatar_loius_g.png"),
    require("../../assets/avatar/avatar_mandy.png"),
    require("../../assets/avatar/avatar_odie.png"),
    require("../../assets/avatar/avatar_peter.png"),
    require("../../assets/avatar/avatar_Philip.png"),
    require("../../assets/avatar/avatar_stewie_g.png"),
    require("../../assets/avatar/avatar_pink_panther.png"),
    require("../../assets/avatar/avatar_Timmy_turner.png"),
    require("../../assets/avatar/avatar_tom.png"),
    require("../../assets/avatar/avatar_vilma.png"),
    require("../../assets/avatar/avatar_wanda.png"),
    require("../../assets/avatar/avatar_woody.png"),
  ];

  // Animated pulse effect for button
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Start button animation once (avoids "writing during render" warning)
  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.9, { duration: 800 })
      ),
      -1,
      true
    );
  }, [scale, opacity]);

  return (
    <ImageBackground
      source={bgImage}
      resizeMode="cover"
      className="flex-1 bg-black"
    >
      <SafeAreaView className="flex-1 items-center px-6">
        <StatusBar hidden={true} />

        {/* Logo */}
        <View className="mt-10">
          <Image source={logo} className="h-48 w-44 mb-2" resizeMode="contain" />
        </View>

        {/* Title */}
        <Text className="font-bold text-xl text-gray-100 mt-2">
          Choose a Profile Avatar
        </Text>

        {/* Avatar preview circle */}
        <View className="items-center mt-5 h-72 justify-center">
          <View
            className="h-[100] w-[100] rounded-full bg-[#1F1F1F] justify-center items-center border-2 border-yellow-500 shadow-md shadow-black"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                className="h-[100] w-[100] rounded-full"
              />
            ) : (
              <Text className="font-bold text-lg text-gray-400">
                No Avatar
              </Text>
            )}
          </View>

          <Text className="text-lg my-3 text-gray-300 font-bold">
            Tap an avatar below
          </Text>

          {/* Avatar selection list */}
          <FlatList
            data={avatars}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  const uri = Image.resolveAssetSource(item).uri;
                  setImage(uri);
                  setUserData((previous) => ({
                    ...previous,
                    profileImage: uri,
                  }));
                }}
              >
                <Image
                  source={item}
                  className={`h-20 w-20 rounded-full mx-2 border-2 ${
                    image === Image.resolveAssetSource(item).uri
                      ? "border-yellow-400"
                      : "border-gray-300"
                  }`}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Button */}
        <Animated.View style={animatedButtonStyle} className="mt-5 w-full">
          <Pressable
            disabled={loading}
            className="h-14 bg-yellow-500 items-center justify-center rounded-full shadow-md shadow-black"
            onPress={async () => {
              const validProfile = validateProfileImage(userData.profileImage);
              if (validProfile) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: "Please select an avatar to continue",
                });
              } else {
                try {
                  setLoading(true);
                  const response = await createNewAccount(userData);
                  if (response.status) {
                    const id = response.userId;
                    if (auth) {
                      await auth.signUp(String(id));
                      // navigation.replace("HomeScreen");
                    }
                  } else {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: response.message,
                    });
                  }
                } catch (error) {
                  console.log(error);
                } finally {
                  setLoading(false);
                }
              }
            }}
          >
            {loading ? (
              <ActivityIndicator size={"large"} color={"black"} />
            ) : (
              <Text className="font-bold text-lg text-black">Choose Avatar</Text>
            )}
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}
