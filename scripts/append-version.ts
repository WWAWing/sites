import releases from "../releases.json";
import fs from "fs";
import path from "path";

const releasesJson = path.join(".", "releases.json");

function appendVersionToList(version: string) {
    if (!releases.releases.find((target) => target === version)) {
        releases.releases.unshift(version);
        fs.writeFileSync(releasesJson, JSON.stringify(releases) + "\n");
    }
}

if( process.argv.length < 3 || !process.argv[2]) {
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} X.X.X`);
    console.error("X.X.X is release version.")
    process.exit();
}

appendVersionToList(process.argv[2]);
