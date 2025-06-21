import InitialLayout from "@/components/initialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font"
import { SplashScreen } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);
   // update the native navigation bar on Android.
  //  useEffect(() => {
  //   if (Platform.OS === "android") {
  //     NavigationBar.setBackgroundColorAsync("#000000");
  //     NavigationBar.setButtonStyleAsync("light");
  //   }
  // }, []);
  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        {/* to provide safe area for the app and to provide safe area for the app when it is running on different devices and when we make headerShown false */}
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "black",
          }}
          onLayout={onLayoutRootView}
        >
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
