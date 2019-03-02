import * as React from 'react';
import './App.css';

import Utils from './components/utils'
import Layer from './components/layer'
import Block from './components/block'
import Canvas from './components/canvas'

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Utils/>
        <Layer/>
        <Block/>
        <Canvas/>
      </div>
    );
  }
}

export default App;
