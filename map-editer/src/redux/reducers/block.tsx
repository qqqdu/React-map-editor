import { blockActions } from '../actions/block';
import {  block, blockItem } from '@/types/block';
import { DEL_BLOCK, CREATE_BLOCK } from '@/constants/block';
const initState= {
  blockList: []
}; 
export function block(state: block = initState, action: blockActions): block {
  switch (action.type) {
    case DEL_BLOCK:
      return delBlock(state, action.payload)
    case CREATE_BLOCK:
      return createBlock(state, action.payload)
  }
  return {...state}
}
function delBlock(state: block, payload: {id: number}): block {
  const blocks = [...state.blockList]
  blocks.splice(payload.id, 1)
  return {...state, blockList: blocks}
}
function createBlock(state: block, payload: blockItem): block {
  const blocks = [...state.blockList]
  blocks.push(payload)
  return {...state, blockList: blocks}
}