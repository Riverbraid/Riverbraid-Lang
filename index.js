import { execSync } from "child_process";
import { RelationalProcessor } from "../Riverbraid-Cognition/processor.js";
import { generateSeal } from "../Riverbraid-Crypto-Gold/sealer.js";
import { checkSafety } from "../Riverbraid-Safety-Gold/guard.js";
import { arbitrate } from "../Riverbraid-Judicial-Gold/arbiter.js";
import { analyzeVision } from "../Riverbraid-Vision-Gold/analyzer.js";
import { analyzeAudio } from "../Riverbraid-Audio-Gold/listener.js";

const engine = new RelationalProcessor();

function bridgeIntent(intent) {
  console.log(`🎙️  Bridge Received: "${intent}"`);
  const safety = checkSafety(intent);
  if (!safety.cleared) { return console.error(`🚨 Safety Violation: ${safety.reason}`); }

  if (/audit|verify/i.test(intent)) {
    console.log(execSync("powershell.exe -File ../Riverbraid-Golds/bin/rb-audit.ps1", { encoding: "utf8" }));
  } 
  else if (/seal|sign/i.test(intent)) {
    console.log(generateSeal({ engine: engine.state }));
  }
  else if (/look|see|vision/i.test(intent)) {
    console.log(analyzeVision("current_frame"));
  }
  else if (/listen|hear|audio/i.test(intent)) {
    console.log(analyzeAudio("current_input"));
  }
  else if (/resolve|choose/i.test(intent)) {
    const decision = arbitrate(["Option A: Rapid Expansion", "Option B: Coherent Integration"]);
    console.log(`⚖️  Judicial Decision: ${decision.decision}`);
  }
  else {
    console.log(`🧠 Engine Response: ${engine.process(intent).output}`);
  }
}
bridgeIntent(process.argv.slice(2).join(" ") || "status");
