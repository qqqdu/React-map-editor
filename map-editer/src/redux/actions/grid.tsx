import * as constants from '../../constants/grid'
import { blockItem } from '@/types/block'
export interface SetCurBlock {
    type: constants.SET_CUR_BLOCK;
    payload: blockItem;
}
export interface SetCurLayer {
    type: constants.SET_CUR_LAYER;
    payload: number;
}

export type gridActions = SetCurBlock | SetCurLayer

export function setCurBlock(payload: blockItem): SetCurBlock {
    return {
        type: constants.SET_CUR_BLOCK,
        payload
    }
}
export function SetCurLayer(payload: number): SetCurLayer {
    return {
        type: constants.SET_CUR_LAYER,
        payload
    }
}