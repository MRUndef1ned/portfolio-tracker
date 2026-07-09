const version = process.versions.node;
const major = Number.parseInt(version.split(".")[0], 10);

if (Number.isNaN(major) || major < 20 || major >= 23) {
  console.error("");
  console.error("Unsupported Node.js version:", version);
  console.error("");
  console.error("This project requires Node.js 20.x or 22.x.");
  console.error("Node 24 is not supported yet (better-sqlite3 native module).");
  console.error("");
  console.error("Fix options:");
  console.error("  1) Install Node 22 LTS: winget install OpenJS.NodeJS.LTS");
  console.error("  2) Or run API in Docker: pnpm dev:api:docker");
  console.error("");
  process.exit(1);
}

console.log(`Node version OK: ${version}`);
