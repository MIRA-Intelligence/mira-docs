import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import HomepageFeatures from "../components/HomepageFeatures";
import HomepageShowcase from "../components/HomepageShowcase";

import styles from "./index.module.css";

function HomepageHero(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.hero)}>
      <div className="container">
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          为研究与工程团队设计的 AI Agent 框架
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
          <span className={styles.heroTitleAccent}> · 让 Agent 真正落地。</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          MIRA 是一个开源的项目级 AI 助手框架。把"研究 → 实验 → 报告"这条链路
          交给 Agent，输入一个目标，输出可复现的实验、可读的报告、可分享的 PPT。
          <br />
          配套桌面 UI、CLI、PyPI 包、Docker 镜像，飞书 / Slack / Telegram 一并接入。
        </p>
        <div className={styles.heroCtas}>
          <Link
            className={clsx("button button--primary button--lg", styles.heroCtaPrimary)}
            to="/docs/usage/start"
          >
            10 分钟快速开始 →
          </Link>
          <Link
            className={clsx("button button--secondary button--lg", styles.heroCtaSecondary)}
            to="/docs/"
          >
            阅读文档
          </Link>
          <Link
            className={clsx("button button--secondary button--lg", styles.heroCtaGithub)}
            href="https://github.com/MIRA-Intelligence/mira"
          >
            <GitHubIcon /> GitHub
          </Link>
        </div>
        <pre className={styles.heroInstall}>
          <code>
            <span className={styles.heroInstallPrompt}>$ </span>pip install mira-engine
          </code>
        </pre>
      </div>
    </header>
  );
}

function GitHubIcon(): ReactNode {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="18"
      height="18"
      fill="currentColor"
      style={{ verticalAlign: "-3px", marginRight: "6px" }}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function HomepageStats(): ReactNode {
  const stats = [
    { num: "20+", label: "内置 LLM Provider" },
    { num: "13", label: "Channel 接入" },
    { num: "3", label: "形态：CLI / Web / Desktop" },
    { num: "100%", label: "本地 + 自托管友好" },
  ];
  return (
    <section className={styles.stats}>
      <div className="container">
        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statsItem}>
              <div className={styles.statsNum}>{s.num}</div>
              <div className={styles.statsLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="MIRA · Open-source AI agent framework"
      description="MIRA 是一个开源的项目级 AI 助手框架，把研究、实验、报告生成端到端交给 Agent。"
    >
      <HomepageHero />
      <main>
        <HomepageStats />
        <HomepageFeatures />
        <HomepageShowcase />
      </main>
    </Layout>
  );
}
