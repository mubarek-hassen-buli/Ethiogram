import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import OptimizedImage from "./OptimizedImage";
import StoryViewer from "./StoryViewer";
import { Id } from "@/convex/_generated/dataModel";

type User = {
  _id: Id<"users">;
  username: string;
  image: string;
};

export default function Story({ user }: { user: User }) {
  const currentStory = useQuery(api.stories.getCurrentStory, { userId: user._id });
  const hasStory = !!currentStory;
  const [showStoryViewer, setShowStoryViewer] = useState(false);

  const handleStoryPress = () => {
    if (hasStory && currentStory?.imageUrl) {
      setShowStoryViewer(true);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.storyWrapper} onPress={handleStoryPress}>
        <View style={[styles.storyRing, !hasStory && styles.noStory]}>
          <OptimizedImage
            source={user.image}
            style={styles.storyAvatar}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            priority="high"
          />
        </View>
        <Text style={styles.storyUsername}>{user.username}</Text>
      </TouchableOpacity>
      
      {currentStory?.imageUrl && (
        <StoryViewer
          visible={showStoryViewer}
          imageUrl={currentStory.imageUrl}
          onClose={() => setShowStoryViewer(false)}
        />
      )}
    </>
  );
}
