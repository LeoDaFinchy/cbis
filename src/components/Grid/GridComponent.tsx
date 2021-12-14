import './GridStyle.css';

import React from 'react';

import Grid from '../../engine/Grid';
import GridCell from '../../engine/GridCell';

import GridCellComponent from '../GridCell/GridCellComponent';

interface gridProps {
    grid: Grid
}

const GridComponent = (props: gridProps) => {
    const { grid } = props;

    const style = {
        gridTemplateRows: Array(grid.height).fill('auto').join(' ')
    }

    return (
        <div
            className='Grid'
            style={style}
        >
            {
                Array.from(grid.cells).map((cellColumn: Array<GridCell>) => (
                    Array.from(cellColumn).map((cell: GridCell) => (
                        <GridCellComponent key={`${cell.x},${cell.y}`}gridCell={cell} />
                    ))
                ))
            }
        </div>
    )
}

export default GridComponent;
