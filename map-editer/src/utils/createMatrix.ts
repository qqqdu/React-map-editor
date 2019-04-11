
import { layer } from "@/types/layer";
export default function createMatrix(state: layer) {
  const map = [];
  for (let i = 0; i < state.tableRow; i++) {
    const row = [];
    for (let j = 0; j < state.tableCol; j++) {
      const col = {
        src: undefined,
        width: state.boxWidth,
        row: state.tableRow,
        col: state.tableCol,
        height: state.boxHeight
      };
      row.push(col);
    }
    map.push(row);
  }
  return map
}