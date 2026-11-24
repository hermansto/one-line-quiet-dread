import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One code-review comment for "Two Days of Quiet Dread":
// it approves the PR, and quietly admits none of it matters.
const comment =
  "LGTM. The code works, the tests pass, and nothing matters — merging before the heat death of the universe.";

// The bounty caps the comment at 140 characters and one line,
// so fail loudly here instead of shipping an over-long entry.
if (comment.length > 140) {
  throw new Error(`Comment is ${comment.length} chars, over the 140-char limit`);
}
if (comment.includes("\n") || comment.includes("\r")) {
  throw new Error("Comment must be a single line");
}
const byteCount = Buffer.byteLength(comment, "utf8");

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.txt");
writeFileSync(target, comment, "utf8");

const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== comment) {
  throw new Error("entry.txt does not match the comment exactly");
}

console.log(
  `Wrote entry.txt (${comment.length} chars, ${byteCount} UTF-8 bytes) to ${outDir}`,
);
