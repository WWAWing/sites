export interface MainVersion {
    major: number;
    minor: number;
    patch: number;
}

export interface Version extends MainVersion {
    prerelease?: Prerelease;
}

export interface Prerelease {
    tagName: string;
    baseVersion: MainVersion;
    prepatch?: number;

}

export function stringifyPrerelease({ tagName, baseVersion, prepatch }: Prerelease): string {
    return `${tagName}.based-on.${baseVersion.major}.${baseVersion.minor}.${baseVersion.patch}.p.${prepatch}`;
}

export function stringifyVersion({ prerelease, ...mainVersion }: Version): string {
    const _mainVersion = stringifyMainVersion(mainVersion);
    return prerelease ? `${_mainVersion}.${stringifyPrerelease(prerelease)}` : _mainVersion;
}

export function stringifyMainVersion({ major, minor, patch }: MainVersion): string {
    return `${major}.${minor}.${patch}`;
}

export function parsePrerelease(preRelease: string): Prerelease {
    const matches = preRelease.match(/^([a-zA-Z]+)\.based-on\.(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.p\.(0|[1-9]\d*))?$/);
    if (!matches || matches.length < 5) {
        throw new Error("プレリリースのフォーマットを満たしていません");
    }
    return {
        tagName: matches[1],
        baseVersion: {
            major: parseInt(matches[2], 10),
            minor: parseInt(matches[3], 10),
            patch: parseInt(matches[4], 10)
        },
        prepatch: matches.length < 6 ? undefined : parseInt(matches[5], 10)
    }
}

export function parseVersion(version: string): Version {
    // 以下より引用しました
    // (C) Tom Preston-Werner CC-BY 3.0
    // https://semver.org/lang/ja/#semver%E6%96%87%E5%AD%97%E5%88%97%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AB%E6%8E%A8%E5%A5%A8%E3%81%95%E3%82%8C%E3%82%8B%E6%AD%A3%E8%A6%8F%E8%A1%A8%E7%8F%BEregex%E3%81%AF%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99%E3%81%8B
    const matches = version.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/);
    if (!matches || matches.length < 4) {
        throw new Error("バージョンのフォーマットを満たしていません");
    }
    return {
        major: parseInt(matches[1], 10),
        minor: parseInt(matches[2], 10),
        patch: parseInt(matches[3], 10),
        prerelease: matches.length < 5 ? undefined : parsePrerelease(matches[4])
    }
}

