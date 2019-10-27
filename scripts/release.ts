import * as releases from "../releases.json";
import * as fs from "fs";
import * as path from "path";
import * as packageJson from "../package.json";

const srcDir = "output";
const destDir = path.join(".", "wwawing.com", "downloads");
const releasesJson = path.join(".", "releases.json");

function appendVersionToList(version: string) {
    if (!releases.releases.find((target) => target === version)) {
        releases.releases.unshift(version);
        fs.writeFileSync(releasesJson, JSON.stringify(releases) + "\n");
    }
}

function copy(srcFileName: string, destFileName: string) {
    fs.copyFileSync(path.join(srcDir, srcFileName), path.join(destDir, destFileName));
}

function deployRelease(version: string) {
    copy("wwawing-dist.zip", `wwawing-dist-${version}.zip`)
    copy("wwawing-dist.zip", `wwawing-dist-latest.zip`)
    copy("wwawing-update.zip", `wwawing-update-${version}.zip`)
    copy("wwawing-update.zip", `wwawing-update-latest.zip`)
}

// TODO: 配布バージョンがエンジンパージョン依存じゃなくなる時がいずれくるので、その時は考える
const version = "v" + packageJson.devDependencies["@wwawing/engine"];
deployRelease(version);
appendVersionToList(version);
