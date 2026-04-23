#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, '..', 'docs');

async function walk(dir, out = []) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (/\.(md|mdx)$/.test(e.name)) out.push(p);
  }
  return out;
}

const blockRe = /```mermaid\n([\s\S]*?)```/g;

// Shim DOMPurify for headless Node parsing (mermaid only sanitizes at render,
// but its internal init still touches DOMPurify.addHook).
const dp = await import('dompurify');
const DOMPurify = dp.default || dp;
if (typeof DOMPurify.addHook !== 'function') DOMPurify.addHook = () => {};
if (typeof DOMPurify.sanitize !== 'function') DOMPurify.sanitize = (s) => s;

const { default: mermaid } = await import('mermaid');
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });

const files = await walk(docsDir);
let errors = 0;

for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  let m;
  let i = 0;
  while ((m = blockRe.exec(txt))) {
    const code = m[1];
    const lineStart = txt.slice(0, m.index).split('\n').length;
    try {
      await mermaid.parse(code);
    } catch (err) {
      errors++;
      const rel = path.relative(process.cwd(), f);
      console.log(`\nFAIL ${rel} block#${i} (around line ${lineStart}):`);
      console.log(String(err.message || err).split('\n').slice(0, 6).join('\n'));
    }
    i++;
  }
}

if (errors === 0) {
  console.log('All mermaid blocks parsed OK');
} else {
  console.log(`\n${errors} mermaid block(s) failed`);
  process.exit(1);
}
