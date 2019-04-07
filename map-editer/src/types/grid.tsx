
import { blockItem } from './block'
export interface gridConfig {
  curBlock: blockItem | undefined;
  curLayerId: number | undefined;
  tableRow: number;
  tableCol: number;
  // 单元格宽度和高度
  boxWidth: number;
  boxHeight: number;
}