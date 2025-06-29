import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import OptimizedImage from "./OptimizedImage";

const { width, height } = Dimensions.get("window");

interface StoryViewerProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function StoryViewer({ visible, imageUrl, onClose }: StoryViewerProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageContainer}>
          <OptimizedImage
            source={imageUrl}
            style={styles.storyImage}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            priority="high"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingTop: StatusBar.currentHeight || 44,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  storyImage: {
    width: width,
    height: height,
  },
});

