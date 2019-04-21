/**
 * 图块组件
 * 图块组件就是网格基本单元
 */

import * as React from 'react'
import { connect } from 'react-redux'
import '@/style/util.less'
import {
  Icon,
  Select,
  Modal,
  InputNumber,
  Form,
  Row,
  Col,
  Input
} from 'antd/lib'
import * as Actions from '@/redux/actions/block'
import * as LayerActions from '@/redux/actions/layer'
import { blockItem } from '@/types/block'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { layer } from '../types/layer'
const Option = Select.Option
import { Map } from 'immutable'
import * as constants from '@/constants/layer'
import { saveFile, importFile, saveGameFile } from '@/utils/saveFile'
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
  switchShowLine: () => void
  importBlock: (payload: Array<any>) => void
  importLayer: (payload: any) => void
  switchEraser: () => void
  store: Map<string, any>
}

class UtilCom extends React.Component<Props, {}> {
  public blockList: Array<blockItem> = []
  public state = {
    visible: false,
    showNature: false,
    nowBlock: -1,
    // 是否新建
    isCreate: false,
    showExport: false,
    mapType: 1,
    gridInf: {
      tableRow: 0,
      tableCol: 0,
      boxWidth: 0,
      boxHeight: 0,
      name: ''
    }
  }
  constructor(props: Props) {
    super(props)
  }
  public render() {
    let check
    if (this.props.layer.showLine) {
      check = <Icon type="check" style={{ color: '#08c' }} />
    }
    let eraser
    if (this.props.layer.eraser) {
      eraser = (
        <a
          href="javascript:;"
          style={{ color: '#08c' }}
          onClick={() => {
            this.switchEraser()
          }}
        >
          <Icon type="shake" />
        </a>
      )
    } else {
      eraser = (
        <a
          href="javascript:;"
          onClick={() => {
            this.switchEraser()
          }}
        >
          <Icon type="shake" />
        </a>
      )
    }
    return (
      <div className="util">
        <li className="tools">
          <Select value="菜单" style={{ width: 120 }}>
            <Option
              value="新建"
              className={!this.props.layer.name ? 'show' : 'hidden'}
            >
              <p
                style={{ width: '100%', height: '100%' }}
                onClick={() => {
                  // this.importJson()
                  this.showConfirm(true)
                }}
              >
                新建
              </p>
            </Option>
            <Option value="导入">
              <label htmlFor="jsonUpFile">导入</label>
              <input
                type="file"
                className="file"
                multiple={false}
                id="jsonUpFile"
                onChange={ev => this.importJson(ev)}
              />
            </Option>
            <Option
              value="导出"
              className={this.props.layer.name ? 'show' : 'hidden'}
            >
              <p
                style={{ width: '100%', height: '100%' }}
                onClick={() => {
                  this.exportJson()
                }}
              >
                导出
              </p>
            </Option>
            <Option value="显示网格">
              <p
                style={{ width: '100%', height: '100%' }}
                onClick={() => {
                  this.showHelpLine()
                }}
              >
                显示网格
              </p>
              {check}
            </Option>
            <Option
              value="属性"
              className={this.props.layer.name ? 'show' : 'hidden'}
            >
              <p
                style={{ width: '100%', height: '100%' }}
                onClick={() => {
                  this.showConfirm()
                }}
              >
                属性
              </p>
            </Option>
          </Select>
          {eraser}
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
        {this.renderExportModel()}
      </div>
    )
  }
  public switchEraser() {
    this.props.switchEraser()
  }
  public exportJson() {
    this.setState({
      showExport: true
    })
  }
  public importJson(ev: any) {
    const dom = document.getElementById('jsonUpFile') as HTMLInputElement
    const files = dom.files as FileList
    if (!files || !files.length) {
      return
    }
    Array.from(files).map(file => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onloadstart = function() {
        console.log('文件上传处理......')
      }
      console.log(file)
      //操作完成
      reader.onload = () => {
        const state: any = importFile(
          reader.result as string,
          file.name.split('.')[0]
        )
        this.props.importBlock(state.block.blockList)
        this.props.importLayer(state.layer)
      }
    })
  }
  public showHelpLine() {
    this.props.switchShowLine()
  }
  public renderExportModel() {
    return (
      <Modal
        title="选择导出类型"
        onOk={() => this.handleExportOk()}
        onCancel={() => this.handleExportCancel()}
        visible={this.state.showExport}
      >
        <a
          href="javascript:;"
          className={this.state.mapType === 1 ? 'choose export_choose' : 'export_choose'}
          onClick={() => {
            this.setState({ mapType: 1 })
          }}
        >
          Map 地图文件<span>(可再次导入进行编辑)</span>
        </a>
        <a
          href="javascript:;"
          className={this.state.mapType === 2 ? 'choose export_choose' : 'export_choose'}
          onClick={() => {
            this.setState({ mapType: 2 })
          }}
        >
          游戏 地图文件<span>(直接在游戏内解析)</span>
        </a>
      </Modal>
    )
  }
  public handleExportOk() {
    this.setState({
      showExport: false
    })
    if (this.state.mapType === 1) {
      this.exportMap()
    } else {
      this.exportGame()
    }
  }
  public handleExportCancel() {
    this.setState({
      showExport: false
    })
  }
  public exportMap() {
    const state: any = this.props.store.toJS()
    state.layer = state.layer.present
    saveFile(state)
  }
  public exportGame() {
    const state: any = this.props.store.toJS()
    state.layer = state.layer.present
    saveGameFile(state)
  }
  public renderNatureModel() {
    const title = this.state.isCreate ? '新建项目' : '网格属性'
    return (
      <Modal
        title={title}
        visible={this.state.showNature}
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <Form layout="inline">
          <Row
            gutter={24}
            className={!this.props.layer.name ? 'show' : 'hidden'}
          >
            <Col span={24}>
              <Form.Item label="地图名称">
                <Input
                  placeholder="Hello Man"
                  value={this.state.gridInf.name}
                  onChange={ev => {
                    this.changeFileName(ev)
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
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
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
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
            </Col>
          </Row>
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
      return
    }
    this.props.onRedo()
  }
  public handleOk() {
    this.setState({
      showNature: false
    })
    if (this.state.isCreate && !this.state.gridInf.name) {
      this.setState((prevState: any) => ({
        gridInf: {
          ...prevState.gridInf,
          name: 'Hello World'
        }
      }))
    }
    this.props.setGridInf({ ...this.state.gridInf, name: 'Hello World' })
  }
  public changeCol(ev: number) {
    this.setState((prevState: any) => ({
      gridInf: {
        ...prevState.gridInf,
        tableCol: ev
      }
    }))
  }
  public changeFileName(ev: any) {
    console.log(ev.target.value)
    this.setState((prevState: any) => ({
      gridInf: {
        ...prevState.gridInf,
        name: ev.target.value
      }
    }))
    ev.persist()
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
  public showConfirm(isCreate: boolean = false) {
    this.setState({
      showNature: true,
      isCreate: isCreate,
      gridInf: {
        tableCol: this.props.layer.tableCol,
        tableRow: this.props.layer.tableRow,
        boxHeight: this.props.layer.boxHeight,
        boxWidth: this.props.layer.boxWidth,
        name: this.props.layer.name
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
    layer: layer.present,
    store: StoreState
  }
}
function mapDispatchToProps(dispatch: any) {
  return {
    delBlock: (payload: { id: number }) => dispatch(Actions.DelBlock(payload)),
    createBlock: (payload: blockItem) => dispatch(Actions.createBlock(payload)),
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo()),
    setGridInf: (payload: constants.GRIDINF) =>
      dispatch(LayerActions.setGridInf(payload)),
    switchShowLine: () => dispatch(LayerActions.showLine()),
    importBlock: (payload: Array<any>) =>
      dispatch(Actions.importBLock(payload)),
    importLayer: (payload: any) => dispatch(LayerActions.importLayer(payload)),
    switchEraser: () => dispatch(LayerActions.switchErser())
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
