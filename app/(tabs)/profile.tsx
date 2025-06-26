import { Loader } from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { styles } from "@/styles/profile.style";
export default function Profile() {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });
  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const posts = useQuery(api.posts.getPostsByUser, {});

  const updateProfile = useMutation(api.users.updateProfile);
   if (!currentUser || posts === undefined) return <Loader />;
  return (
    <View style={styles.container}>
      <Text>profile screen</Text>
    </View>
  );
}
