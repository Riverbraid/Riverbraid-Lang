const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const criticalFiles = ["package.json", "verify-vector.cjs"];

function computeHash(files) {
    const hash = crypto.createHash("sha256");
    files.forEach(file => {
        const fullPath = path.join(__dirname, file);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath);
            hash.update(content);
        }
    });
    return hash.digest("hex");
}

try {
    const floorPath = path.join(__dirname, "integrity-floor.json");
    const floorData = JSON.parse(fs.readFileSync(floorPath, "utf8"));
    const currentHash = computeHash(criticalFiles);

    if (currentHash === floorData.expected_hash) {
        process.stdout.write("VERIFICATION_PASS: SPATIAL_INTEGRITY_VALID\n");
        process.exit(0);
    } else {
        process.stderr.write("VERIFICATION_FAIL: HASH_MISMATCH (Computed: " + currentHash.substring(0,8) + ")\n");
        process.exit(1);
    }
} catch (err) {
    process.stderr.write("VERIFICATION_FAIL: " + err.message + "\n");
    process.exit(1);
}