import { navbar } from "docs-shared";

// region config
export const enNavbarConfig = navbar([
  "/en/get-started/",
  "/en/guide/",
  "/en/config/",
  "/en/faq/",
  "/en/demo/",
  {
    text: "Others",
    icon: "circle-info",
    prefix: "/en/",
    children: [
      {
        text: "Cookbook",
        prefix: "cookbook/",
        children: ["markdown/", "vuepress/"],
      },
      {
        text: "Project",
        children: ["changelog", "related", "contribution"],
      },
    ],
  },
]);
// #endregion config
