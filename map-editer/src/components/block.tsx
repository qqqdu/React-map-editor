/**
 * 图块组件
 * 图块组件就是网格基本单元
 */

import * as React from "react";
import { connect } from "react-redux";
import "@/style/block.less";
import { Icon, Popconfirm } from "antd/lib";
import * as Actions from "@/redux/actions/block";
import { blockItem } from "@/types/block";
import * as LayerActions from "@/redux/actions/layer";
import { Map } from 'immutable';
interface Props {
  blockList: Array<blockItem>;
  delBlock: (payload: { id: number }) => void;
  createBlock: (payload: blockItem) => void;
  setCurBlock: (payload: blockItem | undefined) => void;
}
class BLockCom extends React.Component<Props, {}> {
  public blockList: Array<blockItem> = [];
  public state = {
    visible: false,
    nowBlock: -1
  };
  constructor(props: Props) {
    super(props);
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

          <Popconfirm
            title="Are you sure delete this task?"
            visible={this.state.visible}
            onVisibleChange={ev => {
              this.handleVisibleChange(ev);
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
      </div>
    );
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
            border: block.id === this.state.nowBlock ? "1px solid red" : ""
          }}
        />
      );
    });
  }

  public switchBlock(id: number) {
    this.setState({
      nowBlock: id
    });
    const curBlock = this.props.blockList.find(block => {
      return block.id === id;
    });
    this.props.setCurBlock(curBlock);
  }
  public handleVisibleChange(visible: boolean) {
    if (this.state.nowBlock <= 0) {
      this.setState({ visible: false });
      return;
    }
    this.setState({ visible });
  }
  public delBlock() {
    const delId = this.props.blockList.findIndex(block => {
      return block.id === this.state.nowBlock;
    });
    this.props.delBlock({
      id: delId
    });
    this.setState({
      nowBlock: -1
    });
  }
  public changeImg(ev: any) {
    const dom = document.getElementById("imgUpFile") as HTMLInputElement;
    const files = dom.files as FileList;
    if (!files || !files.length) {
      return;
    }
    Array.from(files).map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart = function() {
        console.log("文件上传处理......");
      };
      //操作完成
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          this.props.createBlock({
            src: reader.result as string,
            width: image.width,
            height: image.height,
            name: file.name,
            id: Math.random()
          });
        };
      };
    });
  }
}

export function mapStateToProps(StoreState: Map<string, any>) {
  const block = StoreState.get("block").toJS().blockList
  return {
    blockList: block
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    delBlock: (payload: { id: number }) => dispatch(Actions.DelBlock(payload)),
    createBlock: (payload: blockItem) => dispatch(Actions.createBlock(payload)),
    setCurBlock: (payload: blockItem) =>
      dispatch(LayerActions.setCurBlock(payload))
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
)(BLockCom);
