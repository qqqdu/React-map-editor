/**
 * 图层组件，类似ps中的图层
 */
import * as React from "react";
import "@/style/layer.less";
import { Icon, Switch, Input, Popconfirm } from "antd/lib";
// import { connect } from 'react-redux'
// import * as actions from '../redux/actions';
// import { StoreState } from '../types/index';
import { LayerItem } from "../types/layer";
import { connect } from "react-redux";
// 层级关系用直接用数组下标，sort是命名排序
import * as Actions from "@/redux/actions/layer";
import { RENAME_INTER } from "@/constants/layer";
enum upDown {
  UP,
  DOWN
}

interface Props {
  layers: Array<LayerItem>;
  name: string;
  enthusiasmLevel?: number;
  curLayerId: number,
  cgName: (payload: RENAME_INTER) => void;
  createLayer: (payload: { id: number }) => void;
  delLayer: (payload: { id: number }) => void;
  toggleLayer: (payload: { id: number }) => void;
  switchLayer: (payload: { index: number; type: upDown }) => void;
  setCurLayer: (payload: number) => void;
  createMatrix: (payload: number) => void;
}
class LayerCom extends React.Component<Props, {}> {
  public state = {
    visible: false
  };
  constructor(props: Props) {
    super(props);
    this.banRouter()
  }
  public banRouter() {
  }
  public render() {
    return (
      <div className="layer">
        <h3>图层</h3>
        <div className="layer_content">{this.renderLayers()}</div>
        <li className="tools">
          <a href="javascript:;">
            <Icon type="plus" onClick={() => this.createLayer()} />
          </a>
          <Popconfirm
            title="Are you sure delete this task?"
            visible={this.state.visible}
            onVisibleChange={ev => {
              this.handleVisibleChange(ev);
            }}
            onConfirm={() => this.delLayer()}
            placement="bottom"
          >
            <a href="javascript:;">
              <Icon type="delete" />
            </a>
          </Popconfirm>
          <a href="javascript:;">
            <Icon
              type="arrow-up"
              onClick={() => this.changePosition(upDown.UP)}
            />
          </a>
          <a href="javascript:;">
            <Icon
              type="arrow-down"
              onClick={() => this.changePosition(upDown.DOWN)}
            />
          </a>
        </li>
      </div>
    );
  }
  public renderLayers() {
    return this.props.layers.map(item => {
      const chooseLayer = item.id === this.props.curLayerId ? "chooseLayer" : "";
      return (
        <li
          key={item.id}
          onClick={() => this.chooseLayer(item.id)}
          className={chooseLayer}
        >
          <Switch defaultChecked onChange={() => this.hideItem(item.id)} />
          <Input
            defaultValue={"new layer " + item.sort}
            size="small"
            onChange={ev => {
              this.reName(ev, item.id);
            }}
            style={{
              width: 120,
              border: 0,
              backgroundColor: "#fff"
            }}
          />
        </li>
      );
    });
  }
  public handleVisibleChange(visible: boolean) {
    if (this.props.curLayerId <= 0) {
      this.setState({ visible: false });
      return;
    }
    this.setState({ visible });
  }
  public chooseLayer(id: number) {
    this.props.setCurLayer(id);
  }
  public reName(ev: any, id: number) {
    this.props.cgName({
      name: ev.target.value,
      id: id
    });
  }
  public createLayer() {
    const id = Math.random()
    this.props.createLayer({
      id
    });
    this.props.createMatrix(id)
  }
  public delLayer() {
    if (this.props.curLayerId < 0) {
      return;
    }
    const index = this.props.layers.findIndex(item => {
      return item.id === this.props.curLayerId;
    });
    this.props.delLayer({ id: index });
    this.props.setCurLayer(-1);
  }
  public hideItem(id: number) {
    this.props.toggleLayer({ id });
  }

  public changePosition(type: upDown) {
    if (this.props.curLayerId < 0) {
      return;
    }
    const index = this.props.layers.findIndex(item => {
      return item.id === this.props.curLayerId;
    });
    this.props.switchLayer({
      type,
      index
    });
  }
}
export function mapStateToProps(StoreState: Map<string, any>) {
  // 问题出现在这里呦
  const layer = StoreState.get("layer").present
  return {
    layers: (layer).layers,
    curLayerId: layer.curLayerId
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    cgName: (payload: RENAME_INTER) =>
      dispatch(Actions.cgLayerNameAction(payload)),
    createLayer: (payload: { id: number }) =>
      dispatch(Actions.createLayer(payload)),
    delLayer: (payload: { id: number }) => dispatch(Actions.delLayer(payload)),
    toggleLayer: (payload: { id: number }) =>
      dispatch(Actions.toggleLayer(payload)),
    switchLayer: (payload: { index: number; type: upDown }) =>
      dispatch(Actions.switchLayer(payload)),
    setCurLayer: (payload: number) => dispatch(Actions.setCurLayer(payload)),
    createMatrix: (payload: number) =>
      dispatch(Actions.createMatrix(payload)),
  };
}
// 合并方法和属性到 Props 上
function mergeProps(stateProps: any, dispatchProps: any, ownProps: any) {
  return { ...ownProps, ...stateProps, ...dispatchProps };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(LayerCom);
