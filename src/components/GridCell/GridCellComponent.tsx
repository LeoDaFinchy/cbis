import './GridCellStyle.css';

import React, { useState, useEffect } from 'react';
import GridCell from '../../engine/GridCell';
import Boi from '../../engine/Boi';
import BoiComponent from '../Boi/BoiComponent';

interface GridCellProps {
    gridCell: GridCell
}

const GridCellComponent = (props: GridCellProps) => {
    const { gridCell } = props;
    
    const [gridCellData, setGridCellData] = useState(gridCell.asData());

    useEffect(() => {
        gridCell.onGridCellUpdated.add(setGridCellData);
        return () => {gridCell.onGridCellUpdated.remove(setGridCellData)};
    }, [gridCell.onGridCellUpdated]);

    const className = [
        'GridCell',
        `type-${gridCellData.TEMP_terrain_type}`
    ].join(' ');

    return (
        <div
            className={className}
            onClick={e => {
                gridCellData.cycleTEMP_terrain_type();
                e.stopPropagation();
            }}>
            <code>{gridCellData.x},{gridCellData.y}</code>
            
            <div key='tile' className='second' />
            {
                Array.from(gridCellData.entities.values()).map((entity: Boi) => (
                    <BoiComponent boi={entity} />
                ))
            }

        </div>
    );
}

export default GridCellComponent;
