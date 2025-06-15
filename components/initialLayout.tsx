import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segment = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (!isLoaded) return;
    const inAuthScreen = segment[0] === "(auth)";
    if (!isSignedIn && !inAuthScreen) router.replace("/(auth)/login");
    else if (isSignedIn && inAuthScreen) router.replace("/(tabs)");
  }, [isLoaded, isSignedIn, segment]);

  if (!isLoaded) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}
