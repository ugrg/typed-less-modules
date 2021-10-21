const os = require("os");
const { exec } = require("child_process");
switch (os.platform()) {
  case "linux": {
    return exec("rm -rf ./dist").stderr.pipe(process.stderr);
  }
  case "win32": {
    return exec("rmdir /s /q dist").stderr.pipe(process.stderr);
  }
}
