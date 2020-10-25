import * as releases from "../releases.json";
import pug from "pug";
import fs from "fs";

const compile = pug.compileFile("./scripts/index.pug", { pretty: true });
const html = compile(releases);
fs.writeFileSync("./wwawing.com/downloads/index.html", html + "\n");
