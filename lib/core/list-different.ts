import fs from 'fs';
import glob from 'glob';
import { fileToClassNames } from '../less';
import { classNamesToTypeDefinitions, getTypeDefinitionPath } from '../typescript';

import { alerts } from './alerts';
import { MainOptions } from './types';

export const listDifferent = async (
  pattern: string,
  options: MainOptions
): Promise<void> => {
  // Find all the files that match the provied pattern.
  const files = glob.sync(pattern);

  if (!files || !files.length) {
    alerts.notice('No files found.');
    return;
  }

  // Wait for all the files to be checked.
  await Promise.all(files.map(file => checkFile(file, options))).then(
    results => {
      results.includes(false) && process.exit(1);
    }
  );
};

export const checkFile = (
  file: string,
  options: MainOptions
): Promise<boolean> => {
  return new Promise(resolve =>
    fileToClassNames(file, options).then(classNames => {
      const typeDefinition = classNamesToTypeDefinitions(
        classNames,
        options.exportType,
        options.interfaceNoQuotation,
        options.interfaceSplit
      );

      if (!typeDefinition) {
        // Assume if no type defs are necessary it's fine
        resolve(true);
        return;
      }

      const path = getTypeDefinitionPath(file);

      const content = fs.readFileSync(path, 'utf-8').replace(/\r\n/g, '\n');

      if (content === typeDefinition) {
        resolve(true);
      } else {
        alerts.error(`[INVALID TYPES] Check type definitions for ${file}`);
        resolve(false);
      }
    })
  );
};
