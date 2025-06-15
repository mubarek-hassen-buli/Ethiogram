import { Link } from "expo-router";
import { Text, View } from "react-native";
import { styles } from "../../styles/auth.styles";
export default function Index() {
  return (
    <View style={styles.container}>
      <Text>welcome Too.</Text>
      {/* <Text style={styles.title}>My First mobile app</Text>
      <Text>say</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          alert("Touched");
        }}
      >
        <Text> Click Me</Text>
      </TouchableOpacity>
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.image}
      /> */}
      <Link href={"/profile"}>Profile</Link>
      <Link href={"/notification"}>Notification</Link>
      <Link href={"/bookmarks"}>Bookmarks</Link>
      <Link href={"/create"}>Create</Link>
    </View>
  );
}
