/**
 * Unit tests for render-doc-variables.js
 * Run with: node --test scripts/render-doc-variables.test.js
 */
const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const {
  replacePlaceholders,
  isTextDocFile,
  loadVariables,
  renderDir,
  DEFAULTS,
} = require("./render-doc-variables");

// ---------------------------------------------------------------------------
// replacePlaceholders
// ---------------------------------------------------------------------------
describe("replacePlaceholders", () => {
  test("replaces known variable", () => {
    const vars = { PROJECT_CORE_NAME: "MIRA" };
    const result = replacePlaceholders("Hello {{PROJECT_CORE_NAME}}!", vars);
    assert.equal(result, "Hello MIRA!");
  });

  test("replaces multiple different variables in one string", () => {
    const vars = { PROJECT_CORE_NAME: "MIRA", PROJECT_ORG_NAME: "MIRA-Intelligence" };
    const result = replacePlaceholders(
      "{{PROJECT_CORE_NAME}} by {{PROJECT_ORG_NAME}}",
      vars
    );
    assert.equal(result, "MIRA by MIRA-Intelligence");
  });

  test("replaces the same variable multiple times", () => {
    const vars = { PROJECT_ORG_NAME: "MIRA-Intelligence" };
    const result = replacePlaceholders(
      "{{PROJECT_ORG_NAME}} / {{PROJECT_ORG_NAME}}",
      vars
    );
    assert.equal(result, "MIRA-Intelligence / MIRA-Intelligence");
  });

  test("leaves unknown variable placeholder unchanged", () => {
    const vars = { PROJECT_CORE_NAME: "MIRA" };
    const result = replacePlaceholders("{{UNKNOWN_VAR}}", vars);
    assert.equal(result, "{{UNKNOWN_VAR}}");
  });

  test("leaves non-PROJECT_ placeholder unchanged", () => {
    const vars = {};
    const result = replacePlaceholders("{{some_var}}", vars);
    assert.equal(result, "{{some_var}}");
  });

  test("returns string unchanged when no placeholders present", () => {
    const vars = { PROJECT_CORE_NAME: "MIRA" };
    const result = replacePlaceholders("No placeholders here.", vars);
    assert.equal(result, "No placeholders here.");
  });

  test("handles empty string", () => {
    assert.equal(replacePlaceholders("", {}), "");
  });
});

// ---------------------------------------------------------------------------
// isTextDocFile
// ---------------------------------------------------------------------------
describe("isTextDocFile", () => {
  test("returns true for .md files", () => {
    assert.equal(isTextDocFile("readme.md"), true);
  });

  test("returns true for .mdx files", () => {
    assert.equal(isTextDocFile("index.mdx"), true);
  });

  test("returns false for .png files", () => {
    assert.equal(isTextDocFile("image.png"), false);
  });

  test("returns false for .js files", () => {
    assert.equal(isTextDocFile("script.js"), false);
  });

  test("returns false for .json files", () => {
    assert.equal(isTextDocFile("config.json"), false);
  });
});

// ---------------------------------------------------------------------------
// loadVariables
// ---------------------------------------------------------------------------
describe("loadVariables", () => {
  test("returns parsed variables from real variables.md", () => {
    const vars = loadVariables();
    assert.equal(typeof vars.PROJECT_CORE_NAME, "string");
    assert.equal(typeof vars.PROJECT_ORG_NAME, "string");
    assert.ok(vars.PROJECT_CORE_NAME.length > 0);
    assert.ok(vars.PROJECT_ORG_NAME.length > 0);
  });

  test("includes all DEFAULTS keys", () => {
    const vars = loadVariables();
    for (const key of Object.keys(DEFAULTS)) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(vars, key),
        `Missing key: ${key}`
      );
    }
  });
});

// ---------------------------------------------------------------------------
// renderDir — integration smoke test
// ---------------------------------------------------------------------------
describe("renderDir", () => {
  test("copies non-doc files unchanged and renders .md files", () => {
    const srcDir = fs.mkdtempSync(path.join(os.tmpdir(), "src-"));
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "out-"));

    fs.writeFileSync(
      path.join(srcDir, "page.md"),
      "Project: {{PROJECT_CORE_NAME}}"
    );
    fs.writeFileSync(path.join(srcDir, "logo.png"), "binary-data");

    const vars = { PROJECT_CORE_NAME: "MIRA" };
    renderDir(srcDir, outDir, vars);

    const renderedMd = fs.readFileSync(path.join(outDir, "page.md"), "utf8");
    assert.equal(renderedMd, "Project: MIRA");

    const copiedPng = fs.readFileSync(path.join(outDir, "logo.png"), "utf8");
    assert.equal(copiedPng, "binary-data");
  });

  test("recurses into subdirectories", () => {
    const srcDir = fs.mkdtempSync(path.join(os.tmpdir(), "src-"));
    const subDir = path.join(srcDir, "sub");
    fs.mkdirSync(subDir);
    fs.writeFileSync(
      path.join(subDir, "nested.md"),
      "Org: {{PROJECT_ORG_NAME}}"
    );

    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "out-"));
    const vars = { PROJECT_ORG_NAME: "MIRA-Intelligence" };
    renderDir(srcDir, outDir, vars);

    const content = fs.readFileSync(
      path.join(outDir, "sub", "nested.md"),
      "utf8"
    );
    assert.equal(content, "Org: MIRA-Intelligence");
  });
});

// ---------------------------------------------------------------------------
// Docs lint — no hardcoded release version tags
// ---------------------------------------------------------------------------

// Matches a semver release tag in a GitHub URL, e.g. releases/tag/v1.2.3
const HARDCODED_TAG_PATTERN = /releases\/tag\/v\d+\.\d+[\d.a-zA-Z-]*/;
// Matches any GitHub releases URL (used to assert each one uses /releases/latest)
const GITHUB_RELEASE_LINK_PATTERN =
  /https:\/\/github\.com\/[^/]+\/[^/]+\/releases[^\s)"'`>]*/g;

describe("docs release links lint", () => {
  const DOCS_DIR = path.join(__dirname, "..", "docs");

  function collectDocFiles(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...collectDocFiles(full));
      } else if (isTextDocFile(entry.name)) {
        results.push(full);
      }
    }
    return results;
  }

  test("no doc file contains a hardcoded releases/tag/ URL", () => {
    const docFiles = collectDocFiles(DOCS_DIR);
    assert.ok(docFiles.length > 0, "Expected at least one doc file");

    const violations = [];

    for (const filePath of docFiles) {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (HARDCODED_TAG_PATTERN.test(lines[i])) {
          violations.push(`${filePath}:${i + 1}: ${lines[i].trim()}`);
        }
      }
    }

    assert.deepEqual(
      violations,
      [],
      `Hardcoded release version tags found:\n${violations.join("\n")}`
    );
  });

  test("release links in start.md use /releases/latest", () => {
    const startMd = fs.readFileSync(
      path.join(DOCS_DIR, "usage", "start.md"),
      "utf8"
    );
    const releaseLinks = [
      ...startMd.matchAll(GITHUB_RELEASE_LINK_PATTERN),
    ].map((m) => m[0]);

    assert.ok(releaseLinks.length > 0, "Expected at least one release link in start.md");

    for (const link of releaseLinks) {
      assert.ok(
        link.includes("/releases/latest"),
        `Release link should use /releases/latest, got: ${link}`
      );
    }
  });
});
