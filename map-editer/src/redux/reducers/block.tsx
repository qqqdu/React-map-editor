import { blockActions } from '../actions/block';
import {  block, blockItem } from '@/types/block';
import { DEL_BLOCK, CREATE_BLOCK, EDIT_BLOCK } from '@/constants/block';
import { fromJS, Map, List } from 'immutable';
const initState= fromJS({
  blockList: List([])
}); 
export function block(state: Map<string, any> = initState, action: blockActions): Map<any, Array<blockItem>> {
  switch (action.type) {
    case DEL_BLOCK:
      return delBlock(state, action.payload)
    case CREATE_BLOCK:
      return createBlock(state, action.payload)
    case EDIT_BLOCK:
      return editBlock(state, action.payload)
  }
  return state
}
function delBlock(state: Map<any, any>, payload: {id: number}): Map<any, Array<blockItem>> {
  const blocks = (state.get('blockList') as List<blockItem>).toJS()
  blocks.splice(payload.id, 1)
  return state.set('blockList', List(blocks))
}
function createBlock(state: Map<string, any>, payload: blockItem): Map<any, Array<blockItem>> {
  const blocks = (state.get('blockList') as List<blockItem>).toJS()
  blocks.push(payload)
  return state.set('blockList', List(blocks))
}
function editBlock(state: Map<string, any>, payload: {width: number,height: number, id: number}) {
  const blocks = (state.get('blockList') as List<blockItem>).toJS()
  let curBlock = blocks.find(item => {
    return item.id === payload.id
  })
  Object.assign(curBlock, {
    width: payload.width, 
    height: payload.height
  })
  return state.set('blockList', List(blocks))
}