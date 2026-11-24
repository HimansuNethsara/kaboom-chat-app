import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";
import { useTheme } from "../theme/ThemeProvider";

type NewChatScreenProp = NativeStackNavigationProp<RootStack, "NewChatScreen">;

const UserListItem = ({
  user,
  onPress,
  applied,
}: {
  user: User;
  onPress: () => void;
  applied: "light" | "dark";
}) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  const profileImage =
    user.profileImage ||
    `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;

  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 rounded-xl mx-4 my-1 active:opacity-80"
      style={{
        backgroundColor: applied === "dark" ? "#2a2a2a" : "#fdfdfd",
        shadowColor: applied === "dark" ? "#000" : "#ccc",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
      }}
      onPress={onPress}
    >
      <View className="relative">
        <Image
          source={{ uri: profileImage }}
          className="h-12 w-12 rounded-full"
        />
        <View
          className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-white dark:border-slate-800 rounded-full ${
            user.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </View>

      <View className="flex-1 ml-3">
        <Text
          className={`font-semibold text-base mb-1 ${
            applied === "dark" ? "text-slate-100" : "text-gray-900"
          }`}
        >
          {fullName}
        </Text>
        <Text
          className={`text-sm ${
            applied === "dark" ? "text-slate-400" : "text-gray-500"
          }`}
          numberOfLines={1}
        >
          {user.status === "ACTIVE"
            ? "Already in your contacts"
            : "Hey there! I'm using ChatApp"}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={applied === "dark" ? "#facc15" : "#eab308"}
      />
    </TouchableOpacity>
  );
};

export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenProp>();
  const [search, setSearch] = useState("");
  const users = useUserList();
  const { applied } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: applied === "dark" ? "#1f1f1f" : "#fefefe",
      },
      headerTintColor: applied === "dark" ? "#facc15" : "#eab308",
      headerLeft: () => (
        <View className="flex-row items-center">
          <TouchableOpacity
            className="p-2 mr-2"
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={applied === "dark" ? "#facc15" : "#eab308"}
            />
          </TouchableOpacity>
          <View className="flex-col">
            <Text
              className={`text-xl font-bold ${
                applied === "dark" ? "text-slate-100" : "text-gray-900"
              }`}
            >
              New Chat
            </Text>
            <Text
              className={`text-sm ${
                applied === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {users.length} contacts available
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity className="p-2">
          <Ionicons
            name="qr-code"
            size={22}
            color={applied === "dark" ? "#facc15" : "#eab308"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, users.length, applied]);

  const filteredUsers = useMemo(() => {
    return [...users]
      .filter((user) => {
        const searchTerm = search.toLowerCase();
        return (
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.contactNo.includes(search)
        );
      })
      .sort((a, b) => a.firstName.localeCompare(b.firstName));
  }, [users, search]);

  const handleUserPress = (user: User) => {
    navigation.replace("SingleChatScreen", {
      chatId: user.id,
      friendName: `${user.firstName} ${user.lastName}`,
      lastSeenTime: user.updatedAt,
      profileImage:
        user.profileImage ||
        `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
    });
  };

  const handleNewContact = () => {
    navigation.navigate("NewContactScreen");
  };

  return (
    <SafeAreaView
      className={`flex-1`}
      style={{
        backgroundColor: applied === "dark" ? "#1f1f1f" : "#f3f4f6", // set to matching gray
      }}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor={applied === "dark" ? "#1f1f1f" : "#fefefe"}
      />

      {/* Search Bar */}
      <View
        className="mx-4 my-3 rounded-xl flex-row items-center px-4 py-2"
        style={{
          backgroundColor: applied === "dark" ? "#2b2b2b" : "#f5f5f5",
          shadowColor: applied === "dark" ? "#000" : "#ccc",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5,
          elevation: 2,
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={applied === "dark" ? "#facc15" : "#eab308"}
        />
        <TextInput
          className={`flex-1 ml-2 text-base font-medium ${
            applied === "dark" ? "text-slate-100" : "text-gray-800"
          }`}
          placeholder="Search contacts..."
          placeholderTextColor={applied === "dark" ? "#94a3b8" : "#9CA3AF"}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* New Contact Card */}
      <TouchableOpacity
        className="mx-4 my-2 rounded-xl flex-row items-center px-4 py-4 active:opacity-80"
        style={{
          backgroundColor: applied === "dark" ? "#2a2a2a" : "#ffffff",
          shadowColor: applied === "dark" ? "#000" : "#ccc",
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 6,
          elevation: 3,
        }}
        onPress={handleNewContact}
      >
        <View
          className="w-12 h-12 rounded-full justify-center items-center mr-3"
          style={{
            backgroundColor: applied === "dark" ? "#facc15" : "#eab308",
          }}
        >
          <Feather name="user-plus" size={20} color="#1f1f1f" />
        </View>
        <View className="flex-1">
          <Text
            className={`font-semibold text-base ${
              applied === "dark" ? "text-slate-100" : "text-gray-900"
            }`}
          >
            New Contact
          </Text>
          <Text
            className={`text-sm mt-1 ${
              applied === "dark" ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Add someone to your contacts
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={applied === "dark" ? "#facc15" : "#eab308"}
        />
      </TouchableOpacity>

      {/* Contact List */}
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
          <UserListItem
            user={item}
            onPress={() => handleUserPress(item)}
            applied={applied}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <Text
            className={`mx-4 mt-4 mb-2 font-medium text-sm ${
              applied === "dark" ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Contacts ({filteredUsers.length})
          </Text>
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-16 px-8">
            <Ionicons
              name="people-outline"
              size={64}
              color={applied === "dark" ? "#475569" : "#D1D5DB"}
            />
            <Text
              className={`text-lg font-medium mt-4 text-center ${
                applied === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {search ? "No contacts found" : "No contacts available"}
            </Text>
            <Text
              className={`text-center mt-2 ${
                applied === "dark" ? "text-slate-500" : "text-gray-400"
              }`}
            >
              {search
                ? "Try adjusting your search terms"
                : "Add new contacts to start chatting"}
            </Text>
            {!search && (
              <TouchableOpacity
                className="rounded-full px-6 py-3 mt-4"
                style={{
                  backgroundColor: applied === "dark" ? "#facc15" : "#eab308",
                }}
                onPress={handleNewContact}
              >
                <Text
                  className="text-base font-semibold text-black text-center"
                >
                  Add Contact
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
