import "dotenv/config";

export default {
  expo: {
    name: "myPaws",
    slug: "myPaws",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/paws_logo.png",
    scheme: "mypaws",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    android: {
       permissions: [
        "READ_MEDIA_IMAGES",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
      ],
      package: "com.mypaws.mypawsapp",
      adaptiveIcon: {
        backgroundColor: "#3C6627",
        foregroundImage: "./assets/images/paws_logo_empty.png",
        backgroundImage: "./assets/images/paws_logo_empty.png",
        monochromeImage: "./assets/images/paws_logo_empty.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY,
        },
      },
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      "expo-file-system",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/paws_logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
