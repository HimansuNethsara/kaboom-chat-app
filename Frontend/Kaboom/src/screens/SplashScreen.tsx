import { useEffect } from "react";
import { Image, StatusBar, Text, View, ImageBackground } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

type Props = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  const navigation = useNavigation<Props>();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);

  useWebSocketPing(60000); // ping interval

  useEffect(() => {
    
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1.2, { duration: 1500 }, () => {
      scale.value = withTiming(1.25, { duration: 400 }, () => {
        scale.value = withTiming(1, { duration: 1200 }, () => {
          
          scale.value = withRepeat(
            withTiming(1.05, { duration: 800 }),
            -1, 
            true 
          );
        });
      });
    });

    const timer = setTimeout(() => {
    }, 7000); 

    return () => clearTimeout(timer);
  }, [opacity, scale, navigation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const logo = require("../../assets/logo.png");
  const bgImage = require("../../assets/bg-splash.png");

  return (
    <SafeAreaView className="flex-1">
      <StatusBar hidden={true} />

      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        className="flex-1 justify-center items-center"
      >
        {/* Top App Info */}
        <View className="absolute top-10 w-full items-center">
          <Text className="text-xs font-bold text-slate-100 drop-shadow-md">
            POWERED BY: {process.env.EXPO_PUBLIC_APP_OWNER}
          </Text>
          <Text className="text-xs font-bold text-slate-100 drop-shadow-md mt-1">
            VERSION: {process.env.EXPO_PUBLIC_APP_VERSION}
          </Text>
        </View>

        <Animated.View style={animatedStyle} className="mt-[-100]">
          <Image source={logo} className="h-52 w-56" resizeMode="contain" />
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
}
