export interface blockItem {
  id: number,
  src: string,
  width: number,
  height: number,
  name: string,
  extra: Array<any>
}

export interface block {
  blockList: Array<blockItem>
}