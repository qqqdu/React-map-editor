/**
 * 图层组件，类似ps中的图层
 */
import * as React from 'react';
import '@/style/layer.less'
import  { Icon, Switch, Input, Popconfirm }  from 'antd/lib'
// import { connect } from 'react-redux'
// import * as actions from '../redux/actions';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
// 层级关系用直接用数组下标，sort是命名排序
import * as Actions from '@/redux/actions/layer'
import { RENAME_INTER } from '@/constants/layer'
interface LayerItem {
  id: number,
  name: string,
  sort: number,
  show: boolean
}
enum upDown {UP, DOWN}

interface Props {
  name: string;
  enthusiasmLevel?: number;
  cgName: (payload:RENAME_INTER) => void;
  createLayer: () => void;
  delLayer: (payload: {id: number}) => void;
  toggleLayer: (payload: { id: number }) => void;
  switchLayer: (payload: {index: number, type: upDown}) => void;
}
class LayerCom extends React.Component<Props, {}> {
  private layers:Array<LayerItem> = []
  private nowLayers:number = -1
  public state = {
    layers: this.layers,
    nowLayers: this.nowLayers,
    visible: false
  }
  constructor(props: Props) {
    super(props)
    console.log(props)
  }
  public render() {
    return (
      <div className='layer'>
        <h3>图层</h3>
        <div className='layer_content'>
          {this.renderLayers()}
        </div>
        <li className='tools'>
          <a href='javascript:;'>
            <Icon type="plus" onClick={() => this.createLayer()}/>
          </a>
          <Popconfirm title="Are you sure delete this task?"
                      visible={this.state.visible}
                      onVisibleChange={(ev) => {this.handleVisibleChange(ev)}}  
                      onConfirm={() => this.delLayer()} placement='bottom'>
            <a href='javascript:;'>
              <Icon type="delete"/>
            </a>
          </Popconfirm>
          <a href='javascript:;'>
            <Icon type="arrow-up" onClick={() => this.changePosition(upDown.UP)}/>
          </a>
          <a href='javascript:;'>
            <Icon type="arrow-down" onClick={() => this.changePosition(upDown.DOWN)}/>
          </a>
        </li>
      </div>
    );
  }
  public renderLayers() {
    return this.layers.map(item => {
      const chooseLayer = item.id === this.state.nowLayers ? 'chooseLayer' : ''
      console.log(chooseLayer)
      return (
        <li key={item.id} 
            onClick={ () => this.switchLayer(item.id) } 
            className={ chooseLayer }>
          <Switch defaultChecked onChange={ () => this.hideItem(item.id) } />
          <Input defaultValue={'new layer '+item.sort} 
                  size='small'
                  onChange={ ev => { this.reName(ev, item.id) } }
                  style={{
                    width: 120, 
                    border: 0, 
                    backgroundColor: '#fff',}}/>
        </li>
      )
    })
  }
  public handleVisibleChange(visible:boolean) {
    if (this.state.nowLayers <= 0) {
      this.setState({ visible: false });
      return;
    }
    this.setState({ visible });
  }
  public switchLayer(id: number) {
    this.setState({
      nowLayers: id
    })
  }
  public reName(ev:any, id: number) {
    console.log(ev, id)
    this.props.cgName({
      name: ev.target.value,
      id: id
    })
    const layer = this.state.layers.find((item) => {
      return item.id === id
    }) as LayerItem
    layer.name = ev.target.value
    this.setState({
      layers: this.state.layers
    })
  }
  public createLayer() {
    let maxNumberItem = {
      sort: -1
    }
    if(this.state.layers.length) {
      maxNumberItem = this.state.layers.reduce((val1, val2) => {
        if(!val2) return val1
        return val1.sort > val2.sort ? val1 : val2
      })
    }
    this.state.layers.push({
      id: Math.random(),
      name: 'string',
      sort: maxNumberItem.sort + 1,
      show: true
    })
    this.setState({
      layers: this.state.layers
    })
    this.props.createLayer()
  }
  public delLayer() {
    if(this.state.nowLayers < 0) { return }
    const index = this.state.layers.findIndex(item => {
      return item.id === this.state.nowLayers
    })
    this.state.layers.splice(index, 1)
    this.setState({
      layers: this.state.layers
    })
    this.props.delLayer({id: index})
    this.state.nowLayers = -1
  }
  public hideItem(id: number) {
    const layer = this.state.layers.find(item => {
      return item.id === id
    }) as LayerItem
    layer.show = !layer.show
    this.setState({
      layers: this.state.layers
    })
    this.props.toggleLayer({ id })
  }

  public changePosition(type: upDown) {
    
    if(this.state.nowLayers < 0) { return }
    const index = this.state.layers.findIndex(item => {
      return item.id === this.state.nowLayers
    })
    this.props.switchLayer({
      type,
      index
    })
    if(type === upDown.DOWN) {
      if(index === this.state.layers.length - 1) { return }
      // 交换位置
      [this.state.layers[index], this.state.layers[index + 1]] = [this.state.layers[index + 1], this.state.layers[index]]
    } else {
      if(index === 0) { return }
      [this.state.layers[index], this.state.layers[index - 1]] = [this.state.layers[index - 1], this.state.layers[index]]
    }
    this.setState({
      layers: this.state.layers
    })
  }
}
export function mapStateToProps(  { layer: layers  }: StoreState) {
  return {
    layers
  }
}
function mapDispatchToProps(dispatch:any) {
  return {
      cgName: (payload:RENAME_INTER) => dispatch(Actions.cgLayerNameAction(payload)),
      createLayer: () => dispatch(Actions.createLayer()),
      delLayer: (payload: {id: number}) => dispatch(Actions.delLayer(payload)),
      toggleLayer: (payload: {id: number}) => dispatch(Actions.toggleLayer(payload)),
      switchLayer: (payload: {index: number, type: upDown}) => dispatch(Actions.switchLayer(payload))
  }
}
// 合并方法和属性到 Props 上
function mergeProps(stateProps: any, dispatchProps: any, ownProps: any) {
  console.log(ownProps, stateProps, dispatchProps)
  return { ...ownProps, ...stateProps, ...dispatchProps};
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LayerCom)