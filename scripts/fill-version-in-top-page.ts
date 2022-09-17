import { readFileSync, writeFileSync }from "fs"
import { join as pathJoin } from "path";
import { releaseUnits } from "../releases.json";
import escape from "escape-html";

const target = pathJoin("wwawing.com", "index.html");
const replacement = "{{ ##FILL_LATEST_VERSION## }}";

writeFileSync(target, readFileSync(target).toString("utf8").replace(replacement, escape(`v${releaseUnits[0].stable.version}`)));
