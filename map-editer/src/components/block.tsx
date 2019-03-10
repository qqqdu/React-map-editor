/**
 * 图块组件
 * 图块组件就是网格基本单元
 */


import * as React from 'react';
import '../style/block.less'

class Block extends React.Component {
  public render() {
    return (
      <div className='block'>
        <h3>图块</h3>
        <li className='tools'>
        </li>
      </div>
    );
  }
}

export default Block;