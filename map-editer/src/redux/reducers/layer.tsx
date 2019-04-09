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
import { fromJS, Map, List } from 'immutable';
// import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from '../../constants/layer';
const initState = fromJS({
  layers: List([]),
  curBlock: undefined,
  curLayerId: -1,
  tableCol: 20,
  tableRow: 10,
  boxWidth: 50,
  boxHeight: 50
});

// const initState = fromJS({
//   layers: [],
//   curBlock: undefined,
//   curLayerId: -1,
//   tableCol: 20,
//   tableRow: 10,
//   boxWidth: 50,
//   boxHeight: 50
// })
function cgLayerName(state: Map<any, any>, payload: { id: number; name: string }) {
  const layers:Array<LayerItem> = state.get('layers').toJS()
  const layer = layers.find(item => {
    return item.id === payload.id;
  }) as LayerItem;
  layer.name = payload.name;
  return state.set('layers', List(layers))
}
function createLayer(state: Map<any, any>, payload: { id: number }): Map<any, any> {
  let maxNumberItem = {
    sort: -1
  };
  const cloneLayers:Array<LayerItem> = state.get('layers').toJS()
  if (cloneLayers.length) {
    maxNumberItem = cloneLayers.reduce((val1, val2) => {
      if (!val2) return val1;
      return val1.sort > val2.sort ? val1 : val2;
    });
  }
  const layers:Array<LayerItem> = state.get('layers').toJS()
  layers.push({
    id: payload.id,
    name: "string",
    sort: maxNumberItem.sort + 1,
    show: true,
    matrix: []
  });
  return state.set('layers', List(layers))
}
function delLayer(state: Map<any, any>, payload: { id: number }): Map<any, any> {
  const layers:Array<LayerItem> = state.get('layers').toJS()
  layers.splice(payload.id, 1);
  return state.set('layers', List(layers))
}
function toggleLayer(state:  Map<any, any>, payload: { id: number }):  Map<any, any> {
  const layers:Array<LayerItem> = state.get('layers').toJS()
  layers.map(val => {
    if (payload.id === val.id) {
      return Object.assign({}, val, {
        show: !val.show
      });
    }
    return val;
  })
  return state.set('layers', List(layers))
}
function switchLayer(state: Map<any, any>, payload: SWITCH_LAYER_PAYLOAD): Map<any, any> {
  const index = payload.index;
  const layers:Array<LayerItem> = state.get('layers').toJS()

  if (payload.type === upDown.DOWN) {
    if (index === layers.length - 1) {
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
  return state.set('layers', List(layers))
}
function createMatrix(state: Map<any, any>, payload: number): Map<any, any> {
  const layers:Array<LayerItem> = state.get('layers').toJS()
  const tableRow = state.get('tableRow'),
        tableCol = state.get('tableRow'),
        boxWidth = state.get('boxWidth'),
        boxHeight = state.get('boxHeight')
  const map = [];
  for (let i = 0; i < tableRow; i++) {
    const row = [];
    for (let j = 0; j < tableCol; j++) {
      const col = {
        src: undefined,
        width: boxWidth,
        row: tableRow,
        col: tableCol,
        height: boxHeight
      };
      row.push(col);
    }
    map.push(row);
  }
  const layer = layers.find(item => {
    return item.id === payload
  }) as LayerItem;
  layer.matrix = map
  return state.set('layers', List(layers)).set('matrix', map)
}
function drawMatrix(state: Map<any, any>, matrixArr: Array<{x:number, y: number}>) {
  const curLayerId = state.get('curLayerId'),
        curBlock = state.get('curBlock')
  if(curLayerId < 0 || !curBlock) {
    return state
  }
  const layers:Array<LayerItem> = state.get('layers').toJS()
  const layer = layers.find(item => {
    return item.id === curLayerId 
  }) as LayerItem
  matrixArr.map((matrix) => {
    const x = matrix.x
    const y = matrix.y
    layer.matrix[x][y] = Object.assign({}, layer.matrix[x][y],{
      src: curBlock.src,
      height: curBlock.height,
      width: curBlock.width,
    })
  })
  return state.set('layers', List(layers))
}

function setBlockState(state: Map<any, any>, payload: blockItem): Map<any, any> {
  return state.set('curBlock', payload)
}
function setLayerState(state: Map<any, any>, payload: number): Map<any, any> {
  return state.set('curLayerId', payload)

}

function layerReducer(state: Map<any, any> = initState, action: layerActions): Map<any, any> {
  
  switch (action.type) {
    case CHANGE_LAYER_NAME:
      return cgLayerName(state, action.payload);
    case CREATE_LAYER:
      return createLayer(state, action.payload);
    case DEL_LAYER:
      return delLayer(state, action.payload)
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