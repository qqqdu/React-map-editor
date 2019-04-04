export const CHANGE_LAYER_NAME = 'CHANGE_LAYER_NAME';
export type CHANGE_LAYER_NAME = typeof CHANGE_LAYER_NAME;
// 修改layer name 接口参数
export interface RENAME_INTER {
  name: string,
  id: number
}
// 新建图层
export const CREATE_LAYER = 'CREATE_LAYER';
export type CREATE_LAYER = typeof CREATE_LAYER
// 删除图层
export const DEL_LAYER = 'DEL_LAYER';
export type DEL_LAYER = typeof DEL_LAYER
// toggle 图层
export const TOGGLE_LAYER = 'TOGGLE_LAYER'
export type TOGGLE_LAYER = typeof TOGGLE_LAYER
// switch 图层位置

export enum upDown {UP, DOWN}
export interface SWITCH_LAYER_PAYLOAD {
    index: number;
    type: upDown;
}
export const SWITCH_LAYER = 'SWITCH_LAYER'
export type SWITCH_LAYER = typeof SWITCH_LAYER