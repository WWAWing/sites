import * as releases from "../releases.json";
import * as fs from "fs";
import * as path from "path";
import { version } from "@wwawing/all/package.json";

const srcDir = "./node_modules/@wwawing/all/dist";
const destDir = "get.wwawing.com";
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
    copy("wwawing-dist.zip", `wwawing-dist-v${version}.zip`)
    copy("wwawing-dist.zip", `wwawing-dist-latest.zip`)
    copy("wwawing-update.zip", `wwawing-update-v${version}.zip`)
    copy("wwawing-update.zip", `wwawing-update-latest.zip`)
}

deployRelease(version);
appendVersionToList(version);
