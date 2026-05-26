// One-shot deploy: build, then publish dist/ to the gh-pages branch.
// Usage: npm run deploy:gh
//
// Pipeline:
//   1. Clean stale built assets from dist/ (assets/, index.html, 404.html,
//      .nojekyll, .git) — but KEEP image folders that live in dist/.
//   2. Run `vite build` to produce a fresh dist/.
//   3. Drop .nojekyll (so GitHub Pages serves _underscore files).
//   4. Mirror index.html -> 404.html (SPA fallback for direct deep links).
//   5. Publish dist/ to the gh-pages branch via the `gh-pages` package.
//
// GitHub Pages must be configured to serve from:
//   Branch: gh-pages
//   Folder: / (root)

import { execSync } from "node:child_process";
import { writeFileSync, copyFileSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ghpages from "gh-pages";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const REPO = "https://github.com/arsanyemad86-eng/uxnin-store.git";
const BRANCH = "gh-pages";

const run = (cmd, opts = {}) => {
  console.log("> " + cmd);
  execSync(cmd, { stdio: "inherit", ...opts });
};

console.log("\n== UXNIN deploy ==\n");

// 1. Clean stale build output (preserve everything else in dist/, e.g. images)
if (existsSync(DIST)) {
  const stalePaths = [
    join(DIST, "assets"),
    join(DIST, "index.html"),
    join(DIST, "404.html"),
    join(DIST, ".nojekyll"),
    join(DIST, ".git"),
  ];
  for (const p of stalePaths) {
    if (existsSync(p)) {
      rmSync(p, { recursive: true, force: true });
      console.log("cleaned: " + p);
    }
  }
}

// 2. Build
run("npm run build");

if (!existsSync(join(DIST, "index.html"))) {
  console.error("Build did not produce dist/index.html. Aborting.");
  process.exit(1);
}

// 3. .nojekyll so GitHub Pages serves files like _xxx.js correctly
writeFileSync(join(DIST, ".nojekyll"), "");

// 4. 404.html fallback so any unknown path still boots the SPA (hash router will then route)
copyFileSync(join(DIST, "index.html"), join(DIST, "404.html"));

// 5. Publish dist/ -> gh-pages
ghpages.publish(
  DIST,
  {
    branch: BRANCH,
    repo: REPO,
    dotfiles: true, // include .nojekyll
    message: "deploy: UXNIN store",
    user: {
      name: "arsany",
      email: "arsanyemad86@gmail.com",
    },
  },
  (err) => {
    if (err) {
      console.error("\nDeploy failed:", err);
      process.exit(1);
    }
    console.log("\n== Deploy complete ==");
    console.log("Branch: " + BRANCH);
    console.log("Live (after Pages refresh): https://arsanyemad86-eng.github.io/uxnin-store/");
  }
);
