import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useLayoutEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";
import { useTheme } from "../theme/ThemeProvider";

type SingleChatScreenProps = NativeStackScreenProps<
  RootStack,
  "SingleChatScreen"
>;

export default function SingleChatScreen({
  route,
  navigation,
}: SingleChatScreenProps) {
  const { chatId, friendName, profileImage } = route.params;
  const singleChat = useSingleChat(chatId);
  const messages = singleChat.messages;
  const friend = singleChat.friend;
  const sendMessage = useSendChat();
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const inputHeight = useRef(new Animated.Value(56)).current;
  const { applied } = useTheme();

  const bgColor = applied === "dark" ? "#0f1115" : "#f9f8f6";
  const cardBg = applied === "dark" ? "#1f1f23" : "#fffaf0";
  const textPrimary = applied === "dark" ? "#facc15" : "#7b4f1d";
  const textSecondary = applied === "dark" ? "#cbd5e1" : "#5c4b3e";
  const bubbleSent = applied === "dark" ? "#fde68a" : "#fcd34d";
  const bubbleReceived = applied === "dark" ? "#2c2c2f" : "#f4ebe1";
  const placeholderColor = applied === "dark" ? "#94a3b8" : "#a78b5b";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: bgColor },
      headerTintColor: applied === "dark" ? "#f8fafc" : "#3c3b37",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={applied === "dark" ? "#f8fafc" : "#3c3b37"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: profileImage }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />
              {friend?.status === "ONLINE" && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    backgroundColor: "#22c55e",
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: applied === "dark" ? "#1f1f23" : "#f9f8f6",
                  }}
                />
              )}
            </View>
            <View>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: applied === "dark" ? "#f8fafc" : "#1c1b19",
                }}
              >
                {friend ? `${friend.firstName} ${friend.lastName}` : friendName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: applied === "dark" ? "#94a3b8" : "#5c4b3e",
                }}
              >
                {friend?.status === "ONLINE"
                  ? "Online"
                  : `Last seen ${formatChatTime(friend?.updatedAt ?? "")}`}
              </Text>
            </View>
          </View>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ padding: 6 }}>
          <Ionicons
            name="ellipsis-vertical"
            size={22}
            color={applied === "dark" ? "#f8fafc" : "#3c3b37"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, friend, applied]);

  const animateInputHeight = (toValue: number) => {
    Animated.timing(inputHeight, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleContentSizeChange = (e: any) => {
    const height = Math.min(Math.max(e.nativeEvent.contentSize.height, 56), 120);
    animateInputHeight(height);
  };

  const renderItem = ({ item, index }: { item: Chat; index: number }) => {
    const isMe = item.from.id !== chatId;
    const showDate = shouldShowDate(messages, index);

    return (
      <View style={{ marginBottom: 4 }}>
        {showDate && (
          <View style={{ alignItems: "center", marginVertical: 6 }}>
            <Text
              style={{
                fontSize: 10,
                color: applied === "dark" ? "#94a3b8" : "#6b4b3a",
                backgroundColor: applied === "dark" ? "#2c2c2f" : "#f4ebe1",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              {formatChatDate(item.createdAt)}
            </Text>
          </View>
        )}
        <View
          style={{
            alignSelf: isMe ? "flex-end" : "flex-start",
            maxWidth: "75%",
            backgroundColor: isMe ? bubbleSent : bubbleReceived,
            borderTopLeftRadius: isMe ? 18 : 6,
            borderTopRightRadius: isMe ? 6 : 18,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginVertical: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: isMe ? "#1c1b19" : applied === "dark" ? "#f8fafc" : "#3c2f2f",
            }}
          >
            {item.message}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: applied === "dark" ? "#94a3b8" : "#5c4b3e",
              marginTop: 4,
              alignSelf: "flex-end",
            }}
          >
            {formatChatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const shouldShowDate = (messages: Chat[], index: number) => {
    if (index === messages.length - 1) return true;
    const currentDate = new Date(messages[index].createdAt).toDateString();
    const nextDate = new Date(messages[index + 1].createdAt).toDateString();
    return currentDate !== nextDate;
  };

  const formatChatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    else if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    else
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
  };

  const handleSendChat = () => {
    if (!input.trim()) return;
    sendMessage(chatId, input.trim());
    setInput("");
    animateInputHeight(56);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={["right", "bottom", "left"]}>
      <StatusBar barStyle={applied === "dark" ? "light-content" : "dark-content"} backgroundColor={bgColor} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? "height" : "padding"}
        keyboardVerticalOffset={Platform.OS === "android" ? 0 : 50}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          inverted
          keyExtractor={(item, index) => `${item.id}_${index}`}
          contentContainerStyle={{ paddingVertical: 14, paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />

        <View
          style={{
            borderTopWidth: 1,
            borderColor: applied === "dark" ? "#374151" : "#d6c4a0",
            paddingVertical: 10,
            paddingHorizontal: 14,
            backgroundColor: applied === "dark" ? "#1f1f23" : "#fffaf0",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <TouchableOpacity style={{ padding: 4 }}>
              <Ionicons name="add-circle-outline" size={28} color={placeholderColor} />
            </TouchableOpacity>

            <TextInput
              value={input}
              onChangeText={setInput}
              onContentSizeChange={handleContentSizeChange}
              multiline
              placeholder="Type a message..."
              placeholderTextColor={placeholderColor}
              style={{
                flex: 1,
                marginHorizontal: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 24,
                backgroundColor: applied === "dark" ? "#2c2c2f" : "#f4ebe1",
                color: applied === "dark" ? "#f8fafc" : "#3c2f2f",
                maxHeight: 120,
                fontSize: 16,
              }}
            />

            {input.trim() ? (
              <TouchableOpacity
                onPress={handleSendChat}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: textPrimary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={applied === "dark" ? "#1f1f23" : "#fffaf0"}
                />
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: "row", marginLeft: 4 }}>
                <TouchableOpacity style={{ padding: 4 }}>
                  <Ionicons name="camera-outline" size={24} color={placeholderColor} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 4 }}>
                  <Ionicons name="mic-outline" size={24} color={placeholderColor} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
