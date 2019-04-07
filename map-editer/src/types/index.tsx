/**
 * 全局类型的定义
 */
import { layer } from './layer'
import { block } from './block'
import { gridConfig } from './grid'
export interface enthusiasm { 
  languageName: string;
  enthusiasmLevel: number;
}
export interface StoreState {
  enthusiasm: enthusiasm;
  layer: layer;
  block: block;
  gridConfig: gridConfig
}

export interface matrixItem {
  src: string | undefined;
  width: number;
  row: number;
  col: number;
  height: number;
}