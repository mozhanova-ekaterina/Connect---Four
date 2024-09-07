import { colors } from "./colors"

export class Cell {
  id: number
  colors: string[] = colors
  value: string = ''
  index: number
  row: number
  constructor(id: number, column: number, row: number) {
    this.id = id
    this.index = column - 1
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