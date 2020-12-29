import React from "react";
import { StyleSheet } from "react-native";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { FontSizes } from "./components/StyledText";
import Base from "./styles/Base";
import Dark from './styles/Dark';
import Show from "./components/Projection/Show";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor:
        colorScheme === "dark"
          ? Dark.backgroundColor.toString()
          : "white",
      padding: Base.padding,
    },
    text: {
      color: colorScheme === "dark" ? "white" : "black",
      fontSize: FontSizes.base,
    },
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return <Show />;
  }
}
