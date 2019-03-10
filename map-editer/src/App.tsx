import * as React from 'react';
import './style/App.less';
// import './style/font.less'
import Utils from './components/utils'
import Layer from './components/layer'
import Block from './components/block'
import Canvas from './components/canvas'

class App extends React.Component {
  public render() {
    return (
      <div className="App" 
            onContextMenu={ (ev) => ev.preventDefault() }
            onDragStart = { (ev) => ev.preventDefault()}
             >
        <Utils/>
        <Layer/>
        <Block/>
        <Canvas/>
      </div>
    );
  }
}

export default App;
