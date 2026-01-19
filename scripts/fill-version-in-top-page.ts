import { readFileSync, writeFileSync }from "fs"
import { join as pathJoin } from "path";
import { data } from "../releases.json";
import escape from "escape-html";

const target = pathJoin("wwawing.com", "index.html");
const replacementStable = "{{ ##FILL_LATEST_STABLE_VERSION## }}";
const replacementUnstable = "{{ ##FILL_LATEST_UNSTABLE_VERSION## }}";

writeFileSync(
  target,
  readFileSync(target)
    .toString("utf8")
    .replaceAll(replacementStable, escape(`v${data.stable.releases[0].version}`))
    .replaceAll(
      replacementUnstable,
      escape(`v${data.unstable.releases[0].version}`)
    )
);
