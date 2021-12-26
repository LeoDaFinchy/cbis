import './GridCellStyle.css';

import React, { useState, useEffect } from 'react';
import GridCell from '../../../engine/GridCell';
import Boi from '../../../engine/Boi';
import BoiComponent from '../Boi/BoiComponent';
import ActivityZone from '../../../engine/ActivityZone';

interface GridCellProps {
    gridCell: GridCell,
    zones: Array<ActivityZone>,
    isInPreviewZone: boolean
}

const GridCellComponent = (props: GridCellProps) => {
    const { gridCell, zones, isInPreviewZone } = props;
    
    const [gridCellData, setGridCellData] = useState(gridCell.asData());

    useEffect(() => {
        gridCell.onGridCellUpdated.add(setGridCellData);
        return () => {gridCell.onGridCellUpdated.remove(setGridCellData)};
    }, [gridCell.onGridCellUpdated]);

    const className = [
        'GridCell',
        `type-${gridCellData.TEMP_terrain_type}`
    ].join(' ');

    if(zones.length >= 1){
        // console.log('hasZone');
    }

    return (
        <div
            className={className}
            onClick={e => {
                gridCellData.cycleTEMP_terrain_type();
                e.stopPropagation();
            }}
            onMouseDown={e => {
                gridCellData.gridCellPressed();
                e.stopPropagation();
            }}
            onMouseEnter={e => {
                gridCellData.gridCellEntered();
                e.stopPropagation();
            }}
            onMouseUp={e => {
                gridCellData.gridCellReleased();
                e.stopPropagation();
            }}
        >
            {
                zones.map((zone: ActivityZone) => (
                    <div
                        key={zone.id}
                        className='ActivityZoneCell'
                    />
                ))
            }
            { isInPreviewZone && 
                <div key='previewZone' className='ActivityZoneCell PreviewZoneCell'/>
            }
            <code key='coordinates'>{gridCellData.position.x},{gridCellData.position.y}</code>
            {
                Array.from(gridCellData.bois.values()).map((boi: Boi) => (
                    <BoiComponent
                        key={boi.id}
                        boi={boi}
                    />
                ))
            }

        </div>
    );
}

export default GridCellComponent;
