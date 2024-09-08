import { Game } from "./Game";

const game = new Game(7, 8)
const restart = document.querySelector('.restart') as HTMLElement
const difficult = document.getElementById('difficult')
restart.addEventListener('click', () => game.restart())
difficult?.addEventListener('click', (e) => game.changeDifficult(e.currentTarget as HTMLSelectElement))
game.start()