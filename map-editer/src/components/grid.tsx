/**
 * 网格
 */
import * as React from "react";
import "@/style/canvas.less";
// import * as GridActions from "@/redux/actions/grid";
import { connect } from "react-redux";
import { blockItem } from "@/types/block";
import { LayerItem } from "@/types/layer";
import * as layerActions from "@/redux/actions/layer";
interface Props {
  curBlock: blockItem | undefined;
  curLayerId: number;
  tableCol: number;
  tableRow: number;
  boxWidth: number;
  boxHeight: number;
  layers: Array<LayerItem>
  drawMatrix:(payload: Array<{x:number, y: number}>) => void;
}
class Grid extends React.Component<Props, {}> {
  public touch: boolean = false;
  public tableDom: any;

  public hello = "hello";
  public state = {
    chooseData: {
      left: "0px",
      top: "0px",
      width: "0px",
      height: "0px"
    }
  };
  public constructor(prop: Props) {
    super(prop);
  }
  public componentDidMount() {
    this.tableDom = document.getElementsByClassName("table-item")[0];
  }
  public render() {
    return (
      <div
        className="table-item"
        onDragStart={() => false}
        onMouseDown={ev => this.startMouse(ev)}
        onMouseMove={ev => {
          this.moveMouse(ev);
        }}
        onScroll={ev => {
          this.scroll(ev);
        }}
        onMouseUp={ev => {
          this.upMouse(ev);
        }}
      >
        {this.mapLayers()}
        <div className="m-choose" style={this.state.chooseData} />
      </div>
    );
  }
  // 遍历图层
  public mapLayers() {
    return this.props.layers.map((layer, index) => {
      return (<div className='layer-item' key={layer.id}>
        { this.renderMatrix(layer, index) }
      </div>)
    })
  }
  // 渲染单元格
  public renderMatrix(layer:LayerItem, layerIndex:number) {
    const className = layerIndex === 0 ? 'item item-grid' : 'item'
    const itemStyle = {
      width: this.props.boxWidth + "px",
      height: this.props.boxHeight + "px"
    };
    return layer.matrix.map((row, index) => {
      const cols = row.map((item, indexT) => {
        const key = `${index}-${indexT}`
        if (item.src) {
          return (
            <div className={className} key={key} style={itemStyle}>
              <img
                onDragStart={() => {
                  return false;
                }}
                src={item.src}
              />
            </div>
          );
        } else {
          return <div className={className} key={key} style={itemStyle} />;
        }
      });
      return (
        <div className="row" key={index}>
          {cols}
        </div>
      );
    });
  }

  public setChooseData() {
    this.setState({
      chooseData: {
        left: "0px",
        top: "0px",
        width: "0px",
        height: "0px"
      }
    });
  }
  private getChooseDataNumber(): {
    left: number;
    top: number;
    width: number;
    height: number;
  } {
    let data = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
    for (let key in this.state.chooseData) {
      data[key] = Number(
        this.state.chooseData[key].slice(
          0,
          this.state.chooseData[key].length - 2
        )
      );
    }
    return data;
  }
  public startMouse(ev: any) {
    this.setChooseData();
    const y =
      ev.pageY -
      Number(this.tableDom.offsetTop) -
      document.documentElement.scrollTop;
    const x =
      ev.pageX - Number(this.tableDom.offsetLeft) + this.tableDom.scrollLeft;
    this.setState((prevState: any) => ({
      chooseData: {
        left: x + "px",
        top: y + "px",
        width: prevState.chooseData.width,
        height: prevState.chooseData.height
      }
    }));
    this.touch = true;
  }
  public scroll(ev: any) {}
  public moveMouse(ev: any) {
    if (!this.touch) {
      return;
    }
    const { left, top } = this.getChooseDataNumber();
    const x =
      ev.pageX -
      left -
      Number(this.tableDom.offsetLeft) +
      this.tableDom.scrollLeft;
    const y =
      ev.pageY -
      top -
      Number(this.tableDom.offsetTop) -
      document.documentElement.scrollTop +
      this.tableDom.scrollTop;
    this.setState((prevState: any) => ({
      chooseData: {
        width: x + "px",
        height: y + "px",
        left: prevState.chooseData.left,
        top: prevState.chooseData.top
      }
    }));
  }
  // 得到已选中的单元框数组
  private setChoose() {
    // 得到选择框对应父元素的相对位置
    const { left, top, width, height } = this.getChooseDataNumber();
    // x，y 开始格子坐标
    const startX = Math.ceil(left / this.props.boxWidth) - 1;
    const startY = Math.ceil(top / this.props.boxHeight) - 1;
    // x, y 结束格子坐标
    const endX = Math.ceil((left + width) / this.props.boxWidth);
    const endY = Math.ceil((top + height) / this.props.boxHeight);
    this.drawBlock(startX,startY,endX,endY)
  }
  private drawBlock(startX:number, startY:number, endX:number, endY: number) {
    if(!this.props.curBlock) {
      return
    }
    const curChoose:Array<{x: number, y:number}> = []
    for (let i = startX; i < endX; i++) {
      for (let j = startY; j < endY; j++) {
        curChoose.push({
          x: j,
          y: i
        })
        // this.matrix[j] &&
        //   this.matrix[j][i] &&
        //   (this.matrix[j][i].src = (this.props.curBlock as blockItem).src);
      }
    }
    this.props.drawMatrix(curChoose)
  }
  public upMouse(ev: any) {
    this.touch = false;
    this.setChoose();
    this.setChooseData();
    ev.preventDefault();
  }
}

export function mapStateToProps(StoreState: Map<string, any>) {
  const layer = StoreState.get("layer");
  return {
    layers: layer.layers,
    curBlock: layer.curBlock,
    curLayerId: layer.curLayerId,
    tableCol: layer.tableCol,
    tableRow: layer.tableRow,
    boxWidth: layer.boxWidth,
    boxHeight: layer.boxHeight
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    drawMatrix: (payload: Array<{x:number, y: number}>) => dispatch(layerActions.drawMatrix(payload))
  };
}
// 合并方法和属性到 Props 上
function mergeProps(stateProps: any, dispatchProps: any, ownProps: any) {
  console.log(ownProps, stateProps, dispatchProps);
  return { ...ownProps, ...stateProps, ...dispatchProps };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Grid);
