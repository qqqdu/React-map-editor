import * as constants from '../../constants/block'
import { blockItem } from '@/types/block'
export interface DelBlock {
  type: constants.DEL_BLOCK
  payload: {
    id: number
  }
}
export interface CreateBlock {
  type: constants.CREATE_BLOCK
  payload: blockItem
}
export interface EditBlock {
  type: constants.EDIT_BLOCK
  payload: {
    width: number
    height: number,
    id: number,
    extra: Array<any>
  }
}
export interface ImportBLOCK {
    type: constants.IMPORT_BLOCK;
    payload: Array<any>
}

export type blockActions = DelBlock | CreateBlock | EditBlock | ImportBLOCK

export function DelBlock(payload: { id: number }): DelBlock {
  return {
    type: constants.DEL_BLOCK,
    payload
  }
}
export function createBlock(payload: blockItem): CreateBlock {
  return {
    type: constants.CREATE_BLOCK,
    payload
  }
}
export function editBlock(payload: {
  width: number
  height: number,
  id: number,
  extra: Array<any>
}): EditBlock {
  return {
    type: constants.EDIT_BLOCK,
    payload
  }
}
export function importBLock(payload: Array<any>): ImportBLOCK {
  return {
    type: constants.IMPORT_BLOCK,
    payload
  }
}
