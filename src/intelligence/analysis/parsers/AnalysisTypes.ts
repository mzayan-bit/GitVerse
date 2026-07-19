export interface AnalysisResult {
  path: string;
  language: string;
  loc: number;
  emptyLines: number;
  commentLines: number;
  codeLines: number;

  imports: string[];
  exports: string[];

  classes: string[];
  functions: string[];
  interfaces: string[];
  enums: string[];
  modules: string[];

  // Metrics that will be computed later
  complexity?: number;
}
