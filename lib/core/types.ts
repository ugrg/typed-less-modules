import { Options } from "../less";
import { ExportType, SplitType } from "../typescript";

export interface MainOptions extends Options {
  exportType: ExportType;
  listDifferent: boolean;
  watch: boolean;
  ignoreInitial: boolean;
  interfaceNoQuotation: boolean;
  interfaceSplit: SplitType;
}
