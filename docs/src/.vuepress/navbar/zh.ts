import { navbar } from "docs-shared";

// region config
export const zhNavbarConfig = navbar([
  "/get-started/",
  "/guide/",
  "/config/",
  "/faq/",
  "/demo/",
  {
    text: "项目",
    icon: "circle-info",
    prefix: "/",
    children: [
      {
        text: "教程",
        icon: "signs-post",
        prefix: "cookbook/",
        children: ["markdown/", "vuepress/"],
      },
      {
        text: "项目",
        children: ["changelog", "related", "contribution"],
      },
    ],
  },
]);
// #endregion config
