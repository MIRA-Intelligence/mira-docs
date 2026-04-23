// @ts-check

const fs = require("fs");
const path = require("path");

function loadDocVariables() {
  const defaults = {
    PROJECT_CORE_NAME: "MIRA",
    PROJECT_UI_NAME: "MiraUI",
    PROJECT_ORG_NAME: "MIRA-Intelligence",
    PROJECT_DOCS_NAME: "MIRA Docs",
  };

  const variablesPath = path.join(__dirname, "docs", "variables.md");
  const raw = fs.readFileSync(variablesPath, "utf8");
  const matches = [...raw.matchAll(/`(PROJECT_[A-Z_]+)\s*=\s*([^`]+)`/g)];

  if (matches.length === 0) {
    return defaults;
  }

  const parsed = {};
  for (const [, key, value] of matches) {
    parsed[key] = value.trim();
  }
  return { ...defaults, ...parsed };
}

function replaceDocVariables(value, variables) {
  return value.replace(/\{\{(PROJECT_[A-Z_]+)\}\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(variables, key)
      ? variables[key]
      : match;
  });
}

const docVariables = loadDocVariables();

const config = {
  title: replaceDocVariables("{{PROJECT_DOCS_NAME}}", docVariables),
  tagline: "Markdown-first docs for core + UI",

  // GitHub Pages Org 主页：https://mira-intelligence.github.io/
  // 源码仍在 mira-docs，构建产物由 CI 跨仓部署到 mira-intelligence.github.io 仓库的 main。
  url: "https://mira-intelligence.github.io",
  baseUrl: "/",
  organizationName: "MIRA-Intelligence",
  projectName: "mira-intelligence.github.io",
  trailingSlash: false,

  // 失败而不是默默把 broken link 改写成 404.html。
  // 之前就因为 warn 模式把"使用文档"全部链接吞成 404 才发现这个坑。
  onBrokenLinks: "throw",
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  themes: [
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // 中英混合索引（"zh" 分词器 + "en")
        language: ["en", "zh"],
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: "/docs",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      }),
    ],
  ],

  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN", "en"],
    localeConfigs: {
      "zh-CN": { label: "简体中文", direction: "ltr", htmlLang: "zh-CN" },
      en: { label: "English", direction: "ltr", htmlLang: "en" },
    },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: ".generated-docs",
          // 文档挂到 /docs，让 / 留给营销首页（src/pages/index.tsx）
          routeBasePath: "/docs",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/MIRA-Intelligence/mira-docs/edit/main/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "light",
        respectPrefersColorScheme: true,
      },
      navbar: {
        // 不设 title：navbar 只显示 logo 图，避免和 logo 自带的 wordmark 重复。
        // 浏览器 tab 标题仍由 siteConfig.title 控制。
        logo: {
          alt: "MIRA logo",
          src: "img/logo.svg",
          srcDark: "img/logo-dark.svg",
        },
        items: [
          { to: "/docs", label: "文档", position: "left" },
          { to: "/docs/usage/start", label: "快速开始", position: "left" },
          { to: "/docs/cli-reference", label: "CLI", position: "left" },
          { to: "/docs/faq/troubleshooting", label: "FAQ", position: "left" },
          {
            href: "https://github.com/MIRA-Intelligence/mira",
            label: "GitHub",
            position: "right",
          },
          {
            type: "localeDropdown",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "文档",
            items: [
              { label: "首页", to: "/docs" },
              { label: "快速开始", to: "/docs/usage/start" },
              { label: "核心概念", to: "/docs/concepts" },
              { label: "CLI 参考", to: "/docs/cli-reference" },
            ],
          },
          {
            title: "项目",
            items: [
              { label: "MIRA 引擎", href: "https://github.com/MIRA-Intelligence/mira" },
              { label: "MiraUI", href: "https://github.com/MIRA-Intelligence/mira-ui" },
              { label: "Docs 仓库", href: "https://github.com/MIRA-Intelligence/mira-docs" },
              { label: "PyPI mira-engine", href: "https://pypi.org/project/mira-engine/" },
            ],
          },
          {
            title: "更多",
            items: [
              { label: "FAQ", to: "/docs/faq/troubleshooting" },
              { label: "部署", to: "/docs/deployment" },
              { label: "Issues", href: "https://github.com/MIRA-Intelligence/mira/issues" },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ${replaceDocVariables("{{PROJECT_ORG_NAME}}", docVariables)}. Built with Docusaurus.`,
      },
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
        options: {
          flowchart: {
            htmlLabels: true,
            useMaxWidth: true,
            curve: "basis",
            padding: 12,
            nodeSpacing: 50,
            rankSpacing: 60,
          },
          sequence: {
            useMaxWidth: true,
            wrap: true,
          },
          themeVariables: {
            fontSize: "14px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", "WenQuanYi Micro Hei", "Helvetica Neue", Helvetica, Arial, sans-serif',
          },
          // 关键：themeCSS 会被 mermaid 内嵌到每个生成的 <svg><style>...</style></svg>，
          // 包括它在 body 上隐藏 append 用来 getBBox() 测宽度的“临时测量 SVG”。
          // 只有这样，测量和渲染才会用同一套 CJK 字体，否则测量用 Latin 字体
          // 算出来的宽度偏小 → 矩形画窄了 → 渲染时 CJK 字宽 → 文字被裁。
          themeCSS: `
            .nodeLabel, .label, .edgeLabel,
            g.label foreignObject div, foreignObject div {
              font-family:
                -apple-system, BlinkMacSystemFont, "Segoe UI",
                "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
                "Noto Sans CJK SC", "Source Han Sans SC", "WenQuanYi Micro Hei",
                "Helvetica Neue", Helvetica, Arial, sans-serif !important;
              font-size: 14px;
            }
            /* foreignObject 默认 overflow:hidden，给一个安全网，
               哪怕外框算窄了也只是溢出而非裁字。 */
            foreignObject { overflow: visible; }
          `,
        },
      },
    }),
};

module.exports = config;
