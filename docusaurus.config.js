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

  // GitHub Pages 项目站点：https://mira-intelligence.github.io/mira-docs/
  url: "https://mira-intelligence.github.io",
  baseUrl: "/mira-docs/",
  organizationName: "MIRA-Intelligence",
  projectName: "mira-docs",
  trailingSlash: false,
  deploymentBranch: "gh-pages",

  onBrokenLinks: "warn",
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  themes: ["@docusaurus/theme-mermaid"],

  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: ".generated-docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
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
      navbar: {
        title: replaceDocVariables("{{PROJECT_DOCS_NAME}}", docVariables),
        items: [
          { to: "/", label: "Docs", position: "left" },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} ${replaceDocVariables("{{PROJECT_ORG_NAME}}", docVariables)}`,
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
