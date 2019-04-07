import * as constants from '../../constants/block'
import { blockItem } from '@/types/block'
export interface DelBlock {
    type: constants.DEL_BLOCK;
    payload: {
      id: number
    }
}
export interface CreateBlock {
    type: constants.CREATE_BLOCK;
    payload: blockItem;
}

export type blockActions = DelBlock | CreateBlock

export function DelBlock(payload: {id: number}): DelBlock {
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