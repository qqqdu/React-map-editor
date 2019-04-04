import * as constants from '../../constants/layer'
export interface ChangeLayerName {
    type: constants.CHANGE_LAYER_NAME;
    payload: constants.RENAME_INTER;
}
export interface CreateLayer {
    type: constants.CREATE_LAYER;
}
export interface DelLayer {
    type: constants.DEL_LAYER,
    payload: {
        id: number
    }
}
export interface ToggleLayer {
    type: constants.TOGGLE_LAYER,
    payload: {
        id: number
    }
}

export interface SwitchLayer {
    type: constants.SWITCH_LAYER,
    payload: constants.SWITCH_LAYER_PAYLOAD
}
export type layerActions = ChangeLayerName | CreateLayer | DelLayer | ToggleLayer | SwitchLayer

export function cgLayerNameAction(payload: constants.RENAME_INTER): ChangeLayerName {
    return {
        type: constants.CHANGE_LAYER_NAME,
        payload
    }
}
export function createLayer() {
    return {
        type: constants.CREATE_LAYER
    }
}
export function delLayer(payload: {id: number}) {
    return {
        type: constants.DEL_LAYER,
        payload
    }
}
export function toggleLayer(payload: {id: number}) {
    return {
        type: constants.TOGGLE_LAYER,
        payload
    }
}
export function switchLayer(payload: constants.SWITCH_LAYER_PAYLOAD) {
    return {
        type: constants.SWITCH_LAYER,
        payload
    }
}