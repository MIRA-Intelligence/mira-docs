const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "docs");
const OUTPUT_DIR = path.join(ROOT, ".generated-docs");
const VARIABLES_FILE = path.join(SOURCE_DIR, "variables.md");

const DEFAULTS = {
  PROJECT_CORE_NAME: "MIRA",
  PROJECT_UI_NAME: "MiraUI",
  PROJECT_ORG_NAME: "MIRA-Intelligence",
  PROJECT_DOCS_NAME: "MIRA Docs",
};

function loadVariables() {
  const raw = fs.readFileSync(VARIABLES_FILE, "utf8");
  const matches = [...raw.matchAll(/`(PROJECT_[A-Z_]+)\s*=\s*([^`]+)`/g)];

  if (matches.length === 0) {
    return DEFAULTS;
  }

  const parsed = {};
  for (const [, key, value] of matches) {
    parsed[key] = value.trim();
  }
  return { ...DEFAULTS, ...parsed };
}

function replacePlaceholders(text, variables) {
  return text.replace(/\{\{(PROJECT_[A-Z_]+)\}\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(variables, key)
      ? variables[key]
      : match;
  });
}

function isTextDocFile(filePath) {
  return filePath.endsWith(".md") || filePath.endsWith(".mdx");
}

function renderDir(sourceDir, outputDir, variables) {
  fs.mkdirSync(outputDir, { recursive: true });
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      renderDir(sourcePath, outputPath, variables);
      continue;
    }

    if (isTextDocFile(sourcePath)) {
      const raw = fs.readFileSync(sourcePath, "utf8");
      const rendered = replacePlaceholders(raw, variables);
      fs.writeFileSync(outputPath, rendered, "utf8");
      continue;
    }

    fs.copyFileSync(sourcePath, outputPath);
  }
}

function main() {
  const variables = loadVariables();
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  renderDir(SOURCE_DIR, OUTPUT_DIR, variables);
  console.log("Rendered docs with variables to .generated-docs");
}

main();
