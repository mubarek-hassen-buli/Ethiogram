import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useQuery } from "convex/react";
import { ScrollView } from "react-native";
import Story from "./Story";

const StoriesSection = () => {
  const users = useQuery(api.users.getAllUsers);
  
  if (!users) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
    >
      {users.map((user) => (
        <Story key={user._id} user={user} />
      ))}
    </ScrollView>
  );
};
export default StoriesSection;