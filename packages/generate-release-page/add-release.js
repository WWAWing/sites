function append(version) {
    const releases = require("../releases.json");
    const fs = require("fs");
    if (!releases.releases.find((target) => target === version)) {
        releases.releases.unshift(version);
        fs.writeFileSync("../releases.json", JSON.stringify(releases) + "\n");
    }
}

if (process.argv.length > 2) {
    append(process.argv[2]);
}
