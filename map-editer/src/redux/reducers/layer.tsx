import { layerActions } from '../actions/layer';
import { layer } from '../../types/layer';
import { CHANGE_LAYER_NAME, CREATE_LAYER, DEL_LAYER, TOGGLE_LAYER, SWITCH_LAYER_PAYLOAD, upDown, SWITCH_LAYER } from '../../constants/layer'
// import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from '../../constants/layer';
const initState= {
  layers: []
}; 

export function layer(state: layer = initState, action: layerActions): layer {
  switch(action.type) {
    case CHANGE_LAYER_NAME: 
      console.log(1)
    case CREATE_LAYER:
      return createLayer(state)
    case DEL_LAYER:
      state.layers.splice(action.payload.id, 1)
    case TOGGLE_LAYER:
      return toggleLayer(state, action.payload)
    case SWITCH_LAYER:
      return switchLayer(state, action.payload)
    default:
      return state
  }
}
function createLayer(state:layer): layer {
  let maxNumberItem = {
    sort: -1
  }
  if(state.layers.length) {
    maxNumberItem = state.layers.reduce((val1, val2) => {
      if(!val2) return val1
      return val1.sort > val2.sort ? val1 : val2
    })
  }
  state.layers.push({
    id: Math.random(),
    name: 'string',
    sort: maxNumberItem.sort + 1,
    show: true
  })
  return Object.assign({}, state)
}
function toggleLayer(state: layer, payload:{id: number}): layer {
  return Object.assign({}, state, {
    layers: state.layers.map((val) => {
      console.log(payload.id ,val.id)
      if(payload.id === val.id) {
        return Object.assign({}, val, {
          show: !val.show
        })
      }
      return val
    })
  })
}
function switchLayer(state: layer, payload: SWITCH_LAYER_PAYLOAD): layer {
  const index = payload.index
  if(payload.type === upDown.DOWN) {
    if(index === state.layers.length - 1) { return state}
    // 交换位置
    [state.layers[index], state.layers[index + 1]] = [state.layers[index + 1], state.layers[index]]
  } else {
    if(index === 0) { return state}
    [state.layers[index], state.layers[index - 1]] = [state.layers[index - 1], state.layers[index]]
  }
  return Object.assign({}, state, {
    layers: state.layers
  })
}