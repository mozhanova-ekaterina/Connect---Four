import { Game } from "./Game";

const game = new Game( 7, 8)
const restart = document.querySelector('.restart') as HTMLElement
restart.addEventListener('click', () => game.restart())
game.start()