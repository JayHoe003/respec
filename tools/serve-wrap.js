// This file is to serve test stub files without adding any code to load
// local files in ReSpec.
// Use when you need to open a server independently from tests to prevent
// both server and the test framework wait for each other and then timeouts.
//
// Use: `node tools/serve-wrap.js SUBCOMMANDS`
// Example: `node tools/serve-wrap.js npm run test:node-noserver`

const handler = require("serve-handler");
const http = require("http");
const subprocess = require("child_process");

const port = 5000;
const server = http.createServer((request, response) => {
  return handler(request, response, {
    cleanUrls: false, // prevents `path/index` implicitly converted as `path/index.html`
  });
});
server.listen(port);

const subargs = process.argv.slice(2);
const wrappedArgs = subargs.slice(1).map(s => (s.includes(" ") ? `"${s}"` : s));
const child = subprocess.spawn(subargs[0], wrappedArgs, {
  stdio: "inherit", // passthrough any output
  shell: true, // to get $PATH
});

child.on("close", code => {
  server.close();
  process.exit(code);
});
