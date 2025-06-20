import Story from "@/components/Story";
import { STORIES } from "@/constants/mock-data";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/feed.styles";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import React, { useState } from "react";
import Post from "@/components/Post";
export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const { signOut } = useAuth();
  const posts = useQuery(api.posts.getFeedPost);

  if (posts === undefined) return <Loader />;
  if (posts.length === 0) return <NoPostsFound />;
    // this does nothing
    const onRefresh = () => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    };
  
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ethiogram</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 60}}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesContainer}
        >
          {STORIES.map((story) => (
            <Story key={story.id} story={story} />
          ))}
        </ScrollView>
        {
          posts.map((post) => (
            <Post key={post._id} post={post} />
          ))
        }
      </ScrollView>
    </View>
  );
}
const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);