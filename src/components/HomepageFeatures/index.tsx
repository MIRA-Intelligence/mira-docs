import React, { type ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";

import styles from "./styles.module.css";

type Feature = {
  title: string;
  to: string;
  emoji: string;
  desc: ReactNode;
};

function useFeatures(): Feature[] {
  return [
    {
      emoji: "🧪",
      title: translate({
        id: "homepage.features.research.title",
        message: "项目级 Research Agent",
      }),
      to: "/docs/concepts",
      desc: (
        <Translate id="homepage.features.research.desc">
          {
            "围绕 workspace / project / experiment / task_plan 五要素建模，让 Agent 长期协作而不是一次性聊天。每一步实验都有 task_plan.json 记录，可复现、可审计。"
          }
        </Translate>
      ),
    },
    {
      emoji: "🤖",
      title: translate({
        id: "homepage.features.providers.title",
        message: "20+ LLM Provider，开箱即用",
      }),
      to: "/docs/usage/agent-config/providers-and-runtime",
      desc: (
        <Translate id="homepage.features.providers.desc">
          {
            "OpenAI、Anthropic、OpenRouter、DeepSeek、Azure、Ollama、vLLM 等全部内置。支持 routeByComplexity，便宜的活给 small 模型，难的给 large。"
          }
        </Translate>
      ),
    },
    {
      emoji: "🖥️",
      title: translate({
        id: "homepage.features.forms.title",
        message: "CLI / Web / Desktop 三形态",
      }),
      to: "/docs/usage/ui/desktop-web-mode",
      desc: (
        <Translate id="homepage.features.forms.desc">
          {
            "命令行跑实验，浏览器看进度，Electron 桌面端开机即用。三者共用一份配置，状态实时同步。"
          }
        </Translate>
      ),
    },
    {
      emoji: "💬",
      title: translate({
        id: "homepage.features.channels.title",
        message: "13 个 Channel 接入",
      }),
      to: "/docs/usage/agent-config/channels",
      desc: (
        <Translate id="homepage.features.channels.desc">
          {
            "飞书、Slack、Telegram、钉钉、邮件、Matrix…… 在群里 @ 一下让 Agent 跑实验、出报告、回复结论，不用打开浏览器。"
          }
        </Translate>
      ),
    },
    {
      emoji: "🛡️",
      title: translate({
        id: "homepage.features.guardrail.title",
        message: "Guardrail 自动修复",
      }),
      to: "/docs/usage/ui/guardrail-and-auto-repair",
      desc: (
        <Translate id="homepage.features.guardrail.desc">
          {
            "实验字段缺失？模型自己回头补。最多 3 次自动修复回合，失败再交给人工。strict 模式可强制接合规字段。"
          }
        </Translate>
      ),
    },
    {
      emoji: "📦",
      title: translate({
        id: "homepage.features.selfhost.title",
        message: "本地优先，自托管友好",
      }),
      to: "/docs/deployment",
      desc: (
        <Translate id="homepage.features.selfhost.desc">
          {
            "所有数据落在 ~/.mira/，单机 / 团队 docker-compose / 远程 gateway 三种部署模式都覆盖。零厂商锁定。"
          }
        </Translate>
      ),
    },
  ];
}

function FeatureCard({ feature }: { feature: Feature }): ReactNode {
  return (
    <Link to={feature.to} className={styles.card}>
      <div className={styles.cardEmoji} aria-hidden>
        {feature.emoji}
      </div>
      <Heading as="h3" className={styles.cardTitle}>
        {feature.title}
      </Heading>
      <p className={styles.cardDesc}>{feature.desc}</p>
      <span className={styles.cardArrow} aria-hidden>
        →
      </span>
    </Link>
  );
}

export default function HomepageFeatures(): ReactNode {
  const features = useFeatures();
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <Translate id="homepage.features.eyebrow">核心能力</Translate>
          </div>
          <Heading as="h2" className={styles.sectionTitle}>
            <Translate id="homepage.features.title">
              为复杂、长程的研究任务而生
            </Translate>
          </Heading>
          <p className={styles.sectionLead}>
            <Translate id="homepage.features.lead">
              {
                "不是又一个聊天机器人。MIRA 把\"想清楚 → 跑实验 → 写报告\"端到端做完，每一步都留下证据。"
              }
            </Translate>
          </p>
        </div>
        <div className={styles.grid}>
          {features.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
