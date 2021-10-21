#!/usr/bin/env node

import yargs from "yargs";

import { NAME_FORMATS, NameFormat } from "./less";
import { main } from "./main";
import {
  EXPORT_TYPES,
  ExportType,
  INTERFACE_SPLIT,
  SplitType
} from "./typescript";

const nameFormatDefault: NameFormat = "camel";
const exportTypeDefault: ExportType = "default";
const interfaceSplitDefault: SplitType = ",";

const { _: patterns, ...rest } = yargs
  .usage(
    "Generate .less.d.ts from CSS module .less files.\nUsage: $0 <glob pattern> [options]"
  )
  .example("$0 src", "All .less files at any level in the src directoy")
  .example(
    "$0 src/**/*.less",
    "All .less files at any level in the src directoy"
  )
  .example(
    "$0 src/**/*.less --watch",
    "Watch all .less files at any level in the src directoy that are added or changed"
  )
  .example(
    "$0 src/**/*.less --includePaths src/core src/variables",
    'Search the "core" and "variables" directory when resolving imports'
  )
  .demandCommand(1)
  .option("nameFormat", {
    choices: NAME_FORMATS,
    default: nameFormatDefault,
    alias: "n",
    describe: "The name format that should be used to transform class names."
  })
  .option("exportType", {
    choices: EXPORT_TYPES,
    default: exportTypeDefault,
    alias: "e",
    describe: "The type of export used for defining the type defintions."
  })
  .option("watch", {
    boolean: true,
    default: false,
    alias: "w",
    describe:
      "Watch for added or changed files and (re-)generate the type definitions."
  })
  .option("ignoreInitial", {
    boolean: true,
    default: false,
    describe: "Skips the initial build when passing the watch flag."
  })
  .option("listDifferent", {
    boolean: true,
    default: false,
    alias: "l",
    describe:
      "List any type definitions that are different than those that would be generated."
  })
  .option("interfaceNoQuotation", {
    boolean: true,
    default: false,
    alias: "q",
    describe: "如果可以，interface模式下样式名不使用引号包裹。"
  })
  .option("interfaceSplit", {
    choices: INTERFACE_SPLIT,
    default: interfaceSplitDefault,
    alias: "s",
    describe: "选择interface各属性之间的分割符"
  })
  .option("verbose", {
    boolean: true,
    default: false,
    alias: "v",
    describe: "Log additional details to console."
  }).argv;

main(patterns[0], { ...rest });
