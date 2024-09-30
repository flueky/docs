import { sidebar } from "docs-shared";

// region config
export const enSidebarConfig = sidebar({
  "/en/": [
    "",
    "blog-home",
    "custom-blog-home",
    "get-started/",
    {
      text: "Guide",
      icon: "lightbulb",
      prefix: "guide/",
      children: [
        "intro/",
        "interface/",
        "layout/",
        "markdown/",
        "feature/",
        "blog/",
        "customize/",
        "advanced/",
      ],
    },
    {
      text: "Config",
      icon: "gears",
      prefix: "config/",
      children: [
        "intro",
        "i18n",
        "theme/",
        "plugins/",
        "frontmatter/",
        "style",
      ],
    },
    {
      text: "Cookbook",
      icon: "signs-post",
      prefix: "cookbook/",
      children: ["markdown/", "vuepress/"],
    },

    "demo/",
    "faq/",
    "changelog",
    "contribution",
  ],

  "/en/get-started/": "structure",

  "/en/guide/": "structure",

  "/en/config/": "structure",

  "/en/cookbook/": "structure",

  "/en/demo/": "structure",

  "/en/faq/": "structure",
});
// #endregion config
