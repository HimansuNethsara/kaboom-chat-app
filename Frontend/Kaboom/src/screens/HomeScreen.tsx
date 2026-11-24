import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect, useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { AuthContext } from "../components/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

const SettingsModal = ({
  visible,
  onClose,
  onNavigate,
  onSignOut,
  applied,
}: {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onSignOut: () => void;
  applied: "light" | "dark";
}) => (
  <Modal
    animationType="fade"
    visible={visible}
    transparent={true}
    onRequestClose={onClose}
  >
    <Pressable className="flex-1 bg-black/50" onPress={onClose}>
      <View className="flex-1 justify-start items-end pt-16 pr-5">
        <Pressable
          className="bg-white dark:bg-[#2a2a2a] rounded-xl w-48 shadow-2xl border border-slate-200 dark:border-[#3a3a3a]"
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity
            className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-slate-700"
            onPress={() => onNavigate("SettingScreen")}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={applied === "dark" ? "#FACC15" : "#FACC15"}
            />
            <Text className="text-gray-700 dark:text-slate-200 font-medium ml-3">
              Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-slate-700"
            onPress={() => onNavigate("ProfileScreen")}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={applied === "dark" ? "#FACC15" : "#FACC15"}
            />
            <Text className="text-gray-700 dark:text-slate-200 font-medium ml-3">
              My Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center px-4 py-3"
            onPress={onSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#eab308" />
            <Text className="text-yellow-500 font-semibold ml-3 dark:text-yellow-400">
              Log Out
            </Text>
          </TouchableOpacity>
        </Pressable>
      </View>
    </Pressable>
  </Modal>
);

const ChatListItem = ({
  item,
  onPress,
  applied,
}: {
  item: Chat;
  onPress: () => void;
  applied: "light" | "dark";
}) => (
  <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginHorizontal: 8,
        marginBottom: 8,
        backgroundColor: applied === "dark" ? "#2d2d2d" : "#f2f2f2",
        shadowColor: applied === "dark" ? "#1a1a1a" : "#b0b0b0",
        shadowOpacity: applied === "dark" ? 0.3 : 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
      activeOpacity={0.8}
  >
    <View className="relative">
      <Image
        source={{
          uri:
            item.profileImage ||
            `https://ui-avatars.com/api/?name=${item.friendName.replace(
              " ",
              "+"
            )}&background=random`,
        }}
        className="h-12 w-12 rounded-full"
      />
      {/* <View className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" /> */}
    </View>

    <View className="flex-1 ml-3">
      <View className="flex-row justify-between items-center mb-1">
        <Text
          className="font-semibold text-gray-800 dark:text-slate-100 text-base"
          numberOfLines={1}
        >
          {item.friendName}
        </Text>
        <Text className="text-xs text-gray-500 dark:text-slate-400 font-medium">
          {formatChatTime(item.lastTimeStamp)}
        </Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text
          className="text-gray-600 dark:text-slate-300 text-sm flex-1 mr-2"
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>

        {item.unreadCount > 0 && (
          <View className="bg-yellow-400 min-w-6 h-6 rounded-full justify-center items-center shadow shadow-yellow-500/30">
            <Text className="text-white text-xs font-bold px-1">
              {item.unreadCount > 99 ? "99+" : item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const [search, setSearch] = useState("");
  const chatList = useChatList();
  const [isModalVisible, setModalVisible] = useState(false);
  const auth = useContext(AuthContext);
  const { applied } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
            className={`pt-8 pb-2 px-5 border-b ${
              applied === "dark"
                ? "bg-[#141414] border-[#2a2a2a]"
                : "bg-white border-gray-200"
            }`}
          >
            <View className="flex-row justify-between items-center">
              <Text
                className={`text-3xl font-extrabold tracking-tight ${
                  applied === "dark" ? "text-yellow-400" : "text-yellow-500"
                }`}
              >
                Kaboom
              </Text>

              <TouchableOpacity
                className={`p-3 rounded-full ${
                  applied === "dark" ? "bg-[#2a2a2a]" : "bg-gray-100"
                }`}
                
                onPress={() => setModalVisible(true)}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={22}
                  color={applied === "dark" ? "#facc15" : "#eab308"}
                />
              </TouchableOpacity>
            </View>

            <Text
              className={`mt-1 text-sm ${
                applied === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {chatList.length} conversations
            </Text>
          </View>

      ),
    });
  }, [navigation, chatList.length, applied]);

  const filteredChats = useMemo(() => {
    return [...chatList]
      .filter((chat) => {
        return (
          chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort(
        (a, b) =>
          new Date(b.lastTimeStamp).getTime() -
          new Date(a.lastTimeStamp).getTime()
      );
  }, [chatList, search]);

  const handleChatPress = (item: Chat) => {
    navigation.navigate("SingleChatScreen", {
      chatId: item.friendId,
      friendName: item.friendName,
      lastSeenTime: formatChatTime(item.lastTimeStamp),
      profileImage:
        item.profileImage ||
        `https://ui-avatars.com/api/?name=${item.friendName.replace(
          " ",
          "+"
        )}&background=random`,
    });
  };

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as any);
    setModalVisible(false);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${applied === "dark" ? "bg-[#1f1f1f]" : "bg-gray-50"}`}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor={applied === "dark" ? "#0f172a" : "#ffffff"}
      />

      <View
        className={`px-4 py-3 border-b ${
          applied === "dark"
            ? "bg-[#1f1f1f] border-[#333]" 
            : "bg-gray-50 border-gray-200" 
        }`}
      >
        <View
          className={`flex-row items-center rounded-2xl px-4 py-3 mt-2 ${
            applied === "dark"
              ? "bg-[#2b2b2b] border border-[#444]" 
              : "bg-white border border-yellow-200 shadow-sm"
          }`}
        >
          <Ionicons
            name="search"
            size={20}
            color={applied === "dark" ? "#facc15" : "#eab308"}
          />
          <TextInput
            className={`flex-1 font-medium ml-2 text-base ${
              applied === "dark" ? "text-slate-100" : "text-gray-800"
            }`}
            placeholder="Search chats..."
            placeholderTextColor={applied === "dark" ? "#888" : "#aaa"}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={filteredChats}
        renderItem={({ item }) => (
          <ChatListItem
            item={item}
            onPress={() => handleChatPress(item)}
            applied={applied}
          />
        )}
        // keyExtractor={(item) => item.friendId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, marginTop: 8 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={64}
              color={applied === "dark" ? "#475569" : "#D1D5DB"}
            />
            <Text
              className={`text-lg font-medium mt-4 ${
                applied === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              No conversations found
            </Text>
            <Text
              className={`text-center mt-2 px-8 ${
                applied === "dark" ? "text-slate-500" : "text-gray-400"
              }`}
            >
              {search
                ? "Try adjusting your search terms"
                : "Start a new conversation to get started"}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        className="absolute bottom-6 right-6 h-16 w-16 bg-yellow-400 rounded-2xl justify-center items-center shadow-md shadow-yellow-500/40"
        onPress={() => navigation.navigate("NewChatScreen")}
      >
        <Ionicons name="chatbubbles-outline" size={26} color="black" />
      </TouchableOpacity>


      <SettingsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onNavigate={handleNavigate}
        onSignOut={() => auth?.signOut()}
        applied={applied}
      />
    </SafeAreaView>
  );
}
