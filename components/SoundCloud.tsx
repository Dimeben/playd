import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import WebView from "react-native-webview";

const SoundCloud = ({ Username }) => {
  const iframeString = `<body style="display:flex; flex-direction: column;justify-content: center; 
      align-items:center; ßbackground-color: black; color:white; height: 100%;">
        <h2>
          This text will be changed later!
        </h2>
     </body>`;
  return (
    <View style={styles.container}>
      <WebView
        source={{ html: iframeString }}
        scalesPageToFit={true}
        bounces={false}
        javaScriptEnabled
        style={styles.container}
        startInLoadingState={true}
      />
    </View>
  );
};

export default SoundCloud;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

{
  /* <iframe
allowtransparency="true"
scrolling="no"
frameborder="no"
src="https://w.soundcloud.com/icon/?url=http%3A%2F%2Fsoundcloud.com%2Fmultunes&color=orange_white&size=32"
style="width: 32px; height: 32px;"
></iframe> */
}
