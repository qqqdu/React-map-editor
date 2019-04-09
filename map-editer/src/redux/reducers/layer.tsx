import { layerActions } from "../actions/layer";
import { layer, LayerItem } from "../../types/layer";
import { blockItem } from '@/types/block'
import undoable from 'redux-undo'
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
  SET_CUR_LAYER,
  DRAW_MATRIX
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
// const initState = fromJS({
//   layers: [],
//   curBlock: undefined,
//   curLayerId: -1,
//   tableCol: 20,
//   tableRow: 10,
//   boxWidth: 50,
//   boxHeight: 50
// })
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
function drawMatrix(state: layer, matrixArr: Array<{x:number, y: number}>) {
  if(state.curLayerId < 0 || !state.curBlock) {
    return state
  }
  const layers = [...state.layers]
  const layer = layers.find(item => {
    return item.id === state.curLayerId 
  }) as LayerItem
  matrixArr.map((matrix) => {
    const x = matrix.x
    const y = matrix.y
    const curBlock = state.curBlock as blockItem
    layer.matrix[x][y] = Object.assign({}, layer.matrix[x][y],{
      src: curBlock.src,
      height: curBlock.height,
      width: curBlock.width,
    })
  })
  return {...state, layers}
}

function setBlockState(state: layer, payload: blockItem): layer {
  return {...state, curBlock: {...payload}}
}
function setLayerState(state: layer, payload: number): layer {
  return {...state ,curLayerId: payload}
}

function layerReducer(state: layer = initState, action: layerActions): layer {
  
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
    case DRAW_MATRIX:
      return drawMatrix(state, action.payload)
    default:
      return { ...state };
  }
}


const layer = undoable(layerReducer,{
  debug: true
})

export default layer