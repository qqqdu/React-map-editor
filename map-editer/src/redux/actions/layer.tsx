import * as constants from "../../constants/layer";
import { blockItem } from '@/types/block'

export interface ChangeLayerName {
  type: constants.CHANGE_LAYER_NAME;
  payload: constants.RENAME_INTER;
}
export interface CreateLayer {
  type: constants.CREATE_LAYER;
  payload: {
    id: number;
  };
}
export interface DelLayer {
  type: constants.DEL_LAYER;
  payload: {
    id: number;
  };
}
export interface ToggleLayer {
  type: constants.TOGGLE_LAYER;
  payload: {
    id: number;
  };
}

export interface SwitchLayer {
  type: constants.SWITCH_LAYER;
  payload: constants.SWITCH_LAYER_PAYLOAD;
}
export interface CreateMatrix {
  type: constants.CREATE_MATRIX;
  payload: number;
}

export interface SetCurBlock {
    type: constants.SET_CUR_BLOCK;
    payload: blockItem;
}
export interface SetCurLayer {
    type: constants.SET_CUR_LAYER;
    payload: number;
}
export interface DrawMatrix {
    type: constants.DRAW_MATRIX;
    payload: Array<{x:number, y: number}>;
}
export interface SetGridInf {
  type: constants.SET_GRID_INF;
  payload: constants.GRIDINF
}
export type gridActions = SetCurBlock | SetCurLayer
export type layerActions =
  | ChangeLayerName
  | CreateLayer
  | DelLayer
  | ToggleLayer
  | SwitchLayer
  | CreateMatrix
  | SetCurBlock
  | DrawMatrix
  | SetCurLayer
  | SetGridInf

export function cgLayerNameAction(
  payload: constants.RENAME_INTER
): ChangeLayerName {
  return {
    type: constants.CHANGE_LAYER_NAME,
    payload
  };
}
export function createLayer(payload: { id: number }) {
  return {
    type: constants.CREATE_LAYER,
    payload
  };
}
export function delLayer(payload: { id: number }) {
  return {
    type: constants.DEL_LAYER,
    payload
  };
}
export function toggleLayer(payload: { id: number }) {
  return {
    type: constants.TOGGLE_LAYER,
    payload
  };
}
export function switchLayer(payload: constants.SWITCH_LAYER_PAYLOAD) {
  return {
    type: constants.SWITCH_LAYER,
    payload
  };
}
export function createMatrix(payload: number): CreateMatrix {
  return {
    type: constants.CREATE_MATRIX,
    payload
  };
}
export function drawMatrix(payload: Array<{x:number, y: number}>):DrawMatrix {
    return {
        type: constants.DRAW_MATRIX,
        payload
    }
}
export function setCurBlock(payload: blockItem): SetCurBlock {
    return {
        type: constants.SET_CUR_BLOCK,
        payload
    }
}
export function setCurLayer(payload: number): SetCurLayer {
    return {
        type: constants.SET_CUR_LAYER,
        payload
    }
}
export function setGridInf(payload: constants.GRIDINF): SetGridInf {
  return {
    type: constants.SET_GRID_INF,
    payload
  }
}