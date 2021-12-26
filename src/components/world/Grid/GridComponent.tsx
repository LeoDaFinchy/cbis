import './GridStyle.css';

import React, { useState, useEffect } from 'react';

import Grid from '../../../engine/Grid';
import GridCell from '../../../engine/GridCell';

import GridCellComponent from '../GridCell/GridCellComponent';
import GridOverlayComponent from '../../ui/GridOverlay/GridOverlayComponent';
import AStar from '../../../engine/AStar';
import Point2D from '../../../engine/Point2D';

import constants from '../../../constants';
import ActivityZone from '../../../engine/ActivityZone';

interface gridProps {
    grid: Grid
}

const traceGridWidth = constants.gridWidth + constants.gridSpacing;
const traceGridHeight = constants.gridHeight + constants.gridSpacing;

function getTracesFromAStar (aStar: AStar){
    const paths = aStar.getPathsBack();
    const traces = paths.map(path => {
        const trace = path.map(node => {
            return node.position.scaledBy([traceGridWidth, traceGridHeight]).plus(new Point2D((constants.gridWidth / 2) + constants.gridSpacing, (constants.gridHeight / 2) + constants.gridSpacing)).asArray()
        })
        return trace;
    });
    return traces;
}

const GridComponent = (props: gridProps) => {
    const { grid } = props;

    const [gridData, setGridData] = useState(grid.asData());

    useEffect(() => {
        grid.onGridUpdated.add(setGridData);
        return () => {grid.onGridUpdated.remove(setGridData)};
    }, [grid.onGridUpdated]);

    const style = {
        gridTemplateRows: Array(gridData.height).fill('auto').join(' ')
    }

    const gridPixelHeight = (gridData.height * constants.gridHeight) + ((gridData.height + 1) * constants.gridSpacing);
    const gridPixelWidth = (gridData.width * constants.gridWidth) + ((gridData.width + 1) * constants.gridSpacing);

    const traces = gridData.routes
        .map(route => getTracesFromAStar(route))
        .reduce((accum, bunchOfTraces) => accum.concat(bunchOfTraces), []);

    return (
        <div
            className='Grid'
            style={style}
        >
            {
                Array.from(gridData.cells).map((cellColumn: Array<GridCell>) => (
                    Array.from(cellColumn).map((cell: GridCell) => (
                        <GridCellComponent
                            key={`${cell.position.x},${cell.position.y}`} 
                            gridCell={cell}
                            zones={gridData.zones.filter((zone:ActivityZone) => zone.contains(cell))}
                            isInPreviewZone={gridData.previewZone?.contains(cell) ?? false}
                        />
                    ))
                ))
            }
            <GridOverlayComponent
                traces={traces}
                pixelWidth={gridPixelWidth}
                pixelHeight={gridPixelHeight}
            />
        </div>
    )
}

export default GridComponent;
