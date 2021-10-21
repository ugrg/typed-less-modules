export interface Styles {
  app: string;
  logo: string;
  appHeader: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
