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
    id: number
  }
}

export type blockActions = DelBlock | CreateBlock | EditBlock

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
  id: number
}): EditBlock {
  return {
    type: constants.EDIT_BLOCK,
    payload
  }
}
