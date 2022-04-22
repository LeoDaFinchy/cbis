import './GridOverlayStyle.css';

import React from 'react';
import SvgComponent from '../Svg/SvgComponent';
import PolylineComponent from '../Svg/PolylineComponent';

interface GridOverlayProps {
    traces: Array<any>
    pixelWidth: number,
    pixelHeight: number
}

const GridOverlay = (props: GridOverlayProps) => {
    const { pixelWidth, pixelHeight, traces } = props;
    return (
        <div className='GridOverlay'>
            <SvgComponent
                height={pixelHeight}
                width={pixelWidth}
            >
                {
                    traces.map((trace, i) => <PolylineComponent key={i} points={trace} />)
                }
            </SvgComponent>
        </div>
    )
}

export default GridOverlay;
