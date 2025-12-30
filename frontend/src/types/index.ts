export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  issues?: string[];
}

export const IssueType = {
  EMPTY: 'EMPTY',
  OUT_OF_BOUNDS: 'OUT_OF_BOUNDS'
} as const;

export type IssueType = typeof IssueType[keyof typeof IssueType];

export const DesignStatus = {
  UPLOADED: 'UPLOADED',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  ERROR: 'ERROR'
} as const;

export type DesignStatus = typeof DesignStatus[keyof typeof DesignStatus];

export interface Design {
  _id: string;
  filename: string;
  status: DesignStatus;
  createdAt: string;
  svgWidth?: number;
  svgHeight?: number;
  items?: Rectangle[];
  itemsCount?: number;
  coverageRatio?: number;
  issues?: IssueType[];
}
