// src/theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        // Correct v3 token syntax structure
        bg: {
          DEFAULT: {
            value: {
              _light: "#ffffff", // Default white layout for light mode
              _dark: "#23242a", // YOUR CUSTOM DARK MODE COLOR (Change this to whatever shade you want!)
            },
          },
        },
        text: {
          DEFAULT: {
            value: {
              _light: "#1a1a1a",
              _dark: "#f3f4f6", // Readability text color for dark mode
            },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
