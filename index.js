import { execSync } from "child_process";
import path from "path";

function bridgeIntent(intent) {
  console.log(`🎙️  Semantic Bridge: Interpreting intent -> "${intent}"`);
  
  const isAudit = /audit|check|verify/i.test(intent);

  if (isAudit) {
    console.log("➡️  Mapping to: Global System Audit...");
    try {
      // Execute the PowerShell audit script from the Golds repo
      const output = execSync("powershell.exe -File ../Riverbraid-Golds/bin/rb-audit.ps1", { encoding: "utf8" });
      console.log(output);
    } catch (e) {
      console.error("❌ Bridge Error: Could not execute Golds audit.");
    }
  } else {
    console.log("❓ Intent recognized, but no specific petal mapping found yet.");
    console.log("Current capabilities: [System Audit]");
  }
}

const userIntent = process.argv.slice(2).join(" ");
bridgeIntent(userIntent || "status");
