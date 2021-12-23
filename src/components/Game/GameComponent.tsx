import './GameStyle.css';

import React, { useEffect, useState } from 'react';

import Game from '../../engine/Game';
import Grid from '../../engine/Grid';

import GridComponent from '../Grid/GridComponent';

interface gameProps {
    game: Game
}

const GameComponent = (props: gameProps) => {
    const {game} = props;

    const [gameData, setGameData] = useState(game.asData());

    useEffect(() => {
        game.onGameUpdated.add(setGameData);
        return () => {game.onGameUpdated.remove(setGameData)};
    }, [game.onGameUpdated]);

    return (
        <div className='Game'>
            {
                Array.from(gameData.grids).map((grid: Grid) => <GridComponent key={grid.id} grid={grid} />)
            }
        </div>
    )
}

export default GameComponent;
