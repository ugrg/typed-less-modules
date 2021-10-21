export interface Styles {
  someStyles: string;
  nestedClass: string;
  nestedAnother: string;
  nestedType: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
