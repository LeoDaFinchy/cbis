import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Game, { globalGame } from './engine/Game';
import GameComponent from './components/ui/Game/GameComponent';
import Grid from './engine/Grid';

import constants from './constants';
import { Item } from './engine/Item';

const testGame = new Game();
globalGame.game = testGame;

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
    ...Array(1).fill(() => {
        grid = Array.from(testGame.grids.values())[0];
        for(let n in Array(9).fill(null)){
            grid.getRandomAccessibleCell().spawnBoi()
        }
    }),
    () => {
        grid.bois.forEach(boi => {
            boi.startLookingForActivity();
        });
    },
    ...Array(1).fill(() => {
        for(let n in Array(8).fill(null)){
            grid = Array.from(testGame.grids.values())[0];
            const gridCell = grid.getRandomAccessibleCell();
            const item = new Item(gridCell, Math.random() > 0.7 ? ["mat"] : []);
            gridCell.addToContents(item);
        }
    }),
])

document.onclick = () => {
    processes.next();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
