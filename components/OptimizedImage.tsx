import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, ImageContentFit } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface OptimizedImageProps {
  source: string | { uri: string };
  style?: ViewStyle | ViewStyle[];
  contentFit?: ImageContentFit;
  transition?: number;
  cachePolicy?: "memory" | "disk" | "memory-disk" | "none";
  placeholder?: boolean;
  onPress?: () => void;
  priority?: "low" | "normal" | "high";
}

export default function OptimizedImage({
  source,
  style,
  contentFit = "cover",
  transition = 300,
  cachePolicy = "memory-disk",
  placeholder = true,
  onPress,
  priority = "normal",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const imageSource = typeof source === "string" ? { uri: source } : source;

  const ImageComponent = (
    <View style={[styles.container, style]}>
      <Image
        source={imageSource}
        style={[StyleSheet.absoluteFillObject, style] as any}
        contentFit={contentFit}
        transition={transition}
        cachePolicy={cachePolicy}
        priority={priority}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        placeholder={placeholder ? COLORS.surface : undefined}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
      
      {hasError && (
        <View style={styles.errorContainer}>
          <Ionicons name="image-outline" size={24} color={COLORS.grey} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {ImageComponent}
      </TouchableOpacity>
    );
  }

  return ImageComponent;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  placeholder: {
    backgroundColor: COLORS.surface,
  },
});

