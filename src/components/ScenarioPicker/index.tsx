import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import clsx from "clsx";

import styles from "./styles.module.css";

export type ScenarioMeta = {
  id: string;
  emoji: string;
  title: ReactNode;
  subtitle: ReactNode;
  badge?: ReactNode;
};

type Ctx = {
  selected: string | null;
  showAll: boolean;
  hydrated: boolean;
  select: (id: string | null) => void;
  setShowAll: (v: boolean) => void;
};

const ScenarioCtx = createContext<Ctx>({
  selected: null,
  showAll: false,
  hydrated: false,
  select: () => {},
  setShowAll: () => {},
});

const STORAGE_KEY = "mira-quickstart-scenario";
const HASH_PREFIX = "scenario-";

function readInitialFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (hash.startsWith(HASH_PREFIX)) return hash.slice(HASH_PREFIX.length);
  return null;
}

function readInitialFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function ScenarioPickerProvider({
  children,
  defaultScenario,
}: {
  children: ReactNode;
  defaultScenario?: string;
}) {
  // Start with null so server render and first client render match.
  // We hydrate the real selection in useEffect.
  const [selected, setSelected] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fromHash = readInitialFromLocation();
    const fromStorage = readInitialFromStorage();
    setSelected(fromHash ?? fromStorage ?? defaultScenario ?? null);
    setHydrated(true);

    const onHashChange = () => {
      const next = readInitialFromLocation();
      if (next) {
        setSelected(next);
        setShowAll(false);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [defaultScenario]);

  const select = (id: string | null) => {
    setSelected(id);
    setShowAll(false);
    if (typeof window === "undefined") return;
    try {
      if (id) window.localStorage.setItem(STORAGE_KEY, id);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore — private mode, quota, etc.
    }
    if (id) {
      const url = new URL(window.location.href);
      url.hash = `${HASH_PREFIX}${id}`;
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <ScenarioCtx.Provider
      value={{ selected, showAll, hydrated, select, setShowAll }}
    >
      {children}
    </ScenarioCtx.Provider>
  );
}

export function ScenarioPicker({
  scenarios,
  question,
  showAllLabel = "看全部 5 个方案",
}: {
  scenarios: ScenarioMeta[];
  question?: ReactNode;
  showAllLabel?: ReactNode;
}) {
  const { selected, showAll, hydrated, select, setShowAll } = useContext(ScenarioCtx);

  return (
    <div className={styles.pickerWrap}>
      {question && <div className={styles.pickerQuestion}>{question}</div>}
      <div className={styles.grid}>
        {scenarios.map((s) => {
          const isActive = hydrated && !showAll && selected === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => select(s.id)}
              className={clsx(styles.card, isActive && styles.cardSelected)}
              aria-pressed={isActive}
            >
              <span className={styles.cardEmoji} aria-hidden>
                {s.emoji}
              </span>
              <div className={styles.cardTitleRow}>
                <span className={styles.cardTitle}>{s.title}</span>
                {s.badge && <span className={styles.cardBadge}>{s.badge}</span>}
              </div>
              <div className={styles.cardSubtitle}>{s.subtitle}</div>
            </button>
          );
        })}
      </div>
      <div className={styles.pickerFooter}>
        {showAll ? (
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setShowAll(false)}
          >
            收起，回到单方案视图
          </button>
        ) : (
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => {
              setShowAll(true);
            }}
          >
            {showAllLabel}
          </button>
        )}
        {selected && !showAll && (
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => select(null)}
          >
            清除当前选择
          </button>
        )}
      </div>
    </div>
  );
}

export function Scenario({
  id,
  title,
  children,
}: {
  id: string;
  title?: ReactNode;
  children: ReactNode;
}) {
  const { selected, showAll, hydrated } = useContext(ScenarioCtx);
  const visible = hydrated && (showAll || selected === id);
  // Always render to DOM so MDX search sees the content. Toggle visibility.
  // Expose a stable DOM id so external links like #scenario-foo work and
  // hashchange-based scroll lands inside the right block.
  return (
    <section
      id={`scenario-${id}`}
      data-scenario-id={id}
      hidden={!visible}
      className={styles.scenarioBlock}
    >
      {showAll && title && (
        <div className={styles.scenarioBlockHeading}>{title}</div>
      )}
      {children}
    </section>
  );
}

export function ScenarioFallback({ children }: { children: ReactNode }) {
  const { selected, showAll, hydrated } = useContext(ScenarioCtx);
  // Show fallback when the user has not made a selection yet (or while hydrating).
  const visible = !hydrated || (!selected && !showAll);
  return (
    <div hidden={!visible} className={styles.scenarioFallback}>
      {children}
    </div>
  );
}
