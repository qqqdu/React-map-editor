import { gridActions } from '../actions/grid';
import { SET_CUR_BLOCK, SET_CUR_LAYER } from '@/constants/grid';
import { gridConfig } from '@/types/grid'
import { blockItem } from '@/types/block'

const initState= {
  curBlock: undefined,
  curLayerId: -1,
  tableCol: 20,
  tableRow: 10,
  boxWidth: 50,
  boxHeight: 50
}; 
export function grid(state: gridConfig = initState, action: gridActions): gridConfig {
  console.log('初始化grid')
  console.log(state)
  console.log(action)
  switch (action.type) {
    case SET_CUR_BLOCK:
      return setBlockState(state, action.payload)
    case SET_CUR_LAYER:
      return setLayerState(state, action.payload)
  }
  return {...state}
}
function setBlockState(state: gridConfig, payload: blockItem): gridConfig {
  return {...state, curBlock: {...payload}}
}
function setLayerState(state: gridConfig, payload: number): gridConfig {
  return {...state ,curLayerId: payload}
}