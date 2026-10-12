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
            "在同一项目中保存独立 ModuleRun、实验记录和产物。选择候选继续下游，改变方向时保留已有分支。"
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
            "OpenAI、Anthropic、OpenRouter、DeepSeek、Azure、Ollama、vLLM 等全部内置。可配置有序模型候选和团队角色 Provider，按实际能力回退。"
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
        message: "执行确认与实验控制",
      }),
      to: "/docs/usage/ui/guardrail-and-auto-repair",
      desc: (
        <Translate id="homepage.features.guardrail.desc">
          {
            "执行前审核方案；手动实验结束后决定继续或汇总。新模块验证输入和产物，旧任务计划保留字段校验。"
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
            "项目保存在实际选择的目录。支持本机服务、Docker 自托管与远程 gateway，桌面端可管理本地引擎。"
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
                "从需要的模块开始，让执行范围、实验结果与交付证据有处可查。"
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
