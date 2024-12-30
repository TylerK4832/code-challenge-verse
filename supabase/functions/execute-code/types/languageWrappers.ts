export interface LanguageWrapper {
  wrapCode: (userCode: string, testCodeList: string[]) => string;
}

export interface LanguageConfig {
  id: number;
  name: string;
  wrapper: LanguageWrapper;
}