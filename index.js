import { execSync } from "child_process";
import { RelationalProcessor } from "../Riverbraid-Cognition/processor.js";
import { generateSeal } from "../Riverbraid-Crypto-Gold/sealer.js";
import { checkSafety } from "../Riverbraid-Safety-Gold/guard.js";
import { arbitrate } from "../Riverbraid-Judicial-Gold/arbiter.js";

const engine = new RelationalProcessor();

function bridgeIntent(intent) {
  console.log(`🎙️  Bridge Received: "${intent}"`);
  
  const safety = checkSafety(intent);
  if (!safety.cleared) {
    console.error(`🚨 Safety Violation: ${safety.reason}`);
    return;
  }

  if (/audit|check|verify/i.test(intent)) {
    const output = execSync("powershell.exe -File ../Riverbraid-Golds/bin/rb-audit.ps1", { encoding: "utf8" });
    console.log(output);
  } 
  else if (/seal|sign|lock/i.test(intent)) {
    const sealData = generateSeal({ engine: engine.state });
    console.log(`✅ System Sealed: [${sealData.seal}]`);
  }
  else if (/resolve|choose|decide/i.test(intent)) {
    // Simulated multi-signal input for arbitration
    const options = ["Option A: Rapid Expansion", "Option B: Coherent Integration"];
    const decision = arbitrate(options);
    console.log(`⚖️  Judicial Decision: ${decision.decision}`);
    console.log(`📝 Rationale: ${decision.rationale}`);
  }
  else {
    const cognitionResponse = engine.process(intent);
    console.log(`🧠 Engine Response: ${cognitionResponse.output}`);
  }
}

bridgeIntent(process.argv.slice(2).join(" ") || "status");
