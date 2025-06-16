import { useAuth } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/auth.styles";
export default function Index() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={{color:"white"}}>signOut</Text>
      </TouchableOpacity>
    </View>
  );
}
