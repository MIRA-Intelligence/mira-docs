import React, { type ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

type Feature = {
  title: string;
  to: string;
  emoji: string;
  desc: ReactNode;
};

const FEATURES: Feature[] = [
  {
    emoji: "🧪",
    title: "项目级 Research Agent",
    to: "/docs/concepts",
    desc: (
      <>
        围绕 <code>workspace / project / experiment / task_plan</code> 五要素
        建模，让 Agent 长期协作而不是一次性聊天。每一步实验都有
        <code> task_plan.json </code>记录，可复现、可审计。
      </>
    ),
  },
  {
    emoji: "🤖",
    title: "20+ LLM Provider，开箱即用",
    to: "/docs/usage/agent-config/providers-and-runtime",
    desc: (
      <>
        OpenAI、Anthropic、OpenRouter、DeepSeek、Azure、Ollama、vLLM 等全部
        内置。支持 <code>routeByComplexity</code>，便宜的活给 small 模型，
        难的给 large。
      </>
    ),
  },
  {
    emoji: "🖥️",
    title: "CLI / Web / Desktop 三形态",
    to: "/docs/usage/ui/desktop-web-mode",
    desc: (
      <>
        命令行跑实验，浏览器看进度，Electron 桌面端开机即用。
        三者共用一份配置，状态实时同步。
      </>
    ),
  },
  {
    emoji: "💬",
    title: "13 个 Channel 接入",
    to: "/docs/usage/agent-config/channels",
    desc: (
      <>
        飞书、Slack、Telegram、钉钉、邮件、Matrix…… 在群里 @ 一下
        让 Agent 跑实验、出报告、回复结论，不用打开浏览器。
      </>
    ),
  },
  {
    emoji: "🛡️",
    title: "Guardrail 自动修复",
    to: "/docs/usage/ui/guardrail-and-auto-repair",
    desc: (
      <>
        实验字段缺失？模型自己回头补。最多 3 次自动修复回合，
        失败再交给人工。<code>strict</code> 模式可强制接合规字段。
      </>
    ),
  },
  {
    emoji: "📦",
    title: "本地优先，自托管友好",
    to: "/docs/deployment/",
    desc: (
      <>
        所有数据落在 <code>~/.mira/</code>，单机 / 团队 docker-compose / 远程
        gateway 三种部署模式都覆盖。零厂商锁定。
      </>
    ),
  },
];

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
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>核心能力</div>
          <Heading as="h2" className={styles.sectionTitle}>
            为复杂、长程的研究任务而生
          </Heading>
          <p className={styles.sectionLead}>
            不是又一个聊天机器人。MIRA 把"想清楚 → 跑实验 → 写报告"端到端
            做完，每一步都留下证据。
          </p>
        </div>
        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
