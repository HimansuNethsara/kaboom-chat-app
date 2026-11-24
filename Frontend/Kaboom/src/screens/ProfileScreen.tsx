import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();
  const auth = useContext(AuthContext);

  const [image, setImage] = useState<string | null>(null);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#1f1f1f" : "#fff8dc",
      },
      headerTintColor: applied === "dark" ? "#f8fafc" : "#111827",
      headerTitleStyle: {
        fontWeight: "700",
        fontSize: 20,
      },
    });
  }, [navigation, applied]);

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

  const CARD_BG = applied === "dark" ? "#1a1a1a" : "#fff8dc";
  const CARD_BORDER = applied === "dark" ? "#2a2a2a" : "#e6e6e6";
  const TEXT_COLOR = applied === "dark" ? "#f8fafc" : "#111827";
  const HIGHLIGHT = "#FACC15";

  const saveAvatar = async () => {
    if (selectedAvatar) {
      try {
        await uploadProfileImage(String(auth?.userId || 0), selectedAvatar);
        if (userProfile) {
          userProfile.profileImage =
            `https://747d34fef88d.ngrok-free.app/Kaboom/profile-images/${auth?.userId}/profile1.png`;
        }
        setImage(selectedAvatar);

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Avatar updated successfully!",
        });

      } catch (error) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Failed to update avatar",
        });
        console.log(error);
      } finally {
        setAvatarModalVisible(false);
      }
    }
  };


  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={{
        flex: 1,
        backgroundColor: applied === "dark" ? "#1f1f1f" : "#f8fafc",
      }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Profile Picture */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              borderRadius: 999,
              padding: 4,
              borderWidth: 2,
              borderColor: HIGHLIGHT,
              shadowColor: "#000",
              shadowOpacity: applied === "dark" ? 0.5 : 0.15,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Image
              source={{
                uri:
                  image ||
                  userProfile?.profileImage ||
                  `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${userProfile?.lastName}&background=FFD700&color=111827&bold=true`,
              }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            onPress={() => setAvatarModalVisible(true)}
            style={{
              marginTop: 12,
              backgroundColor: HIGHLIGHT,
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 999,
              shadowColor: "#FACC15",
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text
              style={{
                color: "#111827",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View
          style={{
            backgroundColor: CARD_BG,
            borderRadius: 20,
            padding: 18,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOpacity: applied === "dark" ? 0.3 : 0.1,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            elevation: 6,
            borderWidth: 1,
            borderColor: CARD_BORDER,
          }}
        >
          <Text
            style={{
              color: HIGHLIGHT,
              fontWeight: "900",
              fontSize: 18,
              marginBottom: 8,
            }}
          >
            Personal Info
          </Text>

          {/* Name */}
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Feather
                name="user"
                size={22}
                color={HIGHLIGHT}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: TEXT_COLOR,
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                Full Name
              </Text>
            </View>
            <Text
              style={{
                color: TEXT_COLOR,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>
          </View>

          {/* Bio */}
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Feather
                name="info"
                size={22}
                color={HIGHLIGHT}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: TEXT_COLOR,
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                Bio
              </Text>
            </View>
            <Text
              style={{
                color: TEXT_COLOR,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Hey there! I'm using Kaboom
            </Text>
          </View>

          {/* Phone */}
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Feather
                name="phone"
                size={22}
                color={HIGHLIGHT}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: TEXT_COLOR,
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                Phone Number
              </Text>
            </View>
            <Text
              style={{
                color: TEXT_COLOR,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {userProfile?.countryCode} {userProfile?.contactNo}
            </Text>
          </View>

          {/* Member Since */}
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Feather
                name="calendar"
                size={22}
                color={HIGHLIGHT}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: TEXT_COLOR,
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                Member Since
              </Text>
            </View>
            <Text
              style={{
                color: TEXT_COLOR,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {userProfile?.createdAt
                ? new Date(userProfile.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                : "N/A"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={avatarModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: applied === "dark" ? "#1f1f1f" : "#fff",
              borderRadius: 20,
              padding: 20,
              width: "90%",
              maxHeight: "80%",
            }}
          >
            <Text
              style={{
                color: HIGHLIGHT,
                fontWeight: "900",
                fontSize: 18,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Choose Your Avatar
            </Text>

            <FlatList
              data={avatars}
              numColumns={3}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => {
                const uri = Image.resolveAssetSource(item).uri;
                return (
                  <TouchableOpacity
                    style={{
                      margin: 6,
                      borderWidth: 2,
                      borderColor:
                        selectedAvatar === uri ? "#FACC15" : "#ccc",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                    onPress={() => setSelectedAvatar(uri)}
                  >
                    <Image
                      source={item}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                      }}
                    />
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
            />

            <TouchableOpacity
              style={{
                backgroundColor: HIGHLIGHT,
                marginTop: 20,
                paddingVertical: 10,
                borderRadius: 12,
              }}
              onPress={saveAvatar} 
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                Save Avatar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setAvatarModalVisible(false)}
            >
              <Text style={{ textAlign: "center", color: "gray" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
