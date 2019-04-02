/**
 * 全局类型的定义
 */
interface LayerItem {
  // 图层id
  id: number,
  // 图层名称
  name: string,
  // 排序
  sort: number,
  // 是否显示
  show: boolean
}
export interface layer { 
  layers: Array<LayerItem>
}