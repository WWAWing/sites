import { readFileSync, writeFileSync }from "fs"
import { join as pathJoin } from "path";
import { version } from "@wwawing/all/package.json";
import * as escape from "escape-html";

const target = pathJoin("wwawing.com", "index.html");
const replacement = "{{ ##FILL_LATEST_VERSION## }}";

writeFileSync(target,readFileSync(target).toString("utf8").replace(replacement, escape(`v${version}`)));
