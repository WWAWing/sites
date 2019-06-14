const releases = require("../releases.json");
const pug = require("pug");
const fs = require("fs");

const compile = pug.compileFile("index.pug", { pretty: true });
html = compile(releases);
fs.writeFileSync("../docs/index.html", html + "\n");
