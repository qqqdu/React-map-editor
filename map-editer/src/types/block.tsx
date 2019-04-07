export interface blockItem {
  id: number,
  src: string,
  width: number,
  height: number,
  name: string
}

export interface block {
  blockList: Array<blockItem>
}