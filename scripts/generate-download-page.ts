import * as releases from "../releases.json";
import * as pug from "pug";
import * as fs from "fs";

const compile = pug.compileFile("./scripts/index.pug", { pretty: true });
const html = compile(releases);
fs.writeFileSync("./get.wwawing.com/index.html", html + "\n");
