import { Cell } from "./Cell"

export class Game {
  board: Cell[][] = []
  row: number
  column: number
  size: number
  constructor(difficult: string) {
    this.row = +difficult.split('x')[0]
    this.column = +difficult.split('x')[1]
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
    while (this.connectFour()) {
      this.board.forEach(row => row.forEach(cell => cell.setColor()))
    }
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
              <div class='circle' draggable="true" style='background:${cell.value}'></div>
            </div>
          `
        )
      )
    }))
    this.moveHandler()
    this.connectFour({ clear: true })
  }

  moveHandler() {
    const cells = document.querySelectorAll('.cell')
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
      const direction = this.getDirection(xStart, xEnd, yStart, yEnd)

      this.moveTo(direction, event.currentTarget as HTMLElement)
      this.connectFour({ clear: true })
      setTimeout(() => {
        this.render()
      }, 250);
    }))
  }

  moveTo(direction: string, target: HTMLElement) {
    const id = +target.id
    const cell = this.findCell(id)
    const rowId = cell.rowId
    const cellId = cell.index
    const currentValue = cell.value

    switch (direction) {
      case 'right':
        const cellRight = this.board[rowId][cellId + 1]
        cell.setColor(cellRight.value)
        cellRight.setColor(currentValue)
        target.classList.add('right')
        target.nextElementSibling?.classList.add('left')

        break;
      case 'left':
        const cellLeft = this.board[rowId][cellId - 1]
        cell.setColor(cellLeft.value)
        cellLeft.setColor(currentValue)
        target.classList.add('left')
        target.previousElementSibling?.classList.add('right')
        break;
      case 'up':
        const cellUp = this.board[rowId - 1][cellId]
        cell.setColor(cellUp.value)
        cellUp.setColor(currentValue)
        target.classList.add('up')
        document.getElementById(`${+target.id - this.column}`)?.classList.add('down')
        break;
      case 'down':
        const cellDown = this.board[rowId + 1][cellId]
        cell.setColor(cellDown.value)
        cellDown.setColor(currentValue)
        target.classList.add('down')
        document.getElementById(`${+target.id + this.column}`)?.classList.add('up')
        break;
      default:
        break;
    }
  }

  connectFour(options = { clear: false }) {
    let equals: Cell[] = []
    for (let i = 0; i < this.row; i++) {
      let equalsInRow: Cell[] = []
      for (let j = 0; j < this.column - 1; j++) {
        const currentCell = this.board[i][j]
        const nextCell = this.board[i][j + 1]
        if (currentCell.value === nextCell.value) {
          equalsInRow.push(currentCell)
        }
        else {
          equalsInRow = []
        }
        if (equalsInRow.length >= 3) {
          equals = [...equalsInRow, nextCell]
        }
      }
    }
    for (let i = 0; i < this.column; i++) {
      let equalsInColumn: Cell[] = []
      for (let j = 0; j < this.row - 1; j++) {
        const currentCell = this.board[j][i]
        const nextCell = this.board[j + 1][i]
        if (currentCell.value === nextCell.value) {
          equalsInColumn.push(currentCell)
        }
        else {
          equalsInColumn = []
        }
        if (equalsInColumn.length >= 3) {
          equals = [...equals, ...equalsInColumn, nextCell]
        }
      }
    }
    if (equals.length > 3) {
      options.clear && this.clear(equals)
      return true
    }
    return false
  }

  findCell(id: number): Cell {
    const rowId = Math.ceil(id / this.column) - 1
    const columnId = (id % this.column || this.column) - 1
    return this.board[rowId][columnId]
  }

  clear(equals: Cell[]) {
    const elementList = equals.map(cell => document.getElementById(`${cell.id}`))
    equals.forEach(cell => cell.setColor())
    elementList.forEach(el => el?.classList.add('clear'))
    setTimeout(() => {
      this.render()
    }, 250);
  }

  getDirection(x1: number, x2: number, y1: number, y2: number): string {
    if (x2 > x1 && x2 - x1 > 50 && Math.abs(y1 - y2) <= 100) {
      return 'right'
    }
    else if (x2 < x1 && x1 - x2 > 50 && Math.abs(y1 - y2) <= 100) {
      return 'left'
    }
    else if (y1 > y2 && y1 - y2 > 50 && Math.abs(x1 - x2) <= 100) {
      return 'up'
    }
    else if (y2 > y1 && y2 - y1 > 50 && Math.abs(x1 - x2) <= 100) {
      return 'down'
    }
    else {
      return ''
    }
  }

  restart(difficult?: string) {
    if (difficult) {
      this.row = +difficult.split('x')[0]
      this.column = +difficult.split('x')[1]
      this.render()
    }
    else {
      window.location.reload()
    }

  }
}