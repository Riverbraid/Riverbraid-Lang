import { execSync } from "child_process";
import { RelationalProcessor } from "../Riverbraid-Cognition/processor.js";
import { generateSeal } from "../Riverbraid-Crypto-Gold/sealer.js";
import { checkSafety } from "../Riverbraid-Safety-Gold/guard.js";
import { arbitrate } from "../Riverbraid-Judicial-Gold/arbiter.js";
import { analyzeVision } from "../Riverbraid-Vision-Gold/analyzer.js";
import { analyzeAudio } from "../Riverbraid-Audio-Gold/listener.js";
import { commitToMemory } from "../Riverbraid-Memory-Gold/ledger.js";
import { checkCadence } from "../Riverbraid-Temporal-Gold/clock.js";

const engine = new RelationalProcessor();

function bridgeIntent(intent) {
  console.log(`🎙️  Bridge Received: "${intent}"`);
  const safety = checkSafety(intent);
  if (!safety.cleared) { return console.error(`🚨 Safety Violation: ${safety.reason}`); }

  let result;

  if (/audit|verify/i.test(intent)) {
    result = execSync("powershell.exe -File ../Riverbraid-Golds/bin/rb-audit.ps1", { encoding: "utf8" });
    console.log(result);
  } 
  else if (/time|clock|cadence/i.test(intent)) {
    result = checkCadence();
    console.log(result);
  }
  else if (/seal|sign/i.test(intent)) {
    result = generateSeal({ engine: engine.state });
    commitToMemory({ type: "seal", data: result });
    console.log(`✅ System Sealed and Memorized: [${result.seal}]`);
  }
  else if (/look|see|vision/i.test(intent)) {
    result = analyzeVision("current_frame");
    console.log(result);
  }
  else if (/listen|hear|audio/i.test(intent)) {
    result = analyzeAudio("current_input");
    console.log(result);
  }
  else if (/resolve|choose/i.test(intent)) {
    result = arbitrate(["Option A: Rapid Expansion", "Option B: Coherent Integration"]);
    commitToMemory({ type: "decision", data: result });
    console.log(`⚖️  Judicial Decision: ${result.decision}`);
  }
  else {
    result = engine.process(intent);
    console.log(`🧠 Engine Response: ${result.output}`);
  }
}
bridgeIntent(process.argv.slice(2).join(" ") || "status");
