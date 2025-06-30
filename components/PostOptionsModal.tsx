import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React from "react";
import {
  Alert,
  Clipboard,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface PostOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  imageUrl: string;
  caption?: string;
  authorUsername: string;
}

export default function PostOptionsModal({
  visible,
  onClose,
  postId,
  imageUrl,
  caption,
  authorUsername,
}: PostOptionsModalProps) {
  const createReport = useMutation(api.reports.createReport);
  const handleCopyLink = async () => {
    try {
      const postLink = `https://ethiogram.app/post/${postId}`;
      Clipboard.setString(postLink);
      Alert.alert("Link copied", "Post link has been copied to clipboard");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to copy link");
    }
  };

  const handleCopyEmbedCode = async () => {
    try {
      const embedCode = `<blockquote class="ethiogram-post" data-post-id="${postId}">
  <img src="${imageUrl}" alt="Post by ${authorUsername}" />
  <p>${caption || ""}</p>
  <p>— @${authorUsername} on Ethiogram</p>
</blockquote>
<script async src="https://ethiogram.app/embed.js"></script>`;
      
      Clipboard.setString(embedCode);
      Alert.alert("Embed code copied", "Embed code has been copied to clipboard");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to copy embed code");
    }
  };

  const handleDownload = async () => {
    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Please grant media library permissions to download images.",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Copy URL", 
              onPress: () => {
                Clipboard.setString(imageUrl);
                Alert.alert(
                  "Image URL copied", 
                  "Image URL has been copied to clipboard. You can paste it in your browser to download the image."
                );
              }
            }
          ]
        );
        onClose();
        return;
      }

      // Show loading state
      Alert.alert("Downloading...", "Please wait while we download the image.");

      // Download the image to a temporary location
      const fileUri = FileSystem.documentDirectory + `ethiogram_post_${postId}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadResult.status === 200) {
        // Save to media library
        const asset = await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        
        Alert.alert(
          "Download Complete",
          "Image has been saved to your photo gallery!"
        );
        
        // Clean up temporary file
        await FileSystem.deleteAsync(downloadResult.uri, { idempotent: true });
      } else {
        throw new Error("Download failed");
      }
      
      onClose();
    } catch (error) {
      console.error("Download error:", error);
      
      // Fallback to copying URL
      Alert.alert(
        "Download Failed",
        "Unable to download image. Would you like to copy the image URL instead?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Copy URL", 
            onPress: () => {
              Clipboard.setString(imageUrl);
              Alert.alert(
                "Image URL copied", 
                "Image URL has been copied to clipboard. You can paste it in your browser to download the image."
              );
            }
          }
        ]
      );
      onClose();
    }
  };

  const handleShare = async () => {
    try {
      const postLink = `https://ethiogram.app/post/${postId}`;
      const shareMessage = `Check out this post by @${authorUsername} on Ethiogram`;
      
      const result = await Share.share({
        message: shareMessage,
        url: postLink,
        title: "Share Ethiogram Post",
      });
      
      onClose();
    } catch (error) {
      // Fallback to copying link
      Clipboard.setString(`https://ethiogram.app/post/${postId}`);
      Alert.alert("Link copied", "Post link has been copied to clipboard");
      onClose();
    }
  };

  const handleReport = () => {
    Alert.alert(
      "Report Post",
      "Why are you reporting this post?",
      [
        { text: "Spam", onPress: () => submitReport("spam") },
        { text: "Inappropriate content", onPress: () => submitReport("inappropriate") },
        { text: "Harassment", onPress: () => submitReport("harassment") },
        { text: "False information", onPress: () => submitReport("false_info") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const submitReport = async (reason: string) => {
    try {
      await createReport({
        postId: postId as any, // Type assertion for Convex ID
        reason: reason as "spam" | "inappropriate" | "harassment" | "false_info" | "other",
      });
      
      Alert.alert(
        "Report submitted", 
        "Thank you for your report. We'll review it shortly."
      );
    } catch (error) {
      console.error("Report submission error:", error);
      
      if (error instanceof Error && error.message.includes("already reported")) {
        Alert.alert(
          "Already reported", 
          "You have already reported this post."
        );
      } else {
        Alert.alert(
          "Error", 
          "Failed to submit report. Please try again later."
        );
      }
    }
    
    onClose();
  };

  const handleNotInterested = () => {
    Alert.alert("Not interested", "We'll show you fewer posts like this");
    onClose();
  };

  const options = [
    {
      icon: "download-outline" as const,
      text: "Download",
      onPress: handleDownload,
    },
    {
      icon: "share-outline" as const,
      text: "Share",
      onPress: handleShare,
    },
    {
      icon: "link-outline" as const,
      text: "Copy link",
      onPress: handleCopyLink,
    },
    {
      icon: "code-outline" as const,
      text: "Copy embed code",
      onPress: handleCopyEmbedCode,
    },
    {
      icon: "eye-off-outline" as const,
      text: "Not interested",
      onPress: handleNotInterested,
    },
    {
      icon: "flag-outline" as const,
      text: "Report",
      onPress: handleReport,
      destructive: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.handle} />
          </View>
          
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={option.destructive ? COLORS.primary : COLORS.white}
              />
              <Text
                style={[
                  styles.optionText,
                  option.destructive && styles.destructiveText,
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={[styles.option, styles.cancelOption]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.grey,
    borderRadius: 2,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.background,
  },
  optionText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 16,
    fontWeight: "500",
  },
  destructiveText: {
    color: COLORS.primary,
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: 8,
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  cancelText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

