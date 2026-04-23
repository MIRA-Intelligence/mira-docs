import React, { type ReactNode } from "react";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

export default function HomepageShowcase(): ReactNode {
  const screenshot = useBaseUrl("/img/ui-navigation.png");

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <div className={styles.eyebrow}>
              <Translate id="homepage.showcase.eyebrow">桌面 UI</Translate>
            </div>
            <Heading as="h2" className={styles.title}>
              <Translate id="homepage.showcase.title">
                一个为 Agent 而生的工作台
              </Translate>
            </Heading>
            <p className={styles.lead}>
              <Translate id="homepage.showcase.lead">
                {
                  "MiraUI 把项目队列、阶段流水线、实验详情、Result 导出中心整合在一个 Electron 应用里。Agent 在后台跑，你随时切换项目看进度，点几下就能导出 PPT、论文、experiment_report。"
                }
              </Translate>
            </p>
            <ul className={styles.bullets}>
              <li>
                <strong>
                  <Translate id="homepage.showcase.bullet.realtime.label">
                    实时同步
                  </Translate>
                </strong>
                <Translate id="homepage.showcase.bullet.realtime.body">
                  {"：WebSocket 推 + REST 兜底，状态从 task_plan.json 一手获取。"}
                </Translate>
              </li>
              <li>
                <strong>
                  <Translate id="homepage.showcase.bullet.forms.label">
                    {"Web/Desktop 一份代码"}
                  </Translate>
                </strong>
                <Translate id="homepage.showcase.bullet.forms.body">
                  {"：浏览器开发，Electron 打包，本地自动 spawn mira-engine。"}
                </Translate>
              </li>
              <li>
                <strong>
                  <Translate id="homepage.showcase.bullet.rollback.label">
                    {"可暂停 / 可回滚"}
                  </Translate>
                </strong>
                <Translate id="homepage.showcase.bullet.rollback.body">
                  {"：每个实验的 prompt、tool 调用、guardrail 修复都有完整 trace。"}
                </Translate>
              </li>
            </ul>
            <div className={styles.actions}>
              <Link className="button button--primary" to="/docs/usage/ui">
                <Translate id="homepage.showcase.cta.ui">查看 UI 功能 →</Translate>
              </Link>
              <Link
                className="button button--secondary"
                href="https://github.com/MIRA-Intelligence/mira-ui/releases"
              >
                <Translate id="homepage.showcase.cta.download">下载安装包</Translate>
              </Link>
            </div>
          </div>
          <div className={styles.shotWrap}>
            <img
              src={screenshot}
              alt={translate({
                id: "homepage.showcase.screenshot.alt",
                message: "MiraUI 主界面截图",
              })}
              className={styles.shot}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
