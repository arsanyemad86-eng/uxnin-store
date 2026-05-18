// One-shot deploy: build, then force-push the dist/ folder to gh-pages master.
// Usage: npm run deploy:gh
//
// This script assumes:
//   - You have git installed and authenticated against GitHub.
//   - The remote repo is https://github.com/arsanyemad86-eng/uxnin-store
//   - You want to overwrite the master branch of that repo with the dist/ contents.
//
// What it does:
//   1. Runs `vite build` to produce a fresh dist/.
//   2. Adds .nojekyll inside dist/ (so GitHub Pages serves _underscore files).
//   3. Initializes a git repo INSIDE dist/, commits, and force-pushes to master.

import { execSync } from "node:child_process";
import { writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");
const REPO = "https://github.com/arsanyemad86-eng/uxnin-store.git";
const BRANCH = "master";

const run = (cmd, opts = {}) => {
  console.log("> " + cmd);
  execSync(cmd, { stdio: "inherit", ...opts });
};

console.log("\n== UXNIN deploy ==\n");

// 1. Build
run("npm run build");

// 2. Make sure .nojekyll exists in dist
writeFileSync(join(DIST, ".nojekyll"), "");

// 3. Init dist as its own git repo and force-push
const distGit = join(DIST, ".git");
if (existsSync(distGit)) rmSync(distGit, { recursive: true, force: true });

run("git init -b " + BRANCH, { cwd: DIST });
run('git config user.email "arsanyemad86@gmail.com"', { cwd: DIST });
run('git config user.name "arsany"', { cwd: DIST });
run("git add -A", { cwd: DIST });
run('git commit -m "deploy: UXNIN store"', { cwd: DIST });
run(`git remote add origin ${REPO}`, { cwd: DIST });
run(`git push -f origin ${BRANCH}`, { cwd: DIST });

console.log("\n== Deploy complete ==");
console.log("Live (after GitHub Pages enables): https://arsanyemad86-eng.github.io/uxnin-store/");
