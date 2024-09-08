import { Game } from "./Game";

const restart = document.querySelector('.restart') as HTMLElement
const selectDifficult = document.getElementById('difficult')
let difficult: string = '7x8'
const game = new Game(difficult)

selectDifficult?.addEventListener('click', (e) => {
  const select = e.currentTarget as HTMLSelectElement
  const newValue = select.value
  
  if (newValue != difficult) {
    difficult = newValue
    game.restart(difficult)
  }
})
restart.addEventListener('click', () => game.restart())
game.start()