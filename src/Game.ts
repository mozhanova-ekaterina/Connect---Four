import { Cell } from "./Cell"

export class Game {
  board: Cell[][] = []
  row: number
  column: number
  size: number
  constructor(n: number, m: number) {
    this.row = n
    this.column = m
    this.size = this.column * this.row
  }

  start() {
    this.createBoard()
    this.render()
  }

  createBoard() {
    for (let i = 1; i <= this.row; i++) {
      const row = []
      for (let j = 1; j <= this.column; j++) {
        row.push(new Cell((i - 1) * this.column + j, j, i))
      }
      this.board.push(row)
    }

    this.board.forEach(row => row.forEach(cell => cell.setColor()))

    while (this.hasFour()) {
      this.board.forEach(row => row.forEach(cell => cell.setColor()))
    }

    // console.log('BOARD', this.board);
    // console.log('hasFour', this.hasFour());

  }

  render() {
    const boardElement = document.querySelector('.board') as HTMLElement
    boardElement.innerHTML = ''
    boardElement.style.gridTemplate = `repeat(${this.row}, 100px) / repeat(${this.column}, 100px)`
    this.board.forEach(row => row.forEach(cell => {
      return (
        boardElement?.insertAdjacentHTML('beforeend',
          `
            <div class='cell' id='${cell.id}' data-value='${cell.value}' >
              <div class='circle' draggable="true" style='background:${cell.value}'>${cell.id}</div>
            </div>
          `
        )
      )
    }))
    this.moveHandler()
  }

  moveHandler() {
    const cells = document.querySelectorAll('.cell')
    let direction = ''
    let xStart = 0
    let yStart = 0
    cells.forEach(cell => cell.addEventListener('dragstart', e => {
      const event = e as DragEvent
      xStart = event.screenX
      yStart = event.screenY
    }))
    cells.forEach(cell => cell.addEventListener('dragend', e => {
      const event = e as DragEvent
      const xEnd = event.screenX
      const yEnd = event.screenY
      if (xEnd > xStart && xEnd - xStart > 50 && Math.abs(yStart - yEnd) <= 100) {
        direction = 'right'
      }
      else if (xEnd < xStart && xStart - xEnd > 50 && Math.abs(yStart - yEnd) <= 100) {
        direction = 'left'
      }
      else if (yStart > yEnd && yStart - yEnd > 50 && Math.abs(xStart - xEnd) <= 100) {
        direction = 'up'
      }
      else if (yEnd > yStart && yEnd - yStart > 50 && Math.abs(xStart - xEnd) <= 100) {
        direction = 'down'
      }

      this.moveTo(direction, event.currentTarget as HTMLElement)
      this.hasFour({ clear: true })
      this.render()
    }))
  }

  moveTo(direction: string, target: HTMLElement) {
    const id = +target.id
    const cell = this.findCell(id)
    const rowId = cell.row - 1
    const cellId = this.board[rowId].findIndex(cell => cell.id == id)
    const currentValue = cell.value

    switch (direction) {
      case 'right':
        const cellRight = this.board[rowId][cellId + 1]
        cell.setColor(cellRight.value)
        cellRight.setColor(currentValue)
        break;
      case 'left':
        const cellLeft = this.board[rowId][cellId - 1]
        cell.setColor(cellLeft.value)
        cellLeft.setColor(currentValue)
        break;
      case 'up':
        const cellUp = this.board[rowId - 1][cellId]
        cell.setColor(cellUp.value)
        cellUp.setColor(currentValue)
        break;
      case 'down':
        const cellDown = this.board[rowId + 1][cellId]
        cell.setColor(cellDown.value)
        cellDown.setColor(currentValue)
        break;

    }
    this.render()
  }

  hasFour(options = { clear: false }) {

    for (let i = 0; i < this.row; i++) {
      const currentRow = this.board[i]
      let qty = 0
      for (let j = 0; j < this.column - 1; j++) {
        const currentCell = currentRow[j]
        const nextCell = currentRow[j + 1]
        currentCell.value === nextCell.value ? qty++ : qty = 0
        if (qty === 3) {
          options.clear && this.clear(currentCell.value, this.board[i])
          return true
        }
      }
    }
    for (let i = 0; i < this.column; i++) {
      let qty = 0
      for (let j = 0; j < this.row - 1; j++) {
        const currentCell = this.board[j][i]
        const nextCell = this.board[j + 1][i]
        currentCell.value === nextCell.value ? qty++ : qty = 0
        if (qty === 3) {
          options.clear && this.clear(currentCell.value, this.board.map(row => row[i]))
          return true
        }
      }
    }
    return false
  }

  findCell(id: number): Cell {
    const rowId = Math.ceil(id / this.column) - 1
    const columnId = (id % this.column || this.column) - 1
    return this.board[rowId][columnId]
  }

  clear(val : string, arr: Cell[]){
    arr.forEach(cell => cell.value === val && cell.setColor())
  }
}