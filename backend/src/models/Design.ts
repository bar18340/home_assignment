import mongoose, { Document, Schema } from 'mongoose';
import { DesignStatus, IssueType, RectangleWithIssues } from '../types';

export interface IDesign extends Document {
  filename: string;
  status: DesignStatus;
  createdAt: Date;
  svgWidth?: number;
  svgHeight?: number;
  items?: RectangleWithIssues[];
  itemsCount?: number;
  coverageRatio?: number;
  issues?: IssueType[];
  filePath: string;
}

const RectangleSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  fill: { type: String, required: true },
  issues: [{ type: String, enum: Object.values(IssueType) }]
}, { _id: false });

const DesignSchema = new Schema<IDesign>({
  filename: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(DesignStatus),
    default: DesignStatus.UPLOADED,
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  svgWidth: { type: Number },
  svgHeight: { type: Number },
  items: [RectangleSchema],
  itemsCount: { type: Number },
  coverageRatio: { type: Number },
  issues: [{ type: String, enum: Object.values(IssueType) }],
  filePath: { type: String, required: true }
});

export const Design = mongoose.model<IDesign>('Design', DesignSchema);
