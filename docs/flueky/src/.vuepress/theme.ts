import { theme } from "docs-shared";
import { getDirname, path } from "vuepress/utils";
import { AVAILABLE_SERVICES } from "vuepress-plugin-components";
import { getRecentUpdatedArticles } from "vuepress-theme-hope/presets/getRecentUpdatedArticles.js";
import { getSlides } from "vuepress-theme-hope/presets/getSlides.js";

import { enNavbarConfig, zhNavbarConfig } from "./navbar/index.js";
import { enSidebarConfig, zhSidebarConfig } from "./sidebar/index.js";

const __dirname = getDirname(import.meta.url);

// The theme wrapper is located in <root>/docs-shared/src/theme-wrapper.ts
export default theme(
  "flueky",
  {
    repo: "flueky/docs",
    // favicon: "/assets/image/qbl-01.png",
    logo: "https://flueky.github.io/pic/img/qbl-02.png",
    blog: {
      name: "Flueky's tech site",
      avatar: "https://flueky.github.io/pic/img/qbl-01.png",
      medias: {
        // Baidu: "https://example.com",
        // BiliBili: "https://example.com",
        // Bitbucket: "https://example.com",
        // Dingding: "https://example.com",
        // Discord: "https://example.com",
        // Dribbble: "https://example.com",
        // Email: "mailto:info@example.com",
        // Evernote: "https://example.com",
        // Facebook: "https://example.com",
        // Flipboard: "https://example.com",
        // Gitee: "https://example.com",
        // GitHub: "https://example.com",
        // Gitlab: "https://example.com",
        // Gmail: "mailto:info@example.com",
        // Instagram: "https://example.com",
        // Lark: "https://example.com",
        // Lines: "https://example.com",
        // Linkedin: "https://example.com",
        // Pinterest: "https://example.com",
        // Pocket: "https://example.com",
        // QQ: "https://example.com",
        // Qzone: "https://example.com",
        // Reddit: "https://example.com",
        // Rss: "https://example.com",
        // Steam: "https://example.com",
        // Twitter: "https://example.com",
        // Wechat: "https://example.com",
        // Weibo: "https://example.com",
        // Whatsapp: "https://example.com",
        // Youtube: "https://example.com",
        // Zhihu: "https://example.com",
      },
    },

    author: {
      name: "Flueky Zuo",
      url: "https://flueky.github.io/blog/",
      email: "flueky.zuo@gmail.com"
    },

    fullscreen: true,
    copyright: "Copyright © 2014-2024 by Flueky Zuo | Vuepress theme hope",
    navbarTitle: "Flueky 技术小站",

    // extraLocales: {
    //   Русский: "https://theme-hope-ru.vuejs.press/:route",
    // },

    locales: {
      "/": {
        navbar: zhNavbarConfig,
        sidebar: zhSidebarConfig,
        blogLocales: {
          timelineTitle: "不积跬步无以至千里"
        }
      },
      "/en/": {
        navbar: enNavbarConfig,
        sidebar: enSidebarConfig,
      },
    },

    encrypt: {
      config: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "/en/demo/encrypt.html": "1234",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "/demo/encrypt.html": "1234",
      },
    },
    docsRepo: "https://github.com/flueky/docs",
    docsBranch: "flueky-2.0.0",
    plugins: {
      blog: {
        excerptLength: 0,
        type: [
          getRecentUpdatedArticles({
            locales: { "/en/": "Recent Updated", "/": "最近更新" },
          }),
          getSlides({
            locales: { "/en/": "Slides", "/": "幻灯片" },
          }),
        ],
      },

      git: true,

      comment: {
        provider: "Giscus",
        repo: "flueky/giscus-discussion",
        repoId: "R_kgDONA8bwQ",
        category: "Q&A",
        categoryId: "DIC_kwDONA8bwc4CjZtc",
        reactionsEnabled: true
      },

      components: {
        components: [
          "ArtPlayer",
          "Badge",
          "BiliBili",
          "CodePen",
          "PDF",
          "Share",
          "SiteInfo",
          "StackBlitz",
          "VPBanner",
          "VPCard",
          "VidStack",
        ],

        componentOptions: {
          share: {
            services: AVAILABLE_SERVICES,
          },
        },
      },

      copyright: {
        license: "MIT",
      },

      feed: {
        atom: true,
        json: true,
        rss: true,
      },

      markdownHint: {
        alert: true,
      },

      markdownImage: {
        figure: true,
        lazyload: true,
        mark: true,
        size: true,
      },

      markdownMath: true,

      markdownTab: true,

      mdEnhance: {
        align: true,
        attrs: true,
        chart: true,
        component: true,
        demo: true,
        echarts: true,
        flowchart: true,
        gfm: true,
        include: {
          deep: true,
          resolvePath: (file) => {
            if (file.startsWith("@components/"))
              return file.replace(
                "@components",
                path.resolve(__dirname, "../../../components/src"),
              );

            if (file.startsWith("@echarts/"))
              return file.replace(
                "@echarts",
                path.resolve(__dirname, "../../../md-enhance/src/echarts"),
              );

            if (file.startsWith("@md-enhance/"))
              return file.replace(
                "@md-enhance",
                path.resolve(__dirname, "../../../md-enhance/src"),
              );

            return file;
          },
          resolveLinkPath: false,
        },
        kotlinPlayground: true,
        mark: true,
        markmap: true,
        mermaid: true,
        plantuml: true,
        playground: {
          presets: ["ts", "vue", "unocss"],
        },
        sandpack: true,
        spoiler: true,
        stylize: [
          {
            matcher: "Recommended",
            replacer: ({
              tag,
            }): {
              tag: string;
              attrs: Record<string, string>;
              content: string;
            } | void => {
              if (tag === "em")
                return {
                  tag: "Badge",
                  attrs: { type: "tip" },
                  content: "Recommended",
                };
            },
          },
        ],
        sub: true,
        sup: true,
        tasklist: true,
        vPre: true,
        vuePlayground: true,
      },
      notice: [
        // {
        //   path: "/",
        //   title: "Notice Title",
        //   content: "Notice Content",
        //   actions: [
        //     {
        //       text: "Primary Action",
        //       link: "https://theme-hope.vuejs.press/",
        //       type: "primary",
        //     },
        //     { text: "Default Action" },
        //   ],
        // },
      ],
      revealjs: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
        themes: [
          "auto",
          "beige",
          "black",
          "blood",
          "league",
          "moon",
          "night",
          "serif",
          "simple",
          "sky",
          "solarized",
          "white",
        ],
      },

      shiki: {
        lineNumbers: 15,
        notationDiff: true,
        themes: {
          light: "one-light",
          dark: "one-dark-pro",
        },
      },

      watermark: {
        enabled: false,
      },
    },
  },
  "",
  "theme-v2",
);
