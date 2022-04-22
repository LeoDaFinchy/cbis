import './SvgStyle.css';

import React from 'react';

interface PolylineProps {
    points: Array<[number, number]>
}

const PolylineComponent = (props: PolylineProps) => {
    const { points } = props;

    const pointData = points.map(point => `${point[0]},${point[1]}`).join(' ');

    return (
        <polyline className='Polyline' points={pointData} />
    )
}

export default PolylineComponent;
