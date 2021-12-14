import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Game from './engine/Game';
import GameComponent from './components/Game/GameComponent';

const testGame = new Game();

ReactDOM.render(
    <React.StrictMode>
        <GameComponent game={testGame} />
    </React.StrictMode>,
    document.getElementById('root')
);

const processes = (function*(processes: Array<Function>) {
    while (true){
        yield processes.shift()
    }
})([
    () => { testGame.createGrid(15, 15);},
    ...Array(1).fill(() => {
        const grid = Array.from(testGame.grids.values())[0];
        grid.cells[
            Math.floor(Math.random() * grid.width)
        ][
            Math.floor(Math.random() * grid.height)
        ].spawnBoi()
    })
])

document.onclick = () => {
    processes.next().value?.();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
