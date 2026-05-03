import { execSync } from "child_process";
import { RelationalProcessor } from "riverbraid-cognition/processor.js";
import { generateSeal } from "riverbraid-crypto-gold/sealer.js";
import { checkSafety } from "riverbraid-safety-gold/guard.js";
import { arbitrate } from "riverbraid-judicial-gold/arbiter.js";
import { analyzeVision } from "riverbraid-vision-gold/analyzer.js";
import { analyzeAudio } from "riverbraid-audio-gold/listener.js";
import { commitToMemory } from "riverbraid-memory-gold/ledger.js";
import { checkCadence } from "riverbraid-temporal-gold/clock.js";

const engine = new RelationalProcessor();

function bridgeIntent(intent) {
  console.log(`???  Bridge Received: "${intent}"`);
  const safety = checkSafety(intent);
  if (!safety.cleared) { return console.error(`?? Safety Violation: ${safety.reason}`); }

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
    console.log(`? System Sealed and Memorized: [${result.seal}]`);
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
    console.log(`??  Judicial Decision: ${result.decision}`);
  }
  else {
    result = engine.process(intent);
    console.log(`?? Engine Response: ${result.output}`);
  }
}
bridgeIntent(process.argv.slice(2).join(" ") || "status");
