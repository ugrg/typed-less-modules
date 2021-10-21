import reserved from "reserved-words";

import { ClassName, ClassNames } from "lib/less/file-to-class-names";
import { alerts } from "../core";

export type ExportType = "named" | "default";
export type SplitType = ";" | "," | "";
export const EXPORT_TYPES: ExportType[] = ["named", "default"];
export const INTERFACE_SPLIT: SplitType[] = [";", ",", ""];

const classNameToNamedTypeDefinition = (className: ClassName) =>
  `export const ${className}: string;`;

const classNameToInterfaceKey = (noQuotation: boolean) => (
  className: ClassName
) => {
  return noQuotation && /^[a-zA-Z_]+$/.test(className)
    ? `\n  ${className}: string`
    : `\n  '${className}': string`;
};

const isReservedKeyword = (className: ClassName) =>
  reserved.check(className, "es5", true) ||
  reserved.check(className, "es6", true);

const isValidName = (className: ClassName) => {
  if (isReservedKeyword(className)) {
    alerts.warn(
      `[SKIPPING] '${className}' is a reserved keyword (consider renaming or using --exportType default).`
    );
    return false;
  } else if (/-/.test(className)) {
    alerts.warn(
      `[SKIPPING] '${className}' contains dashes (consider using 'camelCase' or 'dashes' for --nameFormat or using --exportType default).`
    );
    return false;
  }

  return true;
};

export const classNamesToTypeDefinitions = (
  classNames: ClassNames,
  exportType: ExportType,
  noQuotation: boolean,
  split: SplitType
): string | null => {
  if (classNames.length) {
    let typeDefinitions;

    switch (exportType) {
      case "default":
        const toKey = classNameToInterfaceKey(noQuotation);
        typeDefinitions = "export interface Styles {";
        typeDefinitions += classNames.map(toKey).join(split);
        if (split === ";") typeDefinitions += ";";
        typeDefinitions += "\n}\n\n";
        typeDefinitions += "export type ClassNames = keyof Styles;\n\n";
        typeDefinitions += "declare const styles: Styles;\n\n";
        typeDefinitions += "export default styles;\n";
        return typeDefinitions;
      case "named":
        typeDefinitions = classNames
          .filter(isValidName)
          .map(classNameToNamedTypeDefinition);

        // Sepearte all type definitions be a newline with a trailing newline.
        return typeDefinitions.join("\n") + "\n";
      default:
        return null;
    }
  } else {
    return null;
  }
};
