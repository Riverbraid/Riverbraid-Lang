import fs from "node:fs";
import crypto from "node:crypto";
const repo = "Riverbraid-Lang";
const ring = 2;
const infraClass = "language-layer";
const expectedAnchor = "STATIONARY_STATE_V2_20260425-092050";
const requiredFiles = [
  ".anchor",
  "AUTHORITY.md",
  "RING.md",
  "package.json",
  "verify.mjs"
];
const structuralArtifacts = [
  "Cargo.toml",
  "spec.json",
  "src",
  "package.json"
];
function readTextNoBom(path) {
  return fs.readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));
const structuralArtifactPresent = structuralArtifacts.some((file) => fs.existsSync(file));
let anchorValue = null;
let anchorMatches = false;
let failureCodes = [];
if (missingFiles.length > 0) {
  failureCodes.push("REQUIRED_FILES_MISSING");
}
if (fs.existsSync(".anchor")) {
  anchorValue = readTextNoBom(".anchor").trim();
  anchorMatches = anchorValue === expectedAnchor;
  if (!anchorMatches) {
    failureCodes.push("ANCHOR_MISMATCH");
  }
} else {
  failureCodes.push("ANCHOR_MISSING");
}
if (!structuralArtifactPresent) {
  failureCodes.push("STRUCTURAL_ARTIFACT_MISSING");
}
const ok =
  missingFiles.length === 0 &&
  anchorMatches &&
  structuralArtifactPresent;
const hash = crypto.createHash("sha256");
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    hash.update(file);
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
}
const output = {
  repo,
  ring,
  class: infraClass,
  status: ok ? "VERIFIED" : "FILES_PRESENT_UNVERIFIED",
  verification_scope: "ring2-language-anchor-and-file-surface",
  claim_boundary: "infrastructure-classification-only",
  expected_anchor: expectedAnchor,
  observed_anchor: anchorValue,
  anchor_matches: anchorMatches,
  structural_artifact_present: structuralArtifactPresent,
  required_files: requiredFiles,
  missing_files: missingFiles,
  failure_codes: ok ? [] : failureCodes,
  digest: "sha256:" + hash.digest("hex")
};
fs.writeFileSync("verify-output.json", JSON.stringify(output, null, 2));
process.exit(0);