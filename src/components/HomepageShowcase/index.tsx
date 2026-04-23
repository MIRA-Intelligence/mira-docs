import React, { type ReactNode } from "react";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

export default function HomepageShowcase(): ReactNode {
  const screenshot = useBaseUrl("/img/ui-navigation.png");

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <div className={styles.eyebrow}>桌面 UI</div>
            <Heading as="h2" className={styles.title}>
              一个为 Agent 而生的工作台
            </Heading>
            <p className={styles.lead}>
              MiraUI 把项目队列、阶段流水线、实验详情、Result 导出中心整合
              在一个 Electron 应用里。Agent 在后台跑，你随时切换项目看进度，
              点几下就能导出 PPT、论文、experiment_report。
            </p>
            <ul className={styles.bullets}>
              <li>
                <strong>实时同步</strong>：WebSocket 推 + REST 兜底，
                状态从 <code>task_plan.json</code> 一手获取。
              </li>
              <li>
                <strong>Web/Desktop 一份代码</strong>：浏览器开发，
                Electron 打包，本地自动 spawn <code>mira-engine</code>。
              </li>
              <li>
                <strong>可暂停 / 可回滚</strong>：每个实验的 prompt、tool
                调用、guardrail 修复都有完整 trace。
              </li>
            </ul>
            <div className={styles.actions}>
              <Link className="button button--primary" to="/docs/usage/ui">
                查看 UI 功能 →
              </Link>
              <Link
                className="button button--secondary"
                href="https://github.com/MIRA-Intelligence/mira-ui/releases"
              >
                下载安装包
              </Link>
            </div>
          </div>
          <div className={styles.shotWrap}>
            <img
              src={screenshot}
              alt="MiraUI 主界面截图"
              className={styles.shot}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
