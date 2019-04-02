import { EnthusiasmAction } from '../actions/layer';
import { layer } from '../../types/layer';
// import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from '../../constants/layer';
const initState= {
  layers: []
}; 
export function layer(state: layer = initState, action: EnthusiasmAction): layer {
  console.log(state)
  
  
  return state
}