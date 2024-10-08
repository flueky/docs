import { config, pwaHead, searchProPlugin } from "docs-shared";
import { cut } from "nodejs-jieba";
import { getDirname, path } from "vuepress/utils";

import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);

// The config wrapper is located in <root>/docs-shared/src/config-wrapper.ts
export default config("", {
  head: [
    ...pwaHead,
    [
      "meta",
      {
        name: "google-site-verification",
        content: "qG3soux9jAKB4Q_DYf7yj1p5cEIuib6yG4zDhpmv2_E",
      },
    ],
  ],
  base:"/blog/",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "Flueky's 技术小站",
      // description: "",
    },
    // "/en/": {
    //   lang: "en-US",
    //   title: "vuepress-theme-hope",
    //   description: "A VuePress theme with tons of features✨",
    // },
  },

  theme,

  plugins: [
    searchProPlugin({
      indexContent: true,
      hotReload: true,
      customFields: [
        {
          getter: ({ frontmatter }): string[] => frontmatter["tag"] as string[],
          formatter: `Tag: $content`,
        },
      ],
      indexOptions: {
        tokenize: (text, fieldName) =>
          fieldName === "id" ? [text] : cut(text, true),
      },
    }),
  ],

  pagePatterns: ["**/*.md", "!**/*.snippet.md", "!.vuepress", "!node_modules"],

  alias: {
    "@FlowChartPlayground": path.resolve(
      __dirname,
      "../../../md-enhance/src/.vuepress/components/FlowChartPlayground.js",
    ),
    "@KatexPlayground": path.resolve(
      __dirname,
      "../../../md-enhance/src/.vuepress/components/KatexPlayground.js",
    ),
    "@ToggleRTLButton": path.resolve(
      __dirname,
      "./components/ToggleRTLButton.js",
    ),
  },

  clientConfigFile: path.resolve(__dirname, "./client.ts"),
});
