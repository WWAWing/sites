import { releaseUnits } from "../releases.json";
import { type Version, stringifyVersion, stringifyMainVersion, parseVersion } from "./version-utils";
import fs from "fs";
import path from "path";

// releases.json に引数で与えられたバージョンを追記します。
// バージョン内容をパースし、然るべき位置に該当バージョンを追記します。
const releasesJson = path.join(".", "releases.json");

function writeReleasesJson(newReleaseUnits: typeof releaseUnits) {
    fs.writeFileSync(releasesJson, JSON.stringify({ releaseUnits: newReleaseUnits }) + "\n");
}

function appendVersionToList(version: Version) {
    const stringVersion = stringifyVersion(version);
    const newRelease = { version: stringVersion };

    // 安定版
    if (!version.prerelease) {
        releaseUnits.unshift({ stable: newRelease });
        writeReleasesJson(releaseUnits);
        return;
    }
    const unitIndex = releaseUnits.findIndex(unit => version.prerelease && unit.stable.version === stringifyMainVersion(version.prerelease.baseVersion));
    const targetUnit = releaseUnits[unitIndex];
    if (unitIndex === -1) {
        throw new Error("まだリリースされていない stable バージョンが base に指定されています");
    }

    // 不安定版: base になっている 安定版にまだ不安定版が 1 つも登録されていない
    if (!targetUnit.unstable) {
        releaseUnits[unitIndex].unstable = [{
            tagName: version.prerelease.tagName,
            releases: [newRelease]
        }];
        writeReleasesJson(releaseUnits);
        return;
    }

    const tagIndex = targetUnit.unstable.findIndex(u => version.prerelease && u.tagName === version.prerelease.tagName);
    // 不安定版: base になっている安定版に不安定版は 1 つ以上登録されているが、同一タグを持つバージョンが 1 つも登録されていない
    if (tagIndex === -1) {
        releaseUnits[unitIndex].unstable = [{
            tagName: version.prerelease.tagName,
            releases: [newRelease]
        }];
        writeReleasesJson(releaseUnits);
        return;
    }
    // 不安定版: 既に同一baseかつ同一タグのバージョンが登録されている
    releaseUnits[unitIndex].unstable![tagIndex].releases = [
        newRelease,
        ...targetUnit.unstable[tagIndex].releases
    ];
    writeReleasesJson(releaseUnits);

}

if (process.argv.length < 3 || !process.argv[2]) {
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} X.X.X`);
    console.error("X.X.X is release version.")
    process.exit();
}

const version = process.argv[2];

appendVersionToList(parseVersion(version));
