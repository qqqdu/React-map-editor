/**
 * 图块组件
 * 图块组件就是网格基本单元
 */

import * as React from 'react'
import { connect } from 'react-redux'
import '@/style/block.less'
import { Icon, Popconfirm, Modal, Form, InputNumber } from 'antd/lib'
import * as Actions from '@/redux/actions/block'
import { blockItem } from '@/types/block'
import { layer } from '@/types/layer'
import * as LayerActions from '@/redux/actions/layer'
import { Map } from 'immutable'
interface Props {
  blockList: Array<blockItem>
  delBlock: (payload: { id: number }) => void
  createBlock: (payload: blockItem) => void
  setCurBlock: (payload: blockItem | undefined) => void
  editBlock: (payload: {width: number, height: number, id: number}) => void;
  curBlock: blockItem
}
class BLockCom extends React.Component<Props, {}> {
  public blockList: Array<blockItem> = []
  public state = {
    visible: false,
    nowBlock: -1,
    showNature: false,
    width: 0,
    height: 0
  }
  constructor(props: Props) {
    super(props)
  }
  public render() {
    return (
      <div className="block">
        <h3>图块</h3>
        <li className="tools">
          <a href="javascript:;">
            <label htmlFor="imgUpFile">
              <Icon type="plus" />
            </label>
            <input
              type="file"
              className="file"
              multiple={true}
              id="imgUpFile"
              onChange={ev => this.changeImg(ev)}
            />
          </a>
          <a href="javascript:;">
            <Icon
              type="edit"
              onClick={() => {
                this.showConfirm()
              }}
            />
          </a>
          <Popconfirm
            title="Are you sure delete this task?"
            visible={this.state.visible}
            onVisibleChange={ev => {
              this.handleVisibleChange(ev)
            }}
            onConfirm={() => this.delBlock()}
            placement="bottom"
          >
            <a href="javascript:;">
              <Icon type="delete" />
            </a>
          </Popconfirm>
        </li>
        <div className="block__content">{this.renderImg()}</div>
        {this.renderNatureModel()}
      </div>
    )
  }
  public renderImg() {
    return this.props.blockList.map(block => {
      return (
        <img
          src={block.src}
          key={block.id}
          onClick={ev => this.switchBlock(block.id)}
          style={{
            width: block.width,
            height: block.height,
            border: block.id === this.state.nowBlock ? '1px solid red' : ''
          }}
        />
      )
    })
  }

  public showConfirm() {
    if (!this.props.curBlock) {
      return
    }
    this.setState({
      showNature: true,
      width: this.props.curBlock.width,
      height: this.props.curBlock.height
    })
  }
  public renderNatureModel() {
    return (
      <Modal
        title="图块属性"
        visible={this.state.showNature}
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <Form layout="inline">
          <Form.Item label="图块宽度">
            <InputNumber
              value={this.state.width}
              onChange={ev => {
                this.changeWidth(ev as number)
              }}
            />
          </Form.Item>
          <Form.Item label="图块高度">
            <InputNumber
              value={this.state.height}
              onChange={ev => {
                this.changeHeight(ev as number)
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
  public changeWidth(ev: number) {
    this.setState({
      width: ev
    })
  }
  public changeHeight(ev: number) {
    this.setState({
      height: ev
    })
  }
  public handleOk() {
    this.setState({
      showNature: false
    })
    this.props.editBlock({
      width: this.state.width,
      height: this.state.height,
      id: this.props.curBlock.id
    })
    setTimeout(()=>{
      this.switchBlock(this.props.curBlock.id)
    })
  }
  public handleCancel() {
    this.setState({
      showNature: false
    })
  }
  public switchBlock(id: number) {
    this.setState({
      nowBlock: id
    })
    console.log(this.props.blockList)
    const curBlock = this.props.blockList.find(block => {
      return block.id === id
    })
    console.log('设置当前图块')
    console.log(curBlock)
    this.props.setCurBlock(curBlock)
  }
  public handleVisibleChange(visible: boolean) {
    if (this.state.nowBlock <= 0) {
      this.setState({ visible: false })
      return
    }
    this.setState({ visible })
  }
  public delBlock() {
    const delId = this.props.blockList.findIndex(block => {
      return block.id === this.state.nowBlock
    })
    this.props.delBlock({
      id: delId
    })
    this.setState({
      nowBlock: -1
    })
  }
  public changeImg(ev: any) {
    const dom = document.getElementById('imgUpFile') as HTMLInputElement
    const files = dom.files as FileList
    if (!files || !files.length) {
      return
    }
    Array.from(files).map(file => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadstart = function() {
        console.log('文件上传处理......')
      }
      //操作完成
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result as string
        image.onload = () => {
          this.props.createBlock({
            src: reader.result as string,
            width: image.width,
            height: image.height,
            name: file.name,
            id: Math.random()
          })
        }
      }
    })
  }
}

export function mapStateToProps(StoreState: Map<string, any>) {
  const block = StoreState.get('block').toJS().blockList
  const layer = StoreState.get('layer').present as layer
  return {
    blockList: block,
    curBlock: layer.curBlock
  }
}
function mapDispatchToProps(dispatch: any) {
  return {
    delBlock: (payload: { id: number }) => dispatch(Actions.DelBlock(payload)),
    createBlock: (payload: blockItem) => dispatch(Actions.createBlock(payload)),
    setCurBlock: (payload: blockItem) =>
      dispatch(LayerActions.setCurBlock(payload)),
    editBlock: (payload: { width: number; height: number; id: number }) =>
      dispatch(Actions.editBlock(payload))
  }
}
// 合并方法和属性到 Props 上
function mergeProps(stateProps: any, dispatchProps: any, ownProps: any) {
  return { ...ownProps, ...stateProps, ...dispatchProps }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(BLockCom)
