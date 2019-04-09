/**
 * 图块组件
 * 图块组件就是网格基本单元
 */


import * as React from 'react';
import { connect } from 'react-redux';
import '@/style/util.less'
import  { Icon, Popconfirm }  from 'antd/lib'
import * as Actions from '@/redux/actions/block'
import { block, blockItem } from '@/types/block';
import { ActionCreators as UndoActionCreators } from 'redux-undo'

interface Props {
  blockList: Array<blockItem>;
  canUndo: Boolean;
  canRedo: Boolean;
  delBlock: (payload:{id: number}) => void;
  createBlock: (payload: blockItem) => void;
  onUndo: () => void;
  onRedo: () => void;
}
class UtilCom extends React.Component<Props, {}> {
  public blockList:Array<blockItem> = []
  public state = {
    visible: false,
    nowBlock: -1
  }
  constructor(props:Props) {
    super(props)
  }
  public render() {
    return (
      <div className='util'>
        <h3>工具栏</h3>        
        <li className='tools'>
          <a href='javascript:;'>
            <label htmlFor='imgUpFile'>
              <Icon type="plus"/>
            </label>
          </a>
          <a href='javascript:;' onClick={() => { this.onUndo() }}>
            <Icon type="undo"/>
          </a>
          <a href='javascript:;' onClick={() => { this.onRedo() }}>
            <Icon type="redo"/>
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
      </div>
    );
  }
  public onUndo() {
    if(!this.props.canUndo) {
      console.log('不能撤销')
      return
    }
    this.props.onUndo()
  }
  public onRedo() {
    if(!this.props.canRedo) {
      console.log('不能取消撤销')
      return
    }
    this.props.onRedo()

  }

  
  public handleVisibleChange(visible:boolean) {
    if (this.state.nowBlock <= 0) {
      this.setState({ visible: false });
      return;
    }
    this.setState({ visible });
  }
  public delBlock() {
    const delId = this.props.blockList.findIndex((block) => {
      return block.id === this.state.nowBlock
    })
    this.props.delBlock({
      id: delId
    })
  }
}

export function mapStateToProps( StoreState: Map<string, any> ) {
  // 问题出现在这里呦  
  return {
    blockList: (StoreState.get('block') as block).blockList,
    canUndo: StoreState.get("layer").past.length > 0,
    canRedo: StoreState.get("layer").future.length > 0
  }
}
function mapDispatchToProps(dispatch:any) {
  return {
      delBlock: (payload: { id: number }) => dispatch(Actions.DelBlock(payload)),
      createBlock: (payload: blockItem) => dispatch(Actions.createBlock(payload)),
      onUndo: () => dispatch(UndoActionCreators.undo()),
      onRedo: () => dispatch(UndoActionCreators.redo())
  }
}
// 合并方法和属性到 Props 上
function mergeProps(stateProps: any, dispatchProps: any, ownProps: any) {
  console.log(ownProps, stateProps, dispatchProps)
  return { ...ownProps, ...stateProps, ...dispatchProps};
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UtilCom)