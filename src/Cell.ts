import { colors } from "./colors"

export class Cell {
  index: number
  colors: string[] = colors
  value: string = ''
  column: number
  row: number
  constructor(index: number, column: number, row: number) {
    this.index = index
    this.column = column
    this.row = row
  }

  setColor(val?: string): void {
    if (val) this.value = val
    else this.value = this.colors[Math.floor(Math.random() * this.colors.length)]

  }

  // getColor(): string {
  //   return this.value
  // }
}