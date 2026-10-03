import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-docs",
      // GitHub-flavoured markdown so the MDX docs pages can use tables.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } }
    }
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  docs: { defaultName: "Docs" },
  core: { disableTelemetry: true }
};

export default config;
