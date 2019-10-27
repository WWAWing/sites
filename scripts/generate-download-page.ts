import * as releases from "../releases.json";
import * as pug from "pug";
import * as fs from "fs";

const compile = pug.compileFile("./scripts/index.pug", { pretty: true });
const html = compile(releases);
fs.writeFileSync("./wwawing.com/downloads/index.html", html + "\n");
