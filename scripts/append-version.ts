import releases from "../releases.json";
import fs from "fs";
import path from "path";

type ReleaseType = "alpha" | "beta" | "stable";

// releases.json に引数で与えられたバージョンを追記します。
// 文字列の "alpha" もしくは "beta" がバージョン名に含まれている場合、それらのバージョンのリストに追記されます。
// alpha, beta版は、それぞれ最新 3件のみ保持します。
const releasesJson = path.join(".", "releases.json");

const UNSTABLE_VERSION_DISPLAY_NUM = 3;

function appendVersionToList(version: string) {
    const releaseType = getReleaseType(version);
    const list = releases[releaseType];

    if (list.releases.find((target) => target === version)) {
        return;
    }
    list.releases.unshift(version);
    if (releaseType !== "stable" && list.releases.length > UNSTABLE_VERSION_DISPLAY_NUM) {
        // 表示最大件数を超えたら最も古いバージョンを消す
        list.releases.pop();
    }
    fs.writeFileSync(releasesJson, JSON.stringify(releases) + "\n");
}

if( process.argv.length < 3 || !process.argv[2]) {
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} X.X.X`);
    console.error("X.X.X is release version.")
    process.exit();
}

function getReleaseType(version: string): ReleaseType  {
    if (version.match(/alpha/)) {
        return "alpha";
    }
    if(version.match(/beta/)) {
        return "beta";
    }
    return "stable"
}

const version = process.argv[2];

appendVersionToList(version);
