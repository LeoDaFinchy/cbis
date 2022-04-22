import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Game from './engine/Game';
import GameComponent from './components/ui/Game/GameComponent';
import Grid from './engine/Grid';

import constants from './constants';

const testGame = new Game();

ReactDOM.render(
    <React.StrictMode>
        {':root{'}
        {`--grid-width: ${constants.gridWidth}px;`}
        {`--grid-height: ${constants.gridHeight}px;`}
        {`--grid-spacing: ${constants.gridSpacing}px`}
        {'}'}
    </React.StrictMode>,
    document.getElementById('root-style')
);

ReactDOM.render(
    <React.StrictMode>
        <GameComponent game={testGame} />
    </React.StrictMode>,
    document.getElementById('root')
);

let grid: Grid;

const generator = function* gen(inputs: Iterable<Function>){
    for(const input of inputs){
        yield input()
    }
}

const processes = generator([
    () => { 
        testGame.createGrid(15, 15);
    },
    ...Array(10).fill(() => {
        grid = Array.from(testGame.grids.values())[0];
        grid.getRandomAccessibleCell().spawnBoi()
    }),
    () => {
        grid.bois.forEach(boi => {
            const destination = grid.getRandomAccessibleCell();
            boi.startRouting(destination)
        });
    },
])

document.onclick = () => {
    processes.next();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
