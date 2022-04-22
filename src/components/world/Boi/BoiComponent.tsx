import './BoiStyle.css';

import React, { useState, useEffect } from 'react';
import Boi from '../../../engine/Boi';

interface BoiProps {
    boi: Boi
}

const BoiComponent = (props: BoiProps) => {
    const { boi } = props;
    
    const [BoiData, setBoiData] = useState(boi.asData());

    useEffect(() => {
        boi.onBoiActivityChanged.add(setBoiData);
        return () => {
            boi.onBoiActivityChanged.remove(setBoiData);
        };
    }, [
        boi.onBoiActivityChanged,
    ]);

    const className = [
        'Boi',
        BoiData.activeActivity?.definition.name || ''
    ].filter(classNameSegment => classNameSegment.length > 0).join(' ');

    return (
        <div
            className={className}
        >
        </div>
    );
}

export default BoiComponent;
