import fs from "fs";
import path from "path";
import slash from "slash";

import { generate, listDifferent, MainOptions, watch } from "./core";

export const main = async (pattern: string, options: MainOptions) => {
  // When the provided pattern is a directory construct the proper glob to find
  // all .less files within that directory. Also, add the directory to the
  // included paths so any imported with a path relative to the root of the
  // project still works as expected without adding many include paths.
  if (fs.existsSync(pattern) && fs.lstatSync(pattern).isDirectory()) {
    if (Array.isArray(options.includePaths)) {
      options.includePaths.push(pattern);
    } else {
      options.includePaths = [pattern];
    }

    // When the pattern provide is a directory, assume all .less files within.
    pattern = slash(path.resolve(pattern, "**/*.less"));
  }

  if (options.listDifferent) {
    listDifferent(pattern, options);
    return;
  }

  if (options.watch) {
    watch(pattern, options);
  } else {
    await generate(pattern, options);
  }
};
