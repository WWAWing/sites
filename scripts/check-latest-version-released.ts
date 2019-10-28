import { releases } from "../releases.json";
import { version } from "@wwawing/all/package.json";

// 依存している　@wwawing/all のバージョンが リリースされていなければ exit 1.
if (!releases.includes(`v${version}`)) {
  console.error(`version ${version} has not been released.`);
  process.exit(1);
}
