

import {createStore, applyMiddleware} from 'redux';
import * as reducer from '../reducers';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux-immutable'

//创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。
console.log(reducer)
var store = createStore(
    combineReducers(reducer), // 将所有reducer合并成一个大的reducer
    applyMiddleware(thunk) //将所有中间件作为一个数组，并执行,
);

export default store;