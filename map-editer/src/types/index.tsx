/**
 * 全局类型的定义
 */
import { layer } from './layer'
export interface enthusiasm { 
  languageName: string;
  enthusiasmLevel: number;
}
export interface StoreState {
  enthusiasm: enthusiasm,
  layer: layer
}