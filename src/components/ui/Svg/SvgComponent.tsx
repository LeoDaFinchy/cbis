import './SvgStyle.css';

import React from 'react';

interface SvgProps {
    children: Array<any>,
    width: number,
    height: number
}

const SvgComponent = (props: SvgProps) => {
    const { width, height, children } = props;
    return (
        <svg viewBox={`0 0 ${width} ${height}`} className='Svg'>
            {children}
        </svg>
    )
}

export default SvgComponent;
