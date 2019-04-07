/**
 * 全局类型的定义
 */
import { blockItem } from './block'
import { matrixItem } from './index'
export interface LayerItem {
  // 图层id
  id: number,
  // 图层名称
  name: string,
  // 排序
  sort: number,
  // 是否显示
  show: boolean,
  matrix: Array<Array<matrixItem>>
}
export interface layer { 
  layers: Array<LayerItem>;
  curBlock: blockItem | undefined;
  curLayerId: number | undefined;
  tableRow: number;
  tableCol: number;
  // 单元格宽度和高度
  boxWidth: number;
  boxHeight: number;
}