import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import { ToastProvider } from "../src";
import "../src/styles/index.css";
import "./preview.css";

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as "light" | "dark";
  useEffect(() => {
    document.documentElement.setAttribute("data-fp-theme", theme);
  }, [theme]);
  return (
    <ToastProvider>
      <Story />
    </ToastProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Colour theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: { theme: "light" },
  decorators: [withTheme],
  parameters: {
    layout: "padded",
    controls: { expanded: true, sort: "requiredFirst" },
    options: {
      storySort: {
        order: ["Introduction", "Getting started", "Theming", "Examples", "Workflow", "Components"]
      }
    }
  },
  tags: ["autodocs"]
};

export default preview;
