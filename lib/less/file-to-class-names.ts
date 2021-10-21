import camelcase from "camelcase";
import fs from "fs";
import less from "less";
import paramCase from "param-case";
import { sourceToClassNames } from "./source-to-class-names";

const NpmImportPlugin = require("less-plugin-npm-import");
const CssModulesLessPlugin = require("less-plugin-css-modules").default;

export type ClassName = string;
export type ClassNames = ClassName[];

export type NameFormat = "camel" | "kebab" | "param" | "dashes" | "none";

export interface Options {
  includePaths?: string[];
  nameFormat?: NameFormat;
  verbose?: boolean;
}

export const NAME_FORMATS: NameFormat[] = [
  "camel",
  "kebab",
  "param",
  "dashes",
  "none"
];

export const fileToClassNames = (
  filepath: string,
  { nameFormat = "camel" }: Options = {} as Options
) => {
  const transformer = classNameTransformer(nameFormat);
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  }).then(fileContents => {
    return less
      .render(fileContents, {
        filename: filepath,
        plugins: [
          new NpmImportPlugin({ prefix: "~" }),
          new CssModulesLessPlugin({ mode: "global" })
        ]
      })
      .then((output: Less.RenderOutput) => {
        return sourceToClassNames(output.css).then(({ exportTokens }) => {
          const classNames = Object.keys(exportTokens);
          const transformedClassNames = classNames.map(transformer);

          return transformedClassNames;
        });
      });
  });
};

interface Transformer {
  (className: string): string;
}

const classNameTransformer = (nameFormat: NameFormat): Transformer => {
  switch (nameFormat) {
    case "kebab":
    case "param":
      return className => paramCase(className);
    case "camel":
      return className => camelcase(className);
    case "dashes":
      return className =>
        /-/.test(className) ? camelcase(className) : className;
    case "none":
      return className => className;
  }
};
