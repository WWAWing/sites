import releases from "../releases.json";
import pug from "pug";
import fs from "fs";

const compile = pug.compileFile("./scripts/index.pug", { pretty: true });

const html = compile({ ...releases, latestVersion: releases.releaseUnits[0].stable.version });
fs.writeFileSync("./wwawing.com/downloads/index.html", html + "\n");
