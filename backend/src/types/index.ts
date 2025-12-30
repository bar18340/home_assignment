export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

export enum IssueType {
  EMPTY = 'EMPTY',
  OUT_OF_BOUNDS = 'OUT_OF_BOUNDS'
}

export enum DesignStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  ERROR = 'ERROR'
}

export interface RectangleWithIssues extends Rectangle {
  issues?: IssueType[];
}

export interface ProcessedData {
  svgWidth: number;
  svgHeight: number;
  items: RectangleWithIssues[];
  itemsCount: number;
  coverageRatio: number;
  issues: IssueType[];
}
