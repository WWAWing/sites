import { releases } from "../releases.json";
import { version } from "@wwawing/engine/package.json";

// 依存している　@wwawing/engine のバージョンが リリースされていなければ exit 1.
if (!releases.includes(`v${version}`)) {
  console.error(`version ${version} has not been released.`);
  process.exit(1);
}
