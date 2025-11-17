import { data } from "../releases.json";
import { type Version, stringifyVersion, parseVersion } from "./version-utils";
import fs from "fs";
import path from "path";

// releases.json に引数で与えられたバージョンを追記します。
// バージョン内容をパースし、然るべき位置に該当バージョンを追記します。
const releasesJson = path.join(".", "releases.json");

function writeReleasesJson(newData: typeof data) {
    fs.writeFileSync(releasesJson, JSON.stringify({ data: newData }) + "\n");
}

function appendVersionToList(version: Version) {
    const stringVersion = stringifyVersion(version);
    const newRelease = { version: stringVersion };

    // 安定版
    if (version.major === 3) {
        data.stable.releases.unshift(newRelease);
        writeReleasesJson(data);
        return;
    }
    // 不安定版
    if (version.major === 4) {
        data.unstable.releases.unshift(newRelease);
        writeReleasesJson(data);
        return;
    }
    throw new TypeError("Invalid version major number");
}

if (process.argv.length < 3 || !process.argv[2]) {
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} X.X.X`);
    console.error("X.X.X is release version.")
    process.exit();
}

const version = process.argv[2];

appendVersionToList(parseVersion(version));
