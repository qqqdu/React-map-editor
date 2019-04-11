import { layerActions } from "../actions/layer";
import { layer, LayerItem } from "../../types/layer";
import { blockItem } from '@/types/block'
import { List } from 'immutable';
import createMatrix from '@/utils/createMatrix'
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
  DRAW_MATRIX,
  SET_GRID_INF,
  GRIDINF
} from "@/constants/layer";
// import matrixReducer from './matrixReducer'
// import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from '../../constants/layer';
const initState = {
  layers: [],
  curBlock: undefined,
  curLayerId: -1,
  tableCol: 20,
  tableRow: 10,
  boxWidth: 50,
  boxHeight: 50,
  past: [],
  future: []
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
    matrix: List([])
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
function createMatrixReducer(state: layer, payload: number): layer {
  const map = createMatrix(state)
  const layers = [...state.layers];
  const layer = layers.find(item => {
    return item.id === payload
  }) as LayerItem;
  layer.matrix = List(map)
  return {...state, layers};
}
function drawMatrixReducer(state: layer, matrixArr: Array<{x:number, y: number}>) {
  console.log('报错')
  if(state.curLayerId < 0 || !state.curBlock) {
    return state
  }
  const layers = [...state.layers]
  const layer = Object.assign({}, layers.find(item => {
    return item.id === state.curLayerId 
  }) as LayerItem)
  matrixArr.map((matrix) => {
    const x = matrix.x
    const y = matrix.y
    if(!layer.matrix.get(x) || !layer.matrix.getIn([x, y])) {
      return matrix
    }
    const item = layer.matrix.getIn([x, y])
    const curBlock = state.curBlock as blockItem
    const obj  = {
      src: curBlock.src,
      height: curBlock.height,
      width: curBlock.width,
      row: item.row,
      col: item.col
    }
    layer.matrix = layer.matrix.setIn([x, y], obj)
    return matrix
  })
  const rLayers = layers.map((item) => {
    if(item.id === state.curLayerId ) {
      console.log(layer)
      return layer
    }
    return item
  })
  console.log(rLayers)
  return {...state, layers: rLayers}
}

function setBlockState(state: layer, payload: blockItem): layer {
  return {...state, curBlock: {...payload}}
}
function setLayerState(state: layer, payload: number): layer {
  return {...state ,curLayerId: payload}
}
function setGridInf(state: layer, payload: GRIDINF) {
  // 生成对应二维矩阵
  const layers = [...state.layers]
  layers.map(item => {
    const matrixArr = item.matrix
    const layerCp:Array<Array <any>> = []
    for(let i = 0;i<payload.tableRow;i++) {
      const layerCpItem: Array <any>= []
      for(let j = 0;j<payload.tableCol;j++) {
        // 之前存在本次也存在，好像不用变
        if(matrixArr.get(i) && matrixArr.getIn([i, j])) {
          layerCpItem[j] = matrixArr.getIn([i, j])
        } else {
          layerCpItem[j] = {
            src: undefined,
            height: payload.boxHeight,
            width: payload.boxWidth,
            row: j,
            col: i
          }
        }
      }
      layerCp[i] = layerCpItem
    }
    item.matrix = List(layerCp)
    return item
  })
  return {...state, ...payload, layers}
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
      return createMatrixReducer(state, action.payload);
    case SET_CUR_BLOCK:
      return setBlockState(state, action.payload)
    case SET_CUR_LAYER:
      return setLayerState(state, action.payload)
    case DRAW_MATRIX:
      return drawMatrixReducer(state, action.payload)
    case SET_GRID_INF:
      return setGridInf(state, action.payload)
    default:
      return { ...state };
  }
}


export default undoable(layerReducer,{
  debug: true
})