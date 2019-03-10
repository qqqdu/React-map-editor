/**
 * 图层组件，类似ps中的图层
 */
import * as React from 'react';
import '../style/canvas.css'
interface matrixItem {
  img: string | undefined,
  row: number,
  col: number
}
class Canvas extends React.Component {
  private matrix:Array<Array<matrixItem>>;
  private tableRow:number = 10;
  private tableCol:number = 10
  public touch: boolean = false;
  public tableDom:any
  private currentImg: string = 'http://img1.imgtn.bdimg.com/it/u=1992085767,102835282&fm=26&gp=0.jpg'
  
  public hello = 'hello'
  private itemData: {
    width: number;
    height: number;
  } = {
    width: 40,
    height: 40
  }
  public state = {
    chooseData: {
        left: '0px',
        top: '0px',
        width: '0px',
        height: '0px'
    }
  }
  public constructor(prop:any) {
    super(prop);
    this.createMatrix()
  }
  public componentDidMount() {
    this.tableDom = document.getElementsByClassName('table-item')[0]
  }
  public render() {
    return (
    <div className='table-item' onDragStart={ () => false }
          onMouseDown = { ev => this.startMouse(ev) }
          onMouseMove={ (ev) => { this.moveMouse(ev) } }
          onScroll={ (ev) => { this.scroll(ev) } }
          onMouseUp={ (ev) => { this.upMouse(ev) } }>
      { this.renderMatrix() }
      <div className='m-choose' style={ this.state.chooseData }></div>
    </div>
    );
  }
  // 渲染单元格
  public renderMatrix() {
    const itemStyle = {
      width: this.itemData.width+"px",
      height: this.itemData.height+"px"
    }
    return this.matrix.map((row, index) => {
      const cols = row.map((item) => {
        if(item.img) {
          return (
            <div className='item' key={ item.col } style={ itemStyle }>
              <img onDragStart={ () => { return false } } src={ item.img }/>
            </div>
          )
        } else {
          return <div className='item' key={ item.col }></div>
        }
      })
      return (
        <div className='row' key={ index }>{ cols }</div>
      )
    })
  }

  // 生成数据
  public createMatrix() {
    const map = []
    for(let i = 0; i< this.tableRow;i++) {
      const row = []
      for(let j = 0; j< this.tableCol; j++) {
        const col = {
          img: undefined,
          row: i,
          col: j
        }
        row.push(col)
      }
      map.push(row)
    }
    this.matrix =  map
  }

  public setChooseData() {
    this.setState({
      chooseData: {
        left: '0px',
        top: '0px',
        width: '0px',
        height: '0px'
      }
    })
  }
  public clickMethod() {

    this.setState({
      hello: 'fuckyou'
    })
  }
  private getChooseDataNumber(): {left: number,top: number,width: number,height: number}{
    let data = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    }
    for(let key in this.state.chooseData) {
      data[key] = Number(this.state.chooseData[key].slice(0, this.state.chooseData[key].length-2))
    }
    return data
  }
  public startMouse(ev: any) {
    this.setChooseData()
    const y = ev.pageY - 
              Number(this.tableDom.offsetTop) - 
              document.documentElement.scrollTop
    const x = ev.pageX -
    Number(this.tableDom.offsetLeft) +
    this.tableDom.scrollLeft
    this.setState((prevState:any)=>({ 
      chooseData:  {
        left: x + 'px',
        top: y + 'px',
        width: prevState.chooseData.width,
        height: prevState.chooseData.height
      }
    }))
    this.touch = true
  }
  public scroll(ev:any) {
  }
  public moveMouse(ev: any) {
    if(!this.touch) {return}
    const {
      left, top
    } = this.getChooseDataNumber()
    const x = ev.pageX - 
              left -
              Number(this.tableDom.offsetLeft) +
              this.tableDom.scrollLeft
    const y = ev.pageY - 
              top - 
              Number(this.tableDom.offsetTop) - 
              document.documentElement.scrollTop +
              this.tableDom.scrollTop
    this.setState((prevState:any) => ({
      chooseData: {
        width: x+'px',
        height: y + 'px',
        left: prevState.chooseData.left,
        top: prevState.chooseData.top
      }
    }))
  }
  // 得到已选中的单元框数组
  private setChoose() {
    // 得到选择框对应父元素的相对位置
    const {
      left, top, width, height
    } = this.getChooseDataNumber()
    // x，y 开始格子坐标
    const startX = Math.ceil(left / this.itemData.width) - 1
    const startY = Math.ceil(top / this.itemData.height) - 1 
    // x, y 结束格子坐标
    const endX = Math.ceil((left + width)/ this.itemData.width)
    const endY = Math.ceil((top + height) / this.itemData.height)
    for(let i = startX; i < endX; i++) {
      for(let j = startY; j < endY; j++) {
        this.matrix[j] && this.matrix[j][i] && (this.matrix[j][i].img = this.currentImg)
      }
    }
  }
  public upMouse(ev:any) {
    this.touch = false
    this.setChoose()
   this.setChooseData()
    ev.preventDefault();
  }
}

export default Canvas;
