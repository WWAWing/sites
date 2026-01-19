import { data } from "../releases.json";
import pug from "pug";
import fs from "fs";

const compile = pug.compileFile("./scripts/index.pug", { pretty: true });

const html = compile({
  data,
  stableLatestVersion: data.stable.releases[0].version,
  unstableLatestVersion: data.unstable.releases[0].version,
});
fs.writeFileSync("./wwawing.com/downloads/index.html", html + "\n");
