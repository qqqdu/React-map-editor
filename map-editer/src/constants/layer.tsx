import { matrixItem } from '@/types/index'
export const CHANGE_LAYER_NAME = "CHANGE_LAYER_NAME";
export type CHANGE_LAYER_NAME = typeof CHANGE_LAYER_NAME;
// 修改layer name 接口参数
export interface RENAME_INTER {
  name: string;
  id: number;
}
// 新建图层
export const CREATE_LAYER = "CREATE_LAYER";
export type CREATE_LAYER = typeof CREATE_LAYER;
// 删除图层
export const DEL_LAYER = "DEL_LAYER";
export type DEL_LAYER = typeof DEL_LAYER;
// toggle 图层
export const TOGGLE_LAYER = "TOGGLE_LAYER";
export type TOGGLE_LAYER = typeof TOGGLE_LAYER;
// switch 图层位置

export enum upDown {
  UP,
  DOWN
}
export interface SWITCH_LAYER_PAYLOAD {
  index: number;
  type: upDown;
}
export const SWITCH_LAYER = "SWITCH_LAYER";
export type SWITCH_LAYER = typeof SWITCH_LAYER;

// 创建矩阵
export const CREATE_MATRIX = "CREATE_MATRIX";
export type CREATE_MATRIX = typeof CREATE_MATRIX;
export interface matrixInter {
  matrix: Array<Array<matrixItem>>,
  id: number
}
export const DRAW_MATRIX = "DRAW_MATRIX";
export type DRAW_MATRIX = typeof DRAW_MATRIX
// 设置当前块
export const SET_CUR_BLOCK = 'SET_CUR_BLOCK';
export type SET_CUR_BLOCK = typeof SET_CUR_BLOCK;
// 设置当前图层
export const SET_CUR_LAYER = 'SET_CUR_LAYER';
export type SET_CUR_LAYER = typeof SET_CUR_LAYER
// 设置属性  
export const SET_GRID_INF = 'SET_GRID_INF';
export type SET_GRID_INF = typeof SET_GRID_INF
export interface GRIDINF {
  tableCol: number;
  tableRow: number;
  boxWidth: number;
  boxHeight: number;
}
// 辅助线
export const SHOW_LINE ='SHOW_LINE';
export type SHOW_LINE = typeof SHOW_LINE

// 导入图层
export const IMPORT_LAYER = 'IMPORT_LAYER';
export type IMPORT_LAYER = typeof IMPORT_LAYER