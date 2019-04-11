import * as React from 'react';
import './style/App.less';
// import './style/font.less'
import Utils from '@/container/utils'
import Layer from '@/container/layer'
import Block from '@/container/block'
import Grid from '@/container/grid'

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
        <Grid/>
      </div>
    );
  }
}

export default App;
