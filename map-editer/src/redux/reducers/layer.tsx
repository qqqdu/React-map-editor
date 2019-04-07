import { layerActions } from "../actions/layer";
import { layer, LayerItem } from "../../types/layer";
import { blockItem } from '@/types/block'

import {
  CHANGE_LAYER_NAME,
  CREATE_LAYER,
  DEL_LAYER,
  TOGGLE_LAYER,
  SWITCH_LAYER_PAYLOAD,
  upDown,
  SWITCH_LAYER,
  CREATE_MATRIX,
  SET_CUR_BLOCK,
  SET_CUR_LAYER
} from "../../constants/layer";
// import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from '../../constants/layer';
const initState = {
  layers: [],
  curBlock: undefined,
  curLayerId: -1,
  tableCol: 20,
  tableRow: 10,
  boxWidth: 50,
  boxHeight: 50
};

export function layer(state: layer = initState, action: layerActions): layer {
  
  switch (action.type) {
    case CHANGE_LAYER_NAME:
      return cgLayerName(state, action.payload);
    case CREATE_LAYER:
      return createLayer(state, action.payload);
    case DEL_LAYER:
      state.layers.splice(action.payload.id, 1);
    case TOGGLE_LAYER:
      return toggleLayer(state, action.payload);
    case SWITCH_LAYER:
      return switchLayer(state, action.payload);
    case CREATE_MATRIX:
      return createMatrix(state, action.payload);
    case SET_CUR_BLOCK:
      return setBlockState(state, action.payload)
    case SET_CUR_LAYER:
      return setLayerState(state, action.payload)
    default:
      return { ...state };
  }
}
function cgLayerName(state: layer, payload: { id: number; name: string }) {
  const layers = [...state.layers];
  const layer = layers.find(item => {
    return item.id === payload.id;
  }) as LayerItem;
  layer.name = payload.name;
  return { ...state, layers };
}
function createLayer(state: layer, payload: { id: number }): layer {
  let maxNumberItem = {
    sort: -1
  };
  if (state.layers.length) {
    maxNumberItem = state.layers.reduce((val1, val2) => {
      if (!val2) return val1;
      return val1.sort > val2.sort ? val1 : val2;
    });
  }
  const layers = [...state.layers];
  layers.push({
    id: payload.id,
    name: "string",
    sort: maxNumberItem.sort + 1,
    show: true,
    matrix: []
  });
  return { ...state, layers };
}
function toggleLayer(state: layer, payload: { id: number }): layer {
  return Object.assign({}, state, {
    layers: state.layers.map(val => {
      if (payload.id === val.id) {
        return Object.assign({}, val, {
          show: !val.show
        });
      }
      return val;
    })
  });
}
function switchLayer(state: layer, payload: SWITCH_LAYER_PAYLOAD): layer {
  const index = payload.index;
  const layers = [...state.layers];
  if (payload.type === upDown.DOWN) {
    if (index === state.layers.length - 1) {
      return state;
    }
    // 交换位置
    [layers[index], layers[index + 1]] = [layers[index + 1], layers[index]];
  } else {
    if (index === 0) {
      return state;
    }
    [layers[index], layers[index - 1]] = [layers[index - 1], layers[index]];
  }
  return { ...state, layers: layers };
}
function createMatrix(state: layer, payload: number): layer {
  const map = [];
  for (let i = 0; i < state.tableRow; i++) {
    const row = [];
    for (let j = 0; j < state.tableCol; j++) {
      const col = {
        src: undefined,
        width: state.boxWidth,
        row: state.tableRow,
        col: state.tableCol,
        height: state.boxHeight
      };
      row.push(col);
    }
    map.push(row);
  }
  const layers = [...state.layers];
  const layer = layers.find(item => {
    return item.id === payload
  }) as LayerItem;
  layer.matrix = map
  return {...state, layers: layers};
}


function setBlockState(state: layer, payload: blockItem): layer {
  return {...state, curBlock: {...payload}}
}
function setLayerState(state: layer, payload: number): layer {
  return {...state ,curLayerId: payload}
}