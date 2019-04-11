/**
 * 图块组件
 * 图块组件就是网格基本单元
 */

import * as React from 'react'
import { connect } from 'react-redux'
import '@/style/util.less'
import { Icon, Select, Modal, InputNumber, Form } from 'antd/lib'
import * as Actions from '@/redux/actions/block'
import * as LayerActions from '@/redux/actions/layer'
import { blockItem } from '@/types/block'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { layer } from '../types/layer'
const Option = Select.Option
import { Map } from 'immutable'
import * as constants from '@/constants/layer'
interface Props {
  blockList: Array<blockItem>
  canUndo: Boolean
  canRedo: Boolean
  layer: layer
  delBlock: (payload: { id: number }) => void
  createBlock: (payload: blockItem) => void
  onUndo: () => void
  onRedo: () => void
  setGridInf: (payload: constants.GRIDINF) => void
}

class UtilCom extends React.Component<Props, {}> {
  public blockList: Array<blockItem> = []
  private meauOptions = {
    label: '菜单',
    options: [
      {
        label: '导出',
        fn: 'showConfirm'
      },
      {
        label: '导入',
        fn: 'showConfirm'
      },
      {
        label: '属性',
        fn: 'showConfirm'
      }
    ]
  }
  public state = {
    visible: false,
    showNature: false,
    nowBlock: -1,
    gridInf: {
      tableRow: 0,
      tableCol: 0,
      boxWidth: 0,
      boxHeight: 0
    }
  }
  constructor(props: Props) {
    super(props)
  }
  public render() {
    return (
      <div className="util">
        <h3>工具栏</h3>
        <li className="tools">
          <Select value={this.meauOptions.label} style={{ width: 120 }}>
            {this.meauOptions.options.map(item => (
              <Option value={item.label} key={item.label}>
                <p
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => {
                    this.showConfirm()
                  }}
                >
                  {item.label}
                </p>
              </Option>
            ))}
          </Select>
          <a
            href="javascript:;"
            onClick={() => {
              this.onUndo()
            }}
          >
            <Icon type="shake" />
          </a>
          <a
            href="javascript:;"
            onClick={() => {
              this.onUndo()
            }}
          >
            <Icon type="undo" />
          </a>
          <a
            href="javascript:;"
            onClick={() => {
              this.onRedo()
            }}
          >
            <Icon type="redo" />
          </a>
        </li>
        {this.renderNatureModel()}
      </div>
    )
  }
  public renderNatureModel() {
    return (
      <Modal
        title="网格属性"
        visible={this.state.showNature}
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <Form layout="inline">
          <Form.Item label="网格X轴数目">
            <InputNumber
              value={this.state.gridInf.tableCol}
              onChange={ev => {
                this.changeCol(ev as number)
              }}
            />
          </Form.Item>
          <Form.Item label="网格Y轴数目">
            <InputNumber
              value={this.state.gridInf.tableRow}
              onChange={ev => {
                this.changeRow(ev as number)
              }}
            />
          </Form.Item>
          <Form.Item label="图块宽度">
            <InputNumber
              value={this.state.gridInf.boxWidth}
              onChange={ev => {
                this.changeWidth(ev as number)
              }}
            />
          </Form.Item>
          <Form.Item label="图块高度">
            <InputNumber
              value={this.state.gridInf.boxHeight}
              onChange={ev => {
                this.changeHeight(ev as number)
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
  public onUndo() {
    if (!this.props.canUndo) {
      console.log('不能撤销')
      return
    }
    this.props.onUndo()
  }
  public onRedo() {
    if (!this.props.canRedo) {
      console.log('不能取消撤销')
      return
    }
    this.props.onRedo()
  }
  public handleOk() {
    this.setState({
      showNature: false
    })
    this.props.setGridInf(this.state.gridInf)
  }
  public changeCol(ev: number) {
    this.setState((prevState: any) => ({
      gridInf: {
        ...prevState.gridInf,
        tableCol: ev
      }
    }))
  }
  public changeRow(ev: number) {
    this.setState((prevState: any) => ({
      gridInf: {
        ...prevState.gridInf,
        tableRow: ev
      }
    }))
  }
  public changeWidth(ev: number) {
    this.setState((prevState: any) => ({
      gridInf: {
        ...prevState.gridInf,
        boxWidth: ev
      }
    }))
  }
  public changeHeight(ev: number) {
    this.setState((prevState: any) => ({
      gridInf: {
        ...prevState.gridInf,
        boxHeight: ev
      }
    }))
  }
  public handleCancel() {
    this.setState({
      showNature: false
    })
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
  }
  public showConfirm() {
    this.setState({
      showNature: true,
      gridInf: {
        tableCol: this.props.layer.tableCol,
        tableRow: this.props.layer.tableRow,
        boxHeight: this.props.layer.boxHeight,
        boxWidth: this.props.layer.boxWidth
      }
    })
  }
}

export function mapStateToProps(StoreState: Map<string, any>) {
  const layer = StoreState.getIn(['layer'])
  const block = StoreState.getIn(['block', 'blockList']).toJS()
  // 问题出现在这里呦
  return {
    blockList: block,
    canUndo: layer.past && layer.past.length > 0,
    canRedo: layer.future && layer.future.length > 0,
    layer: layer.present
  }
}
function mapDispatchToProps(dispatch: any) {
  return {
    delBlock: (payload: { id: number }) => dispatch(Actions.DelBlock(payload)),
    createBlock: (payload: blockItem) => dispatch(Actions.createBlock(payload)),
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo()),
    setGridInf: (payload: constants.GRIDINF) =>
      dispatch(LayerActions.setGridInf(payload))
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
)(UtilCom)
