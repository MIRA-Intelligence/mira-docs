import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import ThemedImage from "@theme/ThemedImage";
import HomepageFeatures from "../components/HomepageFeatures";
import HomepageShowcase from "../components/HomepageShowcase";

import styles from "./index.module.css";

function HomepageHero(): ReactNode {
  const heroLogoLight = useBaseUrl("/img/logo-anim.webp");
  const heroLogoDark = useBaseUrl("/img/logo-dark-anim.webp");
  return (
    <header className={clsx("hero", styles.hero)}>
      <div className="container">
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          <Translate id="homepage.hero.badge" description="Hero badge tagline">
            为科学研究设计的 AI Agent
          </Translate>
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          <span className={styles.heroLogo}>
            <ThemedImage
              alt="MIRA"
              sources={{
                light: heroLogoLight,
                dark: heroLogoDark,
              }}
            />
          </span>
          <span className={styles.heroTitleAccent}>
            <Translate
              id="homepage.hero.titleAccent"
              description="Accent phrase after the product name in hero title"
            >
              {" · 让 Agent 服务于科研"}
            </Translate>
          </span>
        </Heading>
        <p className={styles.heroSubtitle}>
          <Translate
            id="homepage.hero.subtitle.line1"
            description="Hero subtitle, first line"
          >
            MIRA 是一个开源的项目级 AI 助手。把"研究 → 实验 → 报告"这条链路交给 Agent，输入一个目标，输出可复现的实验、可读的报告、可分享的 PPT。
          </Translate>
          <br />
          <Translate
            id="homepage.hero.subtitle.line2"
            description="Hero subtitle, second line"
          >
            配套专属桌面 UI、CLI、PyPI包、Docker镜像，飞书 / Slack / QQ 一并接入。
          </Translate>
        </p>
        <div className={styles.heroCtas}>
          <Link
            className={clsx("button button--primary button--lg", styles.heroCtaPrimary)}
            to="/docs/usage/start"
          >
            <Translate id="homepage.hero.cta.quickstart" description="Quickstart CTA button">
              10 分钟快速开始 →
            </Translate>
          </Link>
          <Link
            className={clsx("button button--lg", styles.heroCtaSecondary)}
            to="/docs"
          >
            <Translate id="homepage.hero.cta.docs" description="Read docs CTA button">
              阅读文档
            </Translate>
          </Link>
          <Link
            className={clsx("button button--lg", styles.heroCtaGithub)}
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
    {
      num: "20+",
      label: translate({
        id: "homepage.stats.providers",
        description: "Stats label: number of built-in LLM providers",
        message: "内置 LLM Provider",
      }),
    },
    {
      num: "13",
      label: translate({
        id: "homepage.stats.channels",
        description: "Stats label: number of channel integrations",
        message: "Channel 接入",
      }),
    },
    {
      num: "3",
      label: translate({
        id: "homepage.stats.formFactors",
        description: "Stats label: number of delivery form factors",
        message: "形态：CLI / Web / Desktop",
      }),
    },
    {
      num: "100%",
      label: translate({
        id: "homepage.stats.selfhost",
        description: "Stats label: self-host friendliness",
        message: "本地 + 自托管友好",
      }),
    },
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
  return (
    <Layout
      title={translate({
        id: "homepage.meta.title",
        description: "Homepage browser tab title",
        message: "MIRA · Open-source AI agent framework",
      })}
      description={translate({
        id: "homepage.meta.description",
        description: "Homepage meta description for SEO",
        message:
          "MIRA 是一个开源的项目级 AI 助手框架，把研究、实验、报告生成端到端交给 Agent。",
      })}
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
