/**
 * 图块组件
 * 图块组件就是网格基本单元
 */


import * as React from 'react';
import '@/style/block.less'
import  { Icon, Popconfirm }  from 'antd/lib'
interface blockItem {
  id: number,
  src: string,
  width: number,
  height: number,
  name: string
}
class Block extends React.Component {
  public blockList:Array<blockItem> = []
  public state = {
    visible: false,
    blockList: this.blockList,
    nowBlock: -1
  }
  constructor(prop:any) {
    super(prop)
  }
  public render() {
    return (
      <div className='block'>
        <h3>图块</h3>        
        <li className='tools'>
          <a href='javascript:;'>
            <label htmlFor='imgUpFile'>
              <Icon type="plus"/>
            </label>
            <input 
              type="file" 
              className="file"
              multiple={ true } 
              id="imgUpFile" 
              onChange={ (ev) => this.changeImg(ev) } />
          </a>

          <Popconfirm title="Are you sure delete this task?"
                      visible={this.state.visible}
                      onVisibleChange={(ev) => {this.handleVisibleChange(ev)}}  
                      onConfirm={() => this.delBlock()} placement='bottom'>
            <a href='javascript:;'>
              <Icon type="delete"/>
            </a>
          </Popconfirm>
        </li>
        <div className='block__content'>
          { this.renderImg() }
        </div>
      </div>
    );
  }
  public renderImg() {
    return this.state.blockList.map(block => {
      return (
        <img 
          src={ block.src } 
          key={ block.id }
          onClick = { ev => this.switchBlock(block.id) }
          style={{
            width: block.width,
            height: block.height,
            border: block.id === this.state.nowBlock ? '1px solid red' : ''
          }}></img>
      )
    })
  }

  public switchBlock(id: number) {
    this.setState({
      nowBlock: id
    })
  }
  public handleVisibleChange(visible:boolean) {
    if (this.state.nowBlock <= 0) {
      this.setState({ visible: false });
      return;
    }
    this.setState({ visible });
  }
  public delBlock() {
    const delId = this.state.blockList.findIndex((block) => {
      return block.id === this.state.nowBlock
    })
    this.state.blockList.splice(delId, 1)
    this.setState({
      blockList: this.state.blockList
    })
  }
  public changeImg(ev:any) {
    const dom = document.getElementById('imgUpFile') as HTMLInputElement
    const files = dom.files as FileList;
    if(!files || !files.length) { return }
    Array.from(files).map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart=function () {
          console.log('文件上传处理......')
      };
      //操作完成
      reader.onload = (e) => {
        const image = new Image();
        image.src = reader.result as string
        image.onload = () => {
          this.state.blockList.push({
            src: reader.result as string,
            width: image.width,
            height: image.height,
            name: file.name,
            id: Math.random()
          })
          this.setState({
            blockList: this.state.blockList
          })
        };
      }
    })
  }
}

export default Block;