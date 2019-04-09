import { EnthusiasmAction } from '../actions';
import { enthusiasm } from '../../types/index';
import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from '../../constants/index';
import layer from './layer'
import { block } from './block'
const initState= {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
}; 
export function enthusiasm(state: enthusiasm = initState, action: EnthusiasmAction): enthusiasm {
  switch (action.type) {
    case INCREMENT_ENTHUSIASM:
      return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
    case DECREMENT_ENTHUSIASM:
      return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
  }
  return {...state}
}

export { layer, block }